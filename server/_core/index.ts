import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ═══════════════════════════════════════════════════════
  // WALL 6: Helmet — Security headers
  // ═══════════════════════════════════════════════════════
  app.use(helmet({
    contentSecurityPolicy: false, // Let Vite handle CSP in dev
    crossOriginEmbedderPolicy: false, // Allow CDN resources
  }));

  // ═══════════════════════════════════════════════════════
  // CORS — Origin allowlist
  // ═══════════════════════════════════════════════════════
  const allowedOrigins = [
    /^https?:\/\/localhost(:\d+)?$/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
    /\.manus\.space$/,
    /\.manus\.im$/,
    /\.manus\.app$/,
  ];
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(pattern => pattern.test(origin))) {
        return callback(null, true);
      }
      // In development, allow all origins for preview
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }));

  // ═══════════════════════════════════════════════════════
  // WALL 2: Body parser — Reduced from 50MB to 10MB
  // ═══════════════════════════════════════════════════════
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // ═══════════════════════════════════════════════════════
  // WALL 1: Rate limiting — Tiered
  // ═══════════════════════════════════════════════════════
  // General API: 100 requests per minute
  const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. The field needs silence." },
  });

  // LLM-backed endpoints: 10 requests per minute
  const llmLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Frequency overload. Let the resonance settle." },
    // Use default keyGenerator (handles IPv6 correctly)
  });

  // Field entry: 5 requests per minute (anti-frequency-poisoning)
  const fieldLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "The field is calibrating. Wait for the silence." },
  });

  // Apply general limiter to all API routes
  app.use("/api/trpc", generalLimiter);

  // Apply stricter limiters to specific tRPC batch paths
  // tRPC batches requests, so we intercept based on query params
  app.use("/api/trpc", (req, _res, next) => {
    const url = req.url || "";
    // LLM-heavy endpoints
    if (url.includes("nail.analyze") || 
        url.includes("visitor.getReading") || 
        url.includes("diagnosis.generateHex")) {
      return llmLimiter(req, _res, next);
    }
    // Field entry endpoints
    if (url.includes("field.enter") || 
        url.includes("field.receiveSeed")) {
      return fieldLimiter(req, _res, next);
    }
    next();
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Security: Helmet ✓ | CORS ✓ | Rate Limit ✓ | Body 10MB ✓`);
  });
}

startServer().catch(console.error);
