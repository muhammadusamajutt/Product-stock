import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use(express.json()); // allows us to accept JSON data in the req.body


app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        console.log("Eroor in Fetch products:", error.massage)
        res.status(500).json({ success: false, massage: "Server Error" });
    }
})

app.post("/api/products", async (req, res) => {
    const product = req.body // user will send this data
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, massage: "please provide all fields" });
    }

    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error is create product", error.massage);
        res.status(500).json({ success: false, massage: "Server Error" });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    // console.log("id: ", id);
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, massage: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleting product", error.massage);
        res.status(404).json({ success: false, massage: "Product not found" });
    }
});

app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, massage: "inviled product id" })
    }
    // console.log("id", id);
    try {
        const updateProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, massage: "Product updated successfully", data: updateProduct });
    } catch (error) {
        res.status(500).json({ success: false, massage: "Server Error" });
    }
})

// console.log(process.env.MONGO_URI);
app.listen(5000, () => {
    connectDB();
    console.log("Server is running at http://localhost:5000 ");
});
