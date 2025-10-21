// redis.js
const fastifyRedis = require("@fastify/redis");

module.exports = async function (fastify) {
  try {
    await fastify.register(fastifyRedis, {
      host: "redis-13247.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
      port: 13247,
      password: "JG8S0vwtOulEpNJPXprPwbrIkj679Yzl",
      // url: "redis://:<JG8S0vwtOulEpNJPXprPwbrIkj679Yzl>@<redis-13247.c305.ap-south-1-1.ec2.redns.redis-cloud.com>:<13247>",
      // url: `redis://127.0.0.1:6379`,
    });

    fastify.log.info("✅ Redis connected");
  } catch (err) {
    fastify.log.error("❌ Redis connection error:", err);
    process.exit(1);
  }
};

// // lookups using
// router.post("/lookups", async (req, res) => {
//   // let userid = "CBEFFDDAD3853CTOP";

//   // const pipeline = [
//   //   {
//   //     $match: { userid, amount: 100 },
//   //   },
//   //   {
//   //     // $sort: { time: -1 },
//   //     // $count: "total",
//   //     $limit: 2,
//   //   },
//   // ];

//   // const pipeline = [
//   //   {
//   //     $group: {
//   //       _id: "$amount",
//   //       avgamount: {
//   //         $avg: "$amount",
//   //       },
//   //     },
//   //   },
//   // ];

//   // const pipeline = [
//   //   {
//   //     $group: {
//   //       _id: null,
//   //       avgamount: { $avg: "$amount" },
//   //     },
//   //   },
//   // ];
//   let userid = "F5FB4FB297D423TOP";
//   const pipeline = [
//     {
//       $match: {
//         userid: userid, // only get tickets for this user
//       },
//     },
//     {
//       $lookup: {
//         from: "members",
//         localField: "userid",
//         foreignField: "userid",
//         as: "user",
//       },
//     },
//     {
//       $unwind: "$user",
//     },
//     {
//       $project: {
//         userid: 1,
//         ticket_id: 1,
//         subject: 1,
//         name: "$user.member_name",
//         email: "$user.member_email",
//         _id: 0,
//       },
//     },
//   ];

//   const data = await mongofunctions.aggregate("Ticket", pipeline);

//   console.log(data.length);

//   console.log(data);
//   return res.status(200).send(data);
// });
