const sql = require("../DB/PostgresSql");
const bcrypt = require('bcryptjs');

// USED FOR EXPORTING THE FUNCTIONS BELOW
const User = {};

// CREATE USER
User.create = async (name, firstName, lastName, email, phoneNo, password, authProvider, bookmarkIds) => {
    console.log(name, firstName, lastName, email, phoneNo, password, authProvider, bookmarkIds);
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
        await sql`
      INSERT INTO users (id, name, first_name, last_name, email, phone_no, password, role_id, auth_provider, bookmark_ids)
      VALUES (gen_random_uuid(), ${name}, ${firstName}, ${lastName}, ${email}, ${phoneNo}, ${hashedPassword}, gen_random_uuid(), ${authProvider}, ${bookmarkIds})
    `;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// GET ALL USERS
User.get = async () => {
    try {
        return await sql`
      SELECT * FROM users
    `;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

// GET USER BY ID
User.getById = async (id) => {
    try {
        return await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

// GET USER BY EMAIL
User.getByEmail = async (email) => {
    try {
        return await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    } catch (error) {
        console.error('Error getting user by Email:', error);
        throw error;
    }
};

// UPDATE A USER
User.update = async (id, name, firstName, lastName, email, phoneNo, password, roleId, authProvider, bookmarkIds) => {
    try {
        return await sql`
      UPDATE users
      SET name = ${name},
          first_name = ${firstName},
          last_name = ${lastName},
          email = ${email},
          phone_no = ${phoneNo},
          password = ${password},
          role_id = ${roleId},
          auth_provider = ${authProvider},
          bookmark_ids = ${bookmarkIds}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// DELETE A USER
User.delete = async (id) => {
    try {
        return await sql`
      DELETE FROM users WHERE id = ${id}
    `;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = User;