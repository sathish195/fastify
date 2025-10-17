// ✅ Correct CommonJS export
const middleware = async (req, reply) => {
  const x = true;
  console.log("middleware");
  if (!x) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
};

module.exports = middleware;
