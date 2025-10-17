// const { Queue } = require("bullmq");

// const processQueue1 = new Queue("TOPprocess", {
//   connection: {
//     url: "redis://127.0.0.1:6379",
//   },
// });

// module.exports = {
//   bull: async (data, prior) => {
//     console.log(data, "poawdkf;ioaerjfiuawrefgk00e004034w0-=------");

//     try {
//       const s_data = JSON.stringify(data);

//       const res = await processQueue1.add(
//         "TOP_meta_process",
//         { data: s_data },
//         {
//           priority: prior,
//           removeOnComplete: true,
//           removeOnFail: true,
//         }
//       );

//       // Log result if needed
//       // console.log("Added job:", res);

//       if (res && res.data) return res.data;

//       return true;
//     } catch (err) {
//       console.error("❌ BullMQ Error (metaprocess):", err);
//       // Provide more detailed error info
//       throw new Error(`Error adding job to BullMQ: ${err.message}`);
//     }
//   },
// };

// bullmq-setup.js
const { Queue, QueueEvents } = require("bullmq");

const connection = {
  url: "redis://127.0.0.1:6379",
};

module.exports = {
  queueEvents: new QueueEvents("myqueue", {
    connection: connection,
  }),
  bull: async (data, prior) => {
    const queue = new Queue("myqueue", {
      connection: {
        url: connection,
      },
    });

    return queue.add("create_user", data, {
      priority: prior,
      removeOnComplete: true,
      removeOnFail: true,
    });
  },
};
