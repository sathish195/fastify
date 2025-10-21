const { Worker } = require("bullmq");
require("../db")();
const User = require("../modals/user");

const connection = {
  // url: "redis://127.0.0.1:6379",
  url: "redis://:<JG8S0vwtOulEpNJPXprPwbrIkj679Yzl>@<redis-13247.c305.ap-south-1-1.ec2.redns.redis-cloud.com>:<13247>", // Replace with actual URL
};

// Start BullMQ Worker
const worker = new Worker(
  "myqueue", // Queue name (must match producer)
  async (job) => {
    console.log("📥 Received job:", job.name, job.data);

    if (job.name === "create_user") {
      const { name, email, password } = job.data;
      console.log(job.data);

      if (!name || !email || !password) {
        throw new Error("Missing required fields: name, email, password");
      }

      // Save user to DB
      const user = new User({ name, email, password });

      const savedUser = await user.save();
      console.log("✅ User created:", savedUser);

      return savedUser;
    } else {
      console.warn("⚠️ Unknown job type:", job.name);
    }
  },
  { connection }
);

// Log worker start
console.log("🚀 Worker started and listening on 'myqueue'...");

// Handle job failures
worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
