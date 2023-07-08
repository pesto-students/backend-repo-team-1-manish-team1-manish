const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const Payment = require('../Models/PaymentModel');
const sql = require("../DB/PostgresSql");
require("dotenv").config();

router.use(bodyParser.json());
router.use(cors());

const { KEY_ID, KEY_SECRET, WEBHOOK_SECRET } = process.env;

let rzp = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

// Verification
router.post("/verification", async (req, res) => {
  // do a validation
  const secret = WEBHOOK_SECRET;
  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Request verified");

    const { id, order_id, payment_id, signature } = req.body;
    
    // Write to db (optional)
    try {
      const user = await Payment.create(id, order_id, payment_id, signature);

      if (user) {
        return res.status(200).send(user[0])
      }
    } catch(error) {
    console.error('Error executing the database query:', err);
    res.status(500).json({ error: 'An error occurred while saving the payment.' });
    }  
    res.json({ message: 'Payment saved successfully.' });
  } else {
    console.log("Request unverified!");
  }
  res.json({ status: "ok" });
});

// Checkout
router.post("/checkout", async (req, res) => {
  const payment_capture = 1;
  const amount = req.body.amount;
  const currency = "INR";
  const name = req.body.name;
  const email = req.body.email;

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
      orderId: response.id,
      currency: response.currency,
      amount: response.amount,
      name: name,
      email: email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to create payment" });
  }
});

module.exports = router;
