const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const shortid = require("shortid");
require("dotenv").config();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

const { KEY_ID, KEY_SECRET } = process.env;

let rzp = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

// Verification
router.post("/verification", (req, res) => {
  // do a validation
  const secret = "WEBHOOK_SECRET";
  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Request verified");
    console.log(JSON.stringify(req.body, null, 4));
    // Write to db (optional)
  } else {
    // ignore or pass it
  }
  res.json({ status: "ok" });
});

// Checkout
router.post("/checkout", async (req, res) => {
  const payment_capture = 1;
  const amount = 100;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await rzp.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to create payment" });
  }
});
