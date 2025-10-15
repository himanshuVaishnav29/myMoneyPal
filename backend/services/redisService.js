import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

const initRedis = async () => {
    try {
        let redisConfig;
        
        if (process.env.REDIS_URL) {
            redisConfig = process.env.REDIS_URL;
        } else {
            // Use individual config for local development
            redisConfig = {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD || undefined,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: false,
                connectTimeout: 10000,
                commandTimeout: 5000
            };
        }
        
        console.log('Connecting to Redis with config:', typeof redisConfig === 'string' ? 'REDIS_URL' : { ...redisConfig, password: redisConfig.password ? '***' : undefined });
        
        redisClient = new Redis(redisConfig);

        redisClient.on('connect', () => {
            console.log('Redis connected successfully');
        });
        
        redisClient.on('ready', () => {
            console.log('Redis ready for commands');
        });

        redisClient.on('error', (err) => {
            console.log('Redis connection error:', err.message);
        });
        
        redisClient.on('close', () => {
            console.log('Redis connection closed');
        });
        
        // Test connection
        await redisClient.ping().then(() => {
            console.log('Redis ping successful');
        }).catch((err) => {
            console.log('Redis ping failed:', err.message);
            redisClient = null;
        });
    } catch (error) {
        console.log('Redis initialization failed:', error.message);
        redisClient = null;
    }
};

// Initialize Redis
initRedis();

export const cache = {
    async get(key) {
        if (!redisClient) return null;
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.log('Redis get error:', error);
            return null;
        }
    },

    async set(key, value, ttl = 300) {
        if (!redisClient) return false;
        try {
            await redisClient.setex(key, ttl, JSON.stringify(value));
            return true;
        } catch (error) {
            console.log('Redis set error:', error);
            return false;
        }
    },

    async del(key) {
        if (!redisClient) return false;
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.log('Redis del error:', error);
            return false;
        }
    },

    async invalidatePattern(pattern) {
        if (!redisClient) return false;
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
            }
            return true;
        } catch (error) {
            console.log('Redis invalidate error:', error);
            return false;
        }
    }
};

export default redisClient;