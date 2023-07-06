const Razorpay = require('razorpay');
require('dotenv').config();
const { KEY_ID, KEY_SECRET } = process.env;

var instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })

//Sample order creation
instance.orders.create({
  amount: 30000,
  currency: "INR",
  receipt: "receipt#1",
  notes: {
    key1: "item 1 - 10000",
    key2: "item 2 - 20000"
  }
})