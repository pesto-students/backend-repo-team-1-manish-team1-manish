const express = require("express");
const router = express.Router();
const CarData = require("../Models/CarDataModel");

// Route to get all car data
router.get("/", async (req, res) => {
  try {
    const carData = await CarData.get();
    return res.json(carData);
  } catch (error) {
    console.error("Error getting car data:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while getting car data" });
  }
});

// Route to get car data by ID
router.get("/ids/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const carData = await CarData.getById(id);

    if (carData) {
      return res.json(carData);
    } else {
      return res.status(404).json({ message: "Car data not found" });
    }
  } catch (error) {
    console.error("Error getting car data by ID:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while getting car data" });
  }
});

// Route to fetch distinct make_id
router.get("/make_id", async (req, res) => {
  try {
    const makeIds = await CarData.getDistinctMakeIds();
    // console.log(makeIds);
    return res.json(makeIds);
  } catch (error) {
    console.error("Error fetching distinct make_id:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching distinct make_id" });
  }
});

// Route to fetch year and name on the basis of make_id
router.get("/make_id/:makeId/year-name", async (req, res) => {
  const { makeId } = req.params;

  try {
    const carData = await CarData.getYearAndNameByMakeId(makeId);
    return res.json(carData);
  } catch (error) {
    console.error(
      "Error fetching year and name on the basis of make_id:",
      error
    );
    return res
      .status(500)
      .json({ message: "Error occurred while fetching year and name" });
  }
});

// Route to fetch trim on the basis of make_id, year, and name
router.get("/make_id/:makeId/year/:year/name/:name/trim", async (req, res) => {
  const { makeId, year, name } = req.params;

  try {
    const trims = await CarData.getTrimByMakeIdYearAndName(makeId, year, name);
    return res.json(trims);
  } catch (error) {
    console.error(
      "Error fetching trim on the basis of make_id, year, and name:",
      error
    );
    return res
      .status(500)
      .json({ message: "Error occurred while fetching trim" });
  }
});

module.exports = router;
