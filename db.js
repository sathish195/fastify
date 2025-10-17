// db.js
const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://sathishdundigala999:microlending199@microlending.pnenyi3.mongodb.net/microLending?retryWrites=true&w=majority&appName=microLending",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB connected via Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// fastify.register(
//   require("fastify-postgres"),
//   {
//     connectionString: "postgres://postgres:12345@localhost:5432/ecom",
//   },
//   (err) => {
//     if (err) {
//       console.error("❌ Failed to connect to PostgreSQL:", err.message);
//       process.exit(1); // optional: stop the app
//     } else {
//       console.log("✅ PostgreSQL plugin registered successfully");
//     }
//   }
// );

// db/postgres.js

// const fp = require("fastify-plugin");
// const fastifyPostgres = require("fastify-postgres");
// console.log("data------> to store");
// async function postgresConnector(fastify, options) {
//   fastify.register(fastifyPostgres, {
//     connectionString: "postgres://postgres:12345@localhost:5432/ecom",
//   });
// }

// Export as Fastify plugin
// module.exports = fp(postgresConnector);
