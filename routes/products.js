const fastify = require("fastify")({ logger: true });
const Product = require("../modals/product");
const middleware = require("../middlewares/auth");
const { productSchema } = require("../helpers.js/validations");
const rateLimiter = require("../helpers.js/ratelimiter");
const product = require("../modals/product");

// Create a Product (POST)
module.exports = async function (fastify) {
  fastify.post("/products", {
    preValidation: middleware,
    schema: productSchema,
    confing: rateLimiter,
    handler: async (req, res) => {
      try {
        const productData = req.body;
        const product = new Product(productData);
        product = await product.save();
        console.log(product);

        res.status(201).send({
          success: true,
          message: "Product created successfully",
          product,
        });
      } catch (err) {
        fastify.log.error(err);
        res.status(500).send({
          success: false,
          message: "Product creation failed",
          error: err.message,
        });
      }
    },
  });


  

  // get unque
  fastify.post("/unique_product", {
    handler: async (req, res) => {
      const search = req.body.search;
      console.log(search);
      if (!search) return res.status(400).send("Search value is Empty");
      try {
        const product = await Product.distinct(search, {
          createdAt: "2025-10-14T06:01:26.481Z",
        });
        return res.status(200).send(product);
      } catch (err) {
        return res.status(400).send(err);
      }
    },
  });

  // Get All Products (GET)
  fastify.get("/products", {
    handler: async (req, res) => {
      try {
        const products = await Product.find();
        res.status(200).send({
          success: true,
          message: "Products fetched successfully",
          products,
        });
      } catch (err) {
        fastify.log.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to fetch products",
          error: err.message,
        });
      }
    },
  });

  // Get Single Product by ID (GET)
  fastify.get("/products/:id", {
    handler: async (req, res) => {
      const { id } = req.params;
      try {
        const product = await Product.findById(id);

        if (!product) {
          return res.status(404).send({
            success: false,
            message: "Product not found",
          });
        }

        res.status(200).send({
          success: true,
          message: "Product fetched successfully",
          product,
        });
      } catch (err) {
        fastify.log.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to fetch product",
          error: err.message,
        });
      }
    },
  });

  // Update Product by ID (PUT)
  fastify.put("/products/:id", {
    schema: {
      body: {
        type: "object",
        required: [
          "name",
          "description",
          "price",
          "category",
          "stock",
          "images",
        ],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          category: { type: "string" },
          stock: { type: "number" },
          images: { type: "array", items: { type: "string" } },
          brand: { type: "string" },
          size: { type: "string" },
          color: { type: "string" },
        },
      },
    },
    handler: async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;

      try {
        const product = await Product.findByIdAndUpdate(id, updatedData, {
          new: true,
        });

        if (!product) {
          return res.status(404).send({
            success: false,
            message: "Product not found",
          });
        }

        res.status(200).send({
          success: true,
          message: "Product updated successfully",
          product,
        });
      } catch (err) {
        fastify.log.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to update product",
          error: err.message,
        });
      }
    },
  });

  // Delete Product by ID (DELETE)
  fastify.delete("/products/:id", {
    handler: async (req, res) => {
      const { id } = req.params;
      try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
          return res.status(404).send({
            success: false,
            message: "Product not found",
          });
        }

        res.status(200).send({
          success: true,
          message: "Product deleted successfully",
        });
      } catch (err) {
        fastify.log.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to delete product",
          error: err.message,
        });
      }
    },
  });
};
