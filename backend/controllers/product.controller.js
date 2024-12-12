import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        console.log("Eroor in Fetch products:", error.massage)
        res.status(500).json({ success: false, massage: "Server Error" });
    }
};

export const createProduct = async (req, res) => {
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
};
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    // console.log("id: ", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, massage: "inviled product id" })
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, massage: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleting product", error.massage);
        res.status(500).json({ success: false, massage: "Server Error" });
    }
};
export const updateProduct = async (req, res) => {
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
};