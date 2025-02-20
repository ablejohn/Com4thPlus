// server/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");
const fs = require('fs');  // required for deleting properties
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API Endpoints
app.post("/api/properties", upload.array("images"), async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const propertyData = JSON.parse(req.body.data);

    // Insert property
    const propertyQuery = `
      INSERT INTO properties (
        title, description, location, contact_phone, 
        bathrooms, type, superhost, size, availability
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`;

    const propertyValues = [
      propertyData.title,
      propertyData.description,
      propertyData.location,
      propertyData.contactPhone,
      propertyData.bathrooms,
      propertyData.type,
      propertyData.superhost,
      propertyData.size,
      propertyData.availability,
    ];

    const propertyResult = await client.query(propertyQuery, propertyValues);
    const propertyId = propertyResult.rows[0].id;

    // GET endpoint to fetch all properties
    app.get("/api/properties", async (req, res) => {
      const client = await pool.connect();

      try {
        // Get properties with related data
        const result = await client.query(`
        SELECT 
          p.*,
          json_agg(DISTINCT jsonb_build_object(
            'price', po.price,
            'bedrooms', po.bedrooms,
            'label', po.label
          )) as pricing_options,
          json_agg(DISTINCT pi.image_path) as images,
          json_agg(DISTINCT fh.highlight) as featured_highlights,
          json_build_object(
            'maxGuests', pd.max_guests,
            'priceRange', pd.price_range,
            'cautionFee', pd.caution_fee,
            'cookingAllowed', pd.cooking_allowed,
            'notes', pd.notes
          ) as party_details
        FROM properties p
        LEFT JOIN pricing_options po ON p.id = po.property_id
        LEFT JOIN property_images pi ON p.id = pi.property_id
        LEFT JOIN featured_highlights fh ON p.id = fh.property_id
        LEFT JOIN party_details pd ON p.id = pd.property_id
        GROUP BY p.id, pd.max_guests, pd.price_range, pd.caution_fee, 
                 pd.cooking_allowed, pd.notes
      `);

        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Error fetching properties" });
      } finally {
        client.release();
      }
    });

    // Insert pricing options
    for (const option of propertyData.pricingOptions) {
      await client.query(
        `INSERT INTO pricing_options (property_id, bedrooms, price, label)
         VALUES ($1, $2, $3, $4)`,
        [propertyId, option.bedrooms, option.price, option.label]
      );
    }

    // Insert featured highlights
    for (const highlight of propertyData.featuredHighlights) {
      await client.query(
        `INSERT INTO featured_highlights (property_id, highlight)
         VALUES ($1, $2)`,
        [propertyId, highlight]
      );
    }

    // Insert party details
    await client.query(
      `INSERT INTO party_details (
        property_id, max_guests, price_range, caution_fee, 
        cooking_allowed, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        propertyId,
        propertyData.partyDetails.maxGuests,
        propertyData.partyDetails.priceRange,
        propertyData.partyDetails.cautionFee,
        propertyData.partyDetails.cookingAllowed,
        propertyData.partyDetails.notes,
      ]
    );

    // Insert images
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    for (const imagePath of imagePaths) {
      await client.query(
        `INSERT INTO property_images (property_id, image_path)
         VALUES ($1, $2)`,
        [propertyId, imagePath]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Property created successfully",
      propertyId: propertyId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating property:", error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});
// DELETE endpoint to delete a property and all associated data
app.delete("/api/properties/:id", async (req, res) => {
  const client = await pool.connect();
  const propertyId = req.params.id;

  try {
    await client.query("BEGIN");

    // First, get the image paths so we can delete the files
    const imageResult = await client.query(
      "SELECT image_path FROM property_images WHERE property_id = $1",
      [propertyId]
    );

    // Delete the actual image files from the uploads folder
    imageResult.rows.forEach(({ image_path }) => {
      const filePath = path.join(
        __dirname,
        image_path.replace("/uploads/", "uploads/")
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    });

    // Delete all related data (the order matters due to foreign key constraints)
    await client.query("DELETE FROM pricing_options WHERE property_id = $1", [
      propertyId,
    ]);
    await client.query(
      "DELETE FROM featured_highlights WHERE property_id = $1",
      [propertyId]
    );
    await client.query("DELETE FROM property_images WHERE property_id = $1", [
      propertyId,
    ]);
    await client.query("DELETE FROM party_details WHERE property_id = $1", [
      propertyId,
    ]);
    await client.query("DELETE FROM properties WHERE id = $1", [propertyId]);

    await client.query("COMMIT");
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Error deleting property" });
  } finally {
    client.release();
  }
});

// DELETE endpoint to delete all properties
app.delete("/api/properties", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get all image paths first
    const imageResult = await client.query(
      "SELECT image_path FROM property_images"
    );

    // Delete all image files from the uploads folder
    imageResult.rows.forEach(({ image_path }) => {
      const filePath = path.join(
        __dirname,
        image_path.replace("/uploads/", "uploads/")
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    });

    // Delete all data from all related tables (order matters due to foreign keys)
    await client.query("DELETE FROM pricing_options");
    await client.query("DELETE FROM featured_highlights");
    await client.query("DELETE FROM property_images");
    await client.query("DELETE FROM party_details");
    await client.query("DELETE FROM properties");

    await client.query("COMMIT");
    res.json({ message: "All properties deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting all properties:", error);
    res.status(500).json({ message: "Error deleting all properties" });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
