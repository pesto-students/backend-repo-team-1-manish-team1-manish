const sql = require("../DB/PostgresSql");
const bcrypt = require("bcryptjs");

// USED FOR EXPORTING THE FUNCTIONS BELOW
const User = {};

// CREATE USER
User.create = async (
  name,
  firstName,
  lastName,
  email,
  phoneNo,
  password,
  authProvider
) => {
  try {
    const hashedPassword = authProvider === "self" ? await bcrypt.hash(password, 10) : "";
    await sql`
      INSERT INTO users (id, name, first_name, last_name, email, phone_no, password, role_id, auth_provider, bookmark_ids, otp)
      VALUES (gen_random_uuid(), ${name}, ${firstName}, ${lastName}, ${email}, ${phoneNo}, ${hashedPassword}, gen_random_uuid(), ${authProvider}, ${sql.array()}, ${null})
    `;
    const newUser = (
      await sql`
    SELECT id, name, first_name, last_name, email, phone_no, bookmark_ids FROM users WHERE email = ${email}
  `
    )[0];
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// GET ALL USERS
User.get = async () => {
  try {
    return await sql`
      SELECT id, name, first_name, last_name, email, phone_no, bookmark_ids FROM users
    `;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// GET USER BY ID
User.getById = async (id) => {
  try {
    return (
      await sql`
      SELECT * FROM users WHERE id = ${id}
    `
    )[0];
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

// GET USER BY EMAIL
User.getByEmail = async (email) => {
  try {
    return (
      await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    )[0];
  } catch (error) {
    console.error("Error getting user by Email:", error);
    throw error;
  }
};

// GET USER ORDERS
User.getOrders = async (id) => {
  try {
    return await sql`
        SELECT 
        id AS CarId, 
        brand AS Brand, 
        model AS Model, 
        year AS Year,
        CASE
            WHEN buyerid = ${id} THEN 'Bought'
            WHEN sellerid = ${id} AND buyerid IS NULL THEN 'Listed'
            WHEN sellerid = ${id} AND buyerid IS NOT NULL THEN 'Sold'
            ELSE 'Not involved'
        END AS order_status
        FROM car_details 
        WHERE buyerid = ${id} 
        OR sellerid = ${id}
    `;
  } catch (error) {
    console.error("Error getting user by Email:", error);
    throw error;
  }
};

// UPDATE A USER
User.update = async (
  id,
  name,
  firstName,
  lastName,
  phoneNo
) => {
  try {
    let query = sql`UPDATE users SET name = ${name}
        ${firstName ? sql`, first_name = ${firstName}` : sql``}
        ${lastName ? sql`, last_name = ${lastName}` : sql``}
        ${phoneNo ? sql`, phone_no = ${phoneNo}` : sql``}
        WHERE id = ${id}
        `;

    await sql`${query}`;
    return (
      await sql`
    SELECT id, name, first_name, last_name, email, phone_no, bookmark_ids FROM users WHERE id = ${id}
  `
    )[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// UPDATE A USER
User.resetPassword = async (email, password, otp) => {
  try {
    const existingUser = (
      await sql`
        SELECT * FROM users WHERE email = ${email}
      `
    )[0];

    if (otp && existingUser) {
      if (otp == existingUser.otp) {
        const hashedPassword = await bcrypt.hash(password, 10);
        let query = sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${email}`;
        await query;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating password:", error);
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
    console.error("Error deleting user:", error);
    throw error;
  }
};

// GET BOOKMARKS
User.getBookmarks = async (id) => {
  try {
    return (
      await sql`
      SELECT 
      car_details.brand,
      car_details.model,
      car_details.year,
      CASE
          WHEN car_details.buyerid = ${id} THEN 'Bought'
          WHEN car_details.sellerid = ${id} AND car_details.buyerid IS NULL THEN 'Listed'
          WHEN car_details.buyerid IS NULL THEN 'Available'
          WHEN car_details.sellerid IS NOT NULL THEN 'Sold Out'
          ELSE 'Not involved'
      END AS order_status
      FROM 
          users 
      INNER JOIN 
          car_details
          ON car_details.id = ANY(users.bookmark_ids)
      WHERE users.id = ${id};
      `
    );
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw error;
  }
};

// CREATE/ADD BOOKMARKS
User.addBookmarks = async (id, bookmarkId) => {
  try {
    const query = sql`
            UPDATE users
            SET bookmark_ids = 
                CASE
                    WHEN bookmark_ids IS NULL 
                        THEN ${sql.array(bookmarkId)}
                    ELSE array_cat(bookmark_ids, ${sql.array(bookmarkId)})
                END
            WHERE id = ${id};
          `;
    return await query;
  } catch (error) {
    console.error("Error adding bookmarks:", error);
    throw error;
  }
};
// REMOVE BOOKMARK
User.removeBookmarks = async (id, bookmarkIds) => {
  try {
    return await sql`
        UPDATE users
        SET bookmark_ids = CASE
            WHEN array_length(bookmark_ids, 1) = 1
                THEN ${sql.array()}
            ELSE array_remove(bookmark_ids, ${bookmarkIds})
            END
        WHERE id = ${id};
      `;
  } catch (error) {
    console.error("Error removing bookmarks:", error);
    throw error;
  }
};
//CLEAR BOOKMARK
User.clearBookmarks = async (id) => {
  try {
    return await sql`
        UPDATE users
        SET bookmark_ids = NULL
        WHERE id = ${id};
      `;
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
    throw error;
  }
};

module.exports = User;
