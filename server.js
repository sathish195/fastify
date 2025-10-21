const fastify = require("fastify")({ logger: true });
const connectDB = require("./db");
const connectRedis = require("./redis");
const routes = require("./helpers.js/routes");

const start = async () => {
  try {
    await connectDB(fastify);
    await connectRedis(fastify); 
    routes(fastify);

    const port = process.env.PORT || 4000;

    // Correct usage: pass port and host inside an object
    await fastify.listen({ port: port, host: "0.0.0.0" });

    fastify.log.info(`🚀 Server running at http://0.0.0.0:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
