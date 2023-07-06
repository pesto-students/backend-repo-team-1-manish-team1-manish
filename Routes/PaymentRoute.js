const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require('dotenv').config();

const { KEY_ID, KEY_SECRET } = process.env;

let rzp = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

//Sample items
const storeItems = new Map([
  [1, { price: 10000, name: "Item 1" }],
  [2, { price: 20000, name: "Item 2" }],
])

// API signature
// {razorpayInstance}.{resourceName}.{methodName}(resourceId [, params])

//Route to direct customer to checkout page - Razorpay
router.post("/checkout", async (req, res) => {
    const session = await rzp.payments.capture(order_id, 1000).then((data) => {
        // console.log(data); SUCCESS
      }).catch((error) => {
          res.status(500).json({ error : error.message })
        })
    })
