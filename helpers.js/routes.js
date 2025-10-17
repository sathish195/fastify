const userRoutes = require("../routes/index");
const productRoutes = require("../routes/products");

async function registerRoutes(fastify, options) {
  fastify.register(userRoutes);
  fastify.register(productRoutes);
}

module.exports = registerRoutes;
