import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup Redis Client (Conditional)
let redisClient;
if (process.env.REDIS_URL) {
    console.log("⚡ Rate Limiting: Using Redis Store");
    redisClient = new Redis(process.env.REDIS_URL);
} else {
    console.log("⚠️ Rate Limiting: Using Memory Store (Redis URL not found)");
}

// 2. Helper to create a limiter with common options
const createLimiter = (windowMinutes, maxRequests, keyPrefix, message) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: { 
            message: message, 
            extensions: { code: 'TOO_MANY_REQUESTS' } 
        },
        // If Redis is available, use it. Otherwise default to MemoryStore.
        store: redisClient ? new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
            prefix: `rl:${keyPrefix}:`,
        }) : undefined,
        // Key Generator Logic
        keyGenerator: (req) => {
            // Priority 1: Logged in User ID (for General limits)
            if (req.user && req.user._id) {
                return req.user._id.toString();
            }
            // Priority 2: IP Address (for Auth/OTP or unauthenticated)
            return req.headers['x-forwarded-for'] || req.ip;
        }
    });
};

// 3. Define the specific Limiters based on your requirements
// Env variables with fallbacks
const AUTH_WINDOW = process.env.RATE_LIMIT_AUTH_WINDOW || 15;
const AUTH_MAX = process.env.RATE_LIMIT_AUTH_MAX || 10;

const OTP_WINDOW = process.env.RATE_LIMIT_OTP_WINDOW || 5;
const OTP_MAX = process.env.RATE_LIMIT_OTP_MAX || 3;

const GEN_WINDOW = process.env.RATE_LIMIT_GEN_WINDOW || 15;
const GEN_MAX = process.env.RATE_LIMIT_GEN_MAX || 100;

const authLimiter = createLimiter(AUTH_WINDOW, AUTH_MAX, 'auth', "Too many login/signup attempts. Please try again later.");
const otpLimiter = createLimiter(OTP_WINDOW, OTP_MAX, 'otp', "Too many OTP requests. Please wait a moment.");
const generalLimiter = createLimiter(GEN_WINDOW, GEN_MAX, 'gen', "You are doing that too much. Please slow down.");

// 4. The Switcher Middleware
export const graphQLRateLimiter = async (req, res, next) => {
    // Safety check: ensure body is parsed
    if (!req.body || !req.body.query) {
        return generalLimiter(req, res, next);
    }

    const query = req.body.query;
    const operationName = req.body.operationName || "";

    // Normalize for checking
    const queryNormalized = query.replace(/\s+/g, ' ').toLowerCase();

    // --- OTP MUTATIONS CHECK ---
    // Matches: SendSignupOTP, VerifySignupOTP, ResendVerificationOTP, VerifyEmailOTP, VerifyOTPAndResetPassword
    // We check for specific keywords in your mutation names
    if (queryNormalized.includes('mutation') && (
        queryNormalized.includes('otp') || 
        operationName.toLowerCase().includes('otp')
    )) {
        return otpLimiter(req, res, next);
    }

    // --- AUTH MUTATIONS CHECK ---
    // Matches: Login, SignUp, RequestPasswordReset
    if (queryNormalized.includes('mutation') && (
        queryNormalized.includes('login') || 
        queryNormalized.includes('signup') ||
        queryNormalized.includes('requestpasswordreset')
    )) {
        return authLimiter(req, res, next);
    }

    // --- GENERAL LIMITER ---
    // Everything else (Dashboard, Transactions, Profile, etc.)
    return generalLimiter(req, res, next);
};