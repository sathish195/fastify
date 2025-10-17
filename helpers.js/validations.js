// schemas/productSchema.js
module.exports = {
  productSchema: {
    body: {
      type: "object",
      required: ["name", "description", "price", "category", "stock", "images"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
            category: {
            type: "string",
            enum: [
              "Electronics",
              "Clothing",
              "Home",
              "Books",
              "Toys",
              "Beauty",
              "Sports"
            ]
          },
        stock: { type: "number" },
        images: { type: "array", items: { type: "string" } },
        brand: { type: "string" },
        size: { type: "string" },
        color: { type: "string" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          product: { type: "object" },
        },
      },
    },
  },
};
