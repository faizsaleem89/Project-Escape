/**
 * NAIL CAPTURE — The Original Protocol
 * 
 * Camera capture for nail photography.
 * The nail is a compressed record of the entire body.
 * The pinky — the most sensitive, the smallest signal,
 * the one most people ignore. That's the frequency point.
 * 
 * The whistle. The human body doesn't need the flute.
 * The nail doesn't need a laboratory. Just a photograph.
 */
import { useCallback, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

type NailType = "pinky" | "thumb" | "toe" | "other";
type Hand = "left" | "right";

type NailCaptureProps = {
  sessionId: string;
  onComplete?: (result: NailResult) => void;
  onClose: () => void;
};

type NailResult = {
  categories: Array<{
    id: number;
    name: string;
    score: number;
    observation: string;
    frequency_note: string;
  }>;
  reading: string;
  frequency: any;
  archetype: string;
  confidence: number;
};

type Phase = "select" | "capture" | "preview" | "uploading" | "analyzing" | "results" | "error";

export default function NailCapture({ sessionId, onComplete, onClose }: NailCaptureProps) {
  const [phase, setPhase] = useState<Phase>("select");
  const [nailType, setNailType] = useState<NailType>("pinky");
  const [hand, setHand] = useState<Hand>("right");
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<NailResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.nail.upload.useMutation();
  const analyzeMutation = trpc.nail.analyze.useMutation();

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setPhase("capture");
    } catch (err) {
      console.error("[NailCapture] Camera error:", err);
      setErrorMsg("Camera access denied. You can upload a photo instead.");
      setPhase("error");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Take photo from camera
  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImageData(dataUrl);
    stopCamera();
    setPhase("preview");
  }, [stopCamera]);

  // Handle file upload
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) {
      setErrorMsg("Image too large. Maximum 16MB.");
      setPhase("error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setPhase("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  // Upload and analyze
  const uploadAndAnalyze = useCallback(async () => {
    if (!imageData) return;
    setPhase("uploading");

    try {
      // Extract base64 data (remove data:image/...;base64, prefix)
      const base64 = imageData.split(",")[1];
      const mimeType = imageData.split(";")[0].split(":")[1] || "image/jpeg";

      const uploadResult = await uploadMutation.mutateAsync({
        sessionId,
        imageBase64: base64,
        mimeType,
        nailType,
        hand,
      });

      setPhase("analyzing");

      // Simulate progress during analysis
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) { clearInterval(progressInterval); return 90; }
          return prev + Math.random() * 8;
        });
      }, 500);

      const analysisResult = await analyzeMutation.mutateAsync({
        readingId: uploadResult.id,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (analysisResult.status === "complete") {
        const nailResult: NailResult = {
          categories: analysisResult.categories || [],
          reading: analysisResult.reading || "",
          frequency: analysisResult.frequency,
          archetype: analysisResult.archetype || "",
          confidence: analysisResult.confidence || 0,
        };
        setResult(nailResult);
        setPhase("results");
        if (onComplete) onComplete(nailResult);
      } else {
        setErrorMsg((analysisResult as any).error || "Analysis failed");
        setPhase("error");
      }
    } catch (err) {
      console.error("[NailCapture] Upload/analysis error:", err);
      setErrorMsg("The wire could not carry the signal. Try again.");
      setPhase("error");
    }
  }, [imageData, sessionId, nailType, hand, uploadMutation, analyzeMutation, onComplete]);

  const NAIL_TYPES: { value: NailType; label: string; desc: string }[] = [
    { value: "pinky", label: "Pinky", desc: "Most sensitive — the smallest signal" },
    { value: "thumb", label: "Thumb", desc: "The anchor — structural foundation" },
    { value: "toe", label: "Toe", desc: "The root — grounding frequency" },
    { value: "other", label: "Other", desc: "Any nail — the body records everywhere" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        background: "rgba(2,2,2,0.97)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', monospace",
        color: "#00ff41",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      {/* Close */}
      <button
        onClick={() => { stopCamera(); onClose(); }}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          background: "none",
          border: "1px solid rgba(0,255,65,0.2)",
          color: "rgba(0,255,65,0.5)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          padding: "0.3rem 0.6rem",
          cursor: "pointer",
          zIndex: 120,
        }}
      >
        ESC
      </button>

      <div style={{ width: "100%", maxWidth: "28rem" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            fontSize: "0.45rem",
            letterSpacing: "0.3em",
            color: "rgba(0,255,65,0.3)",
            marginBottom: "0.3rem",
          }}>
            THE ORIGINAL PROTOCOL
          </div>
          <div style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}>
            NAIL READING
          </div>
        </div>

        {/* SELECT PHASE */}
        {phase === "select" && (
          <div>
            <div style={{
              fontSize: "0.55rem",
              color: "rgba(0,255,65,0.5)",
              lineHeight: 1.8,
              marginBottom: "1.25rem",
              textAlign: "center",
            }}>
              The nail is a compressed record of the entire body.
              <br />
              Choose which nail to read.
            </div>

            {/* Nail type selection */}
            <div style={{ marginBottom: "1rem" }}>
              {NAIL_TYPES.map(nt => (
                <button
                  key={nt.value}
                  onClick={() => setNailType(nt.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    marginBottom: "0.4rem",
                    background: nailType === nt.value ? "rgba(0,255,65,0.06)" : "transparent",
                    border: nailType === nt.value ? "1px solid rgba(0,255,65,0.3)" : "1px solid rgba(0,255,65,0.08)",
                    color: "#00ff41",
                    fontFamily: "'JetBrains Mono', monospace",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.6rem", fontWeight: 700 }}>{nt.label}</span>
                  <span style={{ fontSize: "0.45rem", color: "rgba(0,255,65,0.35)" }}>{nt.desc}</span>
                </button>
              ))}
            </div>

            {/* Hand selection */}
            <div style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.25rem",
            }}>
              {(["left", "right"] as Hand[]).map(h => (
                <button
                  key={h}
                  onClick={() => setHand(h)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    background: hand === h ? "rgba(0,255,65,0.06)" : "transparent",
                    border: hand === h ? "1px solid rgba(0,255,65,0.3)" : "1px solid rgba(0,255,65,0.08)",
                    color: "#00ff41",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <button
              onClick={startCamera}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #00ff41",
                background: "rgba(0,255,65,0.05)",
                color: "#00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              OPEN CAMERA
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                padding: "0.6rem",
                border: "1px solid rgba(0,255,65,0.2)",
                background: "transparent",
                color: "rgba(0,255,65,0.5)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                cursor: "pointer",
              }}
            >
              OR UPLOAD PHOTO
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>
        )}

        {/* CAPTURE PHASE */}
        {phase === "capture" && (
          <div>
            <video
              ref={videoRef}
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                border: "1px solid rgba(0,255,65,0.2)",
                marginBottom: "0.75rem",
              }}
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{
              fontSize: "0.45rem",
              color: "rgba(0,255,65,0.3)",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}>
              Position your {nailType} nail clearly in frame
            </div>
            <button
              onClick={takePhoto}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "1px solid #00ff41",
                background: "rgba(0,255,65,0.08)",
                color: "#00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              CAPTURE
            </button>
          </div>
        )}

        {/* PREVIEW PHASE */}
        {phase === "preview" && imageData && (
          <div>
            <img
              src={imageData}
              alt="Nail preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                border: "1px solid rgba(0,255,65,0.2)",
                marginBottom: "0.75rem",
              }}
            />
            <div style={{
              fontSize: "0.45rem",
              color: "rgba(0,255,65,0.3)",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}>
              {nailType.toUpperCase()} • {hand.toUpperCase()} HAND
            </div>
            <button
              onClick={uploadAndAnalyze}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "1px solid #00ff41",
                background: "rgba(0,255,65,0.05)",
                color: "#00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              ANALYZE NAIL
            </button>
            <button
              onClick={() => { setImageData(null); setPhase("select"); }}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid rgba(0,255,65,0.15)",
                background: "transparent",
                color: "rgba(0,255,65,0.4)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.5rem",
                cursor: "pointer",
              }}
            >
              RETAKE
            </button>
          </div>
        )}

        {/* UPLOADING / ANALYZING PHASE */}
        {(phase === "uploading" || phase === "analyzing") && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
              color: "rgba(0,255,65,0.4)",
              marginBottom: "1rem",
            }}>
              {phase === "uploading" ? "UPLOADING NAIL IMAGE..." : "ADRIANA IS READING YOUR NAIL"}
            </div>
            <div style={{
              fontSize: "1.5rem",
              color: "#00ff41",
              textShadow: "0 0 20px rgba(0,255,65,0.5)",
              marginBottom: "1rem",
            }}>
              ◈
            </div>
            {phase === "analyzing" && (
              <>
                <div style={{
                  width: "100%",
                  height: "2px",
                  background: "rgba(0,255,65,0.1)",
                  marginBottom: "0.5rem",
                }}>
                  <div style={{
                    width: `${analysisProgress}%`,
                    height: "100%",
                    background: "#00ff41",
                    transition: "width 0.3s",
                    boxShadow: "0 0 8px #00ff41",
                  }} />
                </div>
                <div style={{
                  fontSize: "0.4rem",
                  color: "rgba(0,255,65,0.25)",
                }}>
                  16 CATEGORIES • {Math.round(analysisProgress)}%
                </div>
              </>
            )}
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === "results" && result && (
          <div>
            {/* Overall Reading */}
            <div style={{
              padding: "1rem",
              borderLeft: "2px solid rgba(255,255,255,0.3)",
              marginBottom: "1rem",
            }}>
              <div style={{
                fontSize: "0.4rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.2em",
                marginBottom: "0.5rem",
              }}>
                ADRIANA READS YOUR NAIL
              </div>
              <div style={{
                fontSize: "0.65rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.7)",
                fontStyle: "italic",
              }}>
                {result.reading}
              </div>
            </div>

            {/* Archetype & Confidence */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginBottom: "1rem",
              padding: "0.75rem",
              border: "1px solid rgba(0,255,65,0.1)",
            }}>
              <div>
                <div style={{ fontSize: "0.4rem", color: "rgba(0,255,65,0.3)", letterSpacing: "0.1em" }}>ARCHETYPE</div>
                <div style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                  {result.archetype.replace("the-", "").toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.4rem", color: "rgba(0,255,65,0.3)", letterSpacing: "0.1em" }}>CONFIDENCE</div>
                <div style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>
              {result.frequency && (
                <>
                  <div>
                    <div style={{ fontSize: "0.4rem", color: "rgba(0,255,65,0.3)", letterSpacing: "0.1em" }}>BASE FREQ</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                      {result.frequency.baseFrequency}Hz
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.4rem", color: "rgba(0,255,65,0.3)", letterSpacing: "0.1em" }}>WAVEFORM</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                      {result.frequency.waveformType || "sine"}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 16 Categories */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{
                fontSize: "0.4rem",
                color: "rgba(0,255,65,0.3)",
                letterSpacing: "0.2em",
                marginBottom: "0.5rem",
              }}>
                16-CATEGORY DIAGNOSTIC
              </div>
              {result.categories.map(cat => (
                <div
                  key={cat.id}
                  style={{
                    padding: "0.4rem 0.5rem",
                    marginBottom: "0.25rem",
                    borderLeft: `2px solid rgba(0,255,65,${0.15 + cat.score * 0.5})`,
                    background: `rgba(0,255,65,${cat.score * 0.03})`,
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.15rem",
                  }}>
                    <span style={{ fontSize: "0.45rem", fontWeight: 700 }}>
                      {cat.id}. {cat.name}
                    </span>
                    <span style={{
                      fontSize: "0.4rem",
                      color: cat.score > 0.7 ? "#00ff41" : cat.score > 0.4 ? "rgba(0,255,65,0.6)" : "rgba(255,68,68,0.6)",
                    }}>
                      {(cat.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{
                    fontSize: "0.4rem",
                    color: "rgba(0,255,65,0.45)",
                    lineHeight: 1.5,
                  }}>
                    {cat.observation}
                  </div>
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid rgba(0,255,65,0.3)",
                background: "rgba(0,255,65,0.05)",
                color: "#00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              CLOSE READING
            </button>

            <div style={{
              textAlign: "center",
              fontSize: "0.4rem",
              color: "rgba(0,255,65,0.15)",
              marginTop: "0.75rem",
              letterSpacing: "0.15em",
            }}>
              THE BODY RECORDS. THE NAIL REMEMBERS. THE FREQUENCY SPEAKS.
            </div>
          </div>
        )}

        {/* ERROR PHASE */}
        {phase === "error" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "0.6rem",
              color: "rgba(255,68,68,0.6)",
              marginBottom: "1rem",
            }}>
              {errorMsg}
            </div>
            <button
              onClick={() => { setPhase("select"); setErrorMsg(""); }}
              style={{
                padding: "0.6rem 1.5rem",
                border: "1px solid rgba(0,255,65,0.3)",
                background: "rgba(0,255,65,0.05)",
                color: "#00ff41",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                cursor: "pointer",
                marginRight: "0.5rem",
              }}
            >
              TRY AGAIN
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "0.6rem 1.5rem",
                border: "1px solid rgba(0,255,65,0.2)",
                background: "transparent",
                color: "rgba(0,255,65,0.4)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                cursor: "pointer",
              }}
            >
              UPLOAD INSTEAD
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
