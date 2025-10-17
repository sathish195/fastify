// rateLimiter.js
const rateLimit = require("@fastify/rate-limit");

async function rateLimiter(fastify, options) {
  await fastify.register(rateLimit, {
    max: options.max || 1, // default 1 request
    timeWindow: options.timeWindow || 5000, // default 5 seconds
    keyGenerator:
      options.keyGenerator || ((req) => req.headers["x-real-ip"] || req.ip),
  });
}

module.exports = rateLimiter;
