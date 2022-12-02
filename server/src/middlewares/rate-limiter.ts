import rateLimiter from "express-rate-limit";

const rateLimiterMiddleware = (minutes: number, max: number) =>
  rateLimiter({
    windowMs: minutes * 60 * 1000,
    max: max,
    message: `You can only make ${max} requests every ${minutes} minutes`,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

export default rateLimiterMiddleware;
