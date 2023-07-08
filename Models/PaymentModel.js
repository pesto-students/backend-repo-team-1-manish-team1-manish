const sql = require("../DB/PostgresSql");

// USED FOR EXPORTING THE FUNCTIONS BELOW
const Payment = {};

// CREATE Payment
Payment.create = async (id, order_id, payment_id, signature) => {
    try {
        return await sql`
      INSERT INTO payments (id, order_id, payment_id, signature)
      VALUES (${id}, ${order_id}, ${payment_id}, ${signature})`;  
    } catch (error) {
        console.error('Error writing payment:', error);
        throw error;
    }
};
