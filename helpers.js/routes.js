const userRoutes = require("../routes/index");
const productRoutes = require("../routes/products");

async function registerRoutes(fastify, options) {
  // Default root route
  fastify.get("/", async (request, reply) => {
    return { message: "✅ FASTIFY IS RUNNIG!" };
  });

  fastify.register(userRoutes);
  fastify.register(productRoutes);
}

module.exports = registerRoutes;
