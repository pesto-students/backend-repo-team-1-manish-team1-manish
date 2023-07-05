const sql = require("../DB/PostgresSql");
const bcrypt = require('bcryptjs');

// USED FOR EXPORTING THE FUNCTIONS BELOW
const User = {};

// CREATE USER
User.create = async (name, firstName, lastName, email, phoneNo, password, authProvider, bookmarkIds) => {
    try {
        const hashedPassword = !authProvider ? await bcrypt.hash(password, 10) : '';
        await sql`
      INSERT INTO users (id, name, first_name, last_name, email, phone_no, password, role_id, auth_provider, bookmark_ids, otp)
      VALUES (gen_random_uuid(), ${name}, ${firstName}, ${lastName}, ${email}, ${phoneNo}, ${hashedPassword}, gen_random_uuid(), ${authProvider}, ${bookmarkIds}, ${null})
    `;
        const newUser = (await sql`
    SELECT id, name, first_name, last_name, email, phone_no, password, role_id, auth_provider FROM users WHERE email = ${email}
  `)[0];
        return newUser;
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
User.update = async (email, name, firstName, lastName, phoneNo, roleId, authProvider, bookmarkIds) => {
    try {
        let query = sql`UPDATE users SET name = ${name}`;

        if (firstName) query.append(sql`, first_name = ${firstName}`);
        if (lastName) query.append(sql`, last_name = ${lastName}`);
        if (phoneNo) query.append(sql`, phone_no = ${phoneNo}`);
        if (roleId) query.append(sql`, role_id = ${roleId}`);
        if (authProvider) query.append(sql`, auth_provider = ${authProvider}`);
        if (bookmarkIds) query.append(sql`, bookmark_ids = ${bookmarkIds}`);

        query.append(sql` WHERE email = ${email}`);

        return await query;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// UPDATE A USER
User.resetPassword = async (email, password, otp) => {
    try {
        const existingUser = (await sql`
        SELECT * FROM users WHERE email = ${email}
      `)[0];

        if (otp && existingUser) {
            if (otp == existingUser.otp) {
                const hashedPassword = await bcrypt.hash(password, 10);
                let query = sql`UPDATE users SET password = ${hashedPassword}`;
                query.append(sql` WHERE email = ${email}`);
                await query;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};


// DELETE A USER
User.delete = async (email) => {
    try {
        return await sql`
      DELETE FROM users WHERE email = ${email}
    `;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = User;