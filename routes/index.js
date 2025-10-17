const User = require("../modals/user");
const { myQueue } = require("../bullmq/addjobs");
const { bull, queueEvents } = require("../bullmq/addjobs");
const rateLimit = require("../helpers.js/ratelimiter");
const auth = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const user = require("../modals/user");
const jwt = require("jsonwebtoken");

module.exports = async function (fastify) {
  // Rate limit only for /rate route
  // Register rate limiter plugin scoped to /rate route only
  await fastify.register(async (fastifyScoped) => {
    // Apply rate limiter with 1 request per 5 seconds to this scope
    await rateLimit(fastifyScoped, { max: 1, timeWindow: 5000 });

    // ✅ POST /register
    fastify.post("/register", {
      schema: {
        body: {
          type: "object",
          required: ["name", "email", "password", "user_type"],
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            user_type: { type: "string", maxLength: 1 },
          },
        },
      },
      handler: async (req, res) => {
        let { name, email, password, user_type } = req.body;
        // console.log(req.body);

        try {
          const exists = await User.findOne({ email });
          console.log(exists);
          if (exists) {
            return res.status(409).send({
              success: false,
              message: "Email already exists",
            });
          }
          // let data = req.body;
          // const job = await bull("data", 1);
          // const result = await job.waitUntilFinished(queueEvents);

          // console.log(result);
          // return res.status(200).send(result);
          const salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(password, salt);
          const user = new User({ name, email, password, user_type });
          const store = await user.save();
          console.log(store);
          let j = await fastify.redis.set(store._id, store);
          console.log(j);

          res.status(201).send({
            success: true,
            message: "User registered",
            data: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (err) {
          fastify.log.error(err);
          res.status(400).send({
            success: false,
            message: "Registration failed",
            error: err.message,
          });
        }
      },
    });
    // login route
    // login route
    fastify.post("/login", {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
      },
      handler: async (req, res) => {
        let { email, password } = req.body;
        console.log(req.body);

        try {
          // Find user by email
          const user = await User.findOne({ email: email }); // Use findOne instead of find

          // ✅ Check if user exists based on email
          if (!user) {
            return res.status(400).send("User not found.");
          }

          // Log the user object for debugging purposes
          console.log(user);

          // Check if password is undefined or null
          if (!user.password) {
            return res.status(400).send("No password found for this user.");
          }

          // Compare password with the hashed password in the database
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return res
              .status(400)
              .send("Incorrect Password. Please Try Again.");
          }
          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            user_type: user.type,
          };
          let SECRET_KEY = "sdfserfersfsrefswrtegswerg";
          // const jwt = jwt.sign(payload, "fastfy", { expiresIn: "1h" });
          const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

          // Respond with success and user data
          res.status(200).send({
            token: token,
            message: "Login successful",
          });
        } catch (err) {
          fastify.log.error(err);
          res.status(500).send({
            success: false,
            message: "Login failed",
            error: err.message,
          });
        }
      },
    });

    const mongoose = require("mongoose");

    // ✅ GET /users
    fastify.get("/users", async (req, res) => {
      try {
        // const users = await User.find();
        const db = mongoose.connection.db;

        // Access the 'users' collection
        const collection = db.collection("users");

        // Get all documents
        // const documents = await collection.find({}).toArray();

        // const collection = mongoose.connection.db.collection('users');
        const users = await collection.find({}).limit(100).toArray();

        console.log(users);

        res.send({
          success: true,
          count: users.length,
          data: users,
        });
      } catch (err) {
        fastify.log.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to fetch users",
          error: err.message,
        });
      }
    });

    //   fastifyScoped.get("/rate", { preHandler: auth }, async (req, res) => {
    //     try {
    //       res.send({
    //         success: true,
    //       });
    //     } catch (err) {
    //       fastify.log.error(err);
    //       res.status(500).send({
    //         success: false,
    //         message: "Failed to fetch users",
    //         error: err.message,
    //       });
    //     }
    //   });
  });
};
