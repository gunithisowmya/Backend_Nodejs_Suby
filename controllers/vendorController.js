const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.whatIsYourName || "default_secret";


const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        res.status(201).json({ message: "vendor registered successfully" });
        console.log('registered')
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })

    }
}
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" })
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" })
        const vendorId = vendor._id;
        res.status(200).json({ email, success: "Login successful", token, vendorId })
        console.log(email, "this is token", token);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });

    }

}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getVendorById = async (req, res) => {

    try {
        const vendorId = req.params.id;
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: "vendor not found" });
        }
        if (!vendor.firm || vendor.firm.length === 0) {
            return res.status(200).json({ vendor, vendorFirmId: null }); // ✅ Return null if no firm
        }
        const vendorFirmId = vendor.firm[0]?._id || null;
        res.status(200).json({ vendor, vendorFirmId })
        console.log(vendor, vendorFirmId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });

    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById }