const fastify = require("fastify")({ logger: true });
const connectDB = require("./db");
const connectRedis = require("./redis");
const routes = require("./helpers.js/routes");

const start = async () => {
  try {
    // await connectDB(fastify);
    fastify.register(require("./db"));

    await connectRedis(fastify);
    // await worker();
    routes(fastify);
    await fastify.listen({ port: 3000 });
    fastify.log.info("🚀 Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
