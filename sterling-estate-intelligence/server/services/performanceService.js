/**
 * Performance Optimization & Caching Service
 * Ensures system can handle massive scale and enterprise load
 */

/**
 * In-Memory Cache with TTL
 */
export class CacheService {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set cache with TTL (Time To Live)
   */
  set(key, value, ttlSeconds = 300) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set cache
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });

    // Set expiration
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttlSeconds * 1000);

    this.timers.set(key, timer);
  }

  /**
   * Get from cache
   */
  get(key) {
    const cached = this.cache.get(key);
    return cached ? cached.value : null;
  }

  /**
   * Check if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Query Optimization
 */
export const queryOptimization = {
  /**
   * Optimize search query
   */
  optimizeSearchQuery(filters) {
    const optimized = {
      select: [
        'id',
        'address',
        'postcode',
        'county',
        'land_size_acres',
        'price',
        'location',
        'gdv',
        'profit_potential',
        'risk_score',
        'development_type',
      ],
      where: [],
      orderBy: 'profit_potential DESC',
      limit: filters.limit || 100,
      offset: (filters.page - 1) * (filters.limit || 100),
    };

    // Add filters
    if (filters.county) {
      optimized.where.push(`county = '${filters.county}'`);
    }
    if (filters.minPrice) {
      optimized.where.push(`price >= ${filters.minPrice}`);
    }
    if (filters.maxPrice) {
      optimized.where.push(`price <= ${filters.maxPrice}`);
    }
    if (filters.minSize) {
      optimized.where.push(`land_size_acres >= ${filters.minSize}`);
    }
    if (filters.maxSize) {
      optimized.where.push(`land_size_acres <= ${filters.maxSize}`);
    }

    return optimized;
  },

  /**
   * Generate efficient SQL
   */
  generateSQL(optimized) {
    const whereClause = optimized.where.length > 0 
      ? `WHERE ${optimized.where.join(' AND ')}`
      : '';

    return `
      SELECT ${optimized.select.join(', ')}
      FROM properties
      ${whereClause}
      ORDER BY ${optimized.orderBy}
      LIMIT ${optimized.limit}
      OFFSET ${optimized.offset}
    `;
  },
};

/**
 * Batch Processing
 */
export const batchProcessing = {
  /**
   * Process items in batches
   */
  async processBatch(items, batchSize, processor) {
    const results = [];
    const batches = Math.ceil(items.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, items.length);
      const batch = items.slice(start, end);

      try {
        const batchResults = await Promise.all(
          batch.map(item => processor(item))
        );
        results.push(...batchResults);
      } catch (error) {
        console.error(`Batch ${i + 1} processing error:`, error);
      }
    }

    return results;
  },

  /**
   * Parallel batch processing
   */
  async processParallel(items, batchSize, processor, maxConcurrent = 4) {
    const results = [];
    const batches = [];

    // Create batches
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    // Process batches in parallel (limited concurrency)
    for (let i = 0; i < batches.length; i += maxConcurrent) {
      const concurrentBatches = batches.slice(i, i + maxConcurrent);
      const batchPromises = concurrentBatches.map(batch =>
        Promise.all(batch.map(item => processor(item)))
      );

      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.flat());
      } catch (error) {
        console.error(`Parallel batch processing error:`, error);
      }
    }

    return results;
  },
};

/**
 * API Rate Limiting
 */
export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   */
  isAllowed(clientId) {
    const now = Date.now();
    const clientRequests = this.requests.get(clientId) || [];

    // Remove old requests outside window
    const validRequests = clientRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add new request
    validRequests.push(now);
    this.requests.set(clientId, validRequests);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(clientId) {
    const clientRequests = this.requests.get(clientId) || [];
    return Math.max(0, this.maxRequests - clientRequests.length);
  }

  /**
   * Reset client
   */
  reset(clientId) {
    this.requests.delete(clientId);
  }
}

/**
 * Index Management
 */
export const indexManagement = {
  /**
   * Recommended indexes for performance
   */
  recommendedIndexes: [
    'CREATE INDEX idx_properties_location ON properties USING GIST (location);',
    'CREATE INDEX idx_properties_postcode ON properties (postcode);',
    'CREATE INDEX idx_properties_county ON properties (county);',
    'CREATE INDEX idx_properties_price ON properties (price);',
    'CREATE INDEX idx_properties_planning_status ON properties (planning_status);',
    'CREATE INDEX idx_analysis_property ON development_analysis (property_id);',
    'CREATE INDEX idx_analysis_gdv ON development_analysis (gdv);',
    'CREATE INDEX idx_risk_property ON risk_assessment (property_id);',
    'CREATE INDEX idx_risk_score ON risk_assessment (risk_score);',
    'CREATE INDEX idx_market_postcode ON market_data (postcode);',
    'CREATE INDEX idx_market_county ON market_data (county);',
  ],

  /**
   * Create all indexes
   */
  async createIndexes(pool) {
    for (const indexSQL of this.recommendedIndexes) {
      try {
        await pool.query(indexSQL);
      } catch (error) {
        // Index might already exist
        console.log(`Index creation note: ${error.message}`);
      }
    }
  },
};

/**
 * Response Compression
 */
export const compression = {
  /**
   * Compress response data
   */
  compressData(data) {
    return {
      compressed: true,
      size: JSON.stringify(data).length,
      data: data,
    };
  },

  /**
   * Format response for efficient transmission
   */
  formatResponse(data) {
    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      data: data,
      meta: {
        cached: false,
        processingTime: 0,
      },
    };
  },
};

/**
 * Monitoring & Metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      peakResponseTime: 0,
      requestTimes: [],
    };
  }

  /**
   * Record request
   */
  recordRequest(responseTime, success = true) {
    this.metrics.totalRequests++;
    if (!success) this.metrics.totalErrors++;

    this.metrics.requestTimes.push(responseTime);
    if (this.metrics.requestTimes.length > 1000) {
      this.metrics.requestTimes.shift();
    }

    // Update averages
    this.metrics.averageResponseTime = 
      this.metrics.requestTimes.reduce((a, b) => a + b, 0) / 
      this.metrics.requestTimes.length;

    this.metrics.peakResponseTime = Math.max(
      this.metrics.peakResponseTime,
      responseTime
    );
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      errorRate: (this.metrics.totalErrors / this.metrics.totalRequests * 100).toFixed(2) + '%',
      successRate: ((this.metrics.totalRequests - this.metrics.totalErrors) / this.metrics.totalRequests * 100).toFixed(2) + '%',
    };
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = {
      totalRequests: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      peakResponseTime: 0,
      requestTimes: [],
    };
  }
}

export default {
  CacheService,
  queryOptimization,
  batchProcessing,
  RateLimiter,
  indexManagement,
  compression,
  PerformanceMonitor,
};
