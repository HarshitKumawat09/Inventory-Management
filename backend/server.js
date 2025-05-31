const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware Setup
app.use(cors());           // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming request bodies as JSON

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",    // MySQL server host (localhost if running locally)
    user: "root",         // MySQL username (use your username if not 'root')
    password: "honeyk@09", // Your MySQL password (change accordingly)
    database: "Inventory"   // Name of the database you're using
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL database");
});

// Routes

// 1. Get all products from the Product table
app.get("/products", (req, res) => {
    db.query("SELECT * FROM Product", (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).send("Error fetching products");
        }
        res.json(results); // Send the fetched products as JSON
    });
});

// 2. Get a specific product by ID
app.get("/products/:id", (req, res) => {
    const productId = req.params.id;
    db.query("SELECT * FROM Product WHERE item_id = ?", [productId], (err, result) => {
        if (err) {
            console.error("Error fetching product by ID:", err);
            return res.status(500).send("Error fetching product");
        }
        if (result.length === 0) {
            return res.status(404).send("Product not found");
        }
        res.json(result[0]); // Return the product as JSON
    });
});

// 3. Add a new product to the Product table
app.post("/products", (req, res) => {
    const { item_name, quantity, unit_price, location, manufacturer } = req.body;
    const stock_status = quantity > 0 ? "In Stock" : "Out of Stock"; // Determine stock status

    const query = `
        INSERT INTO Product (item_name, quantity, unit_price, location, manufacturer, stock_status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [item_name, quantity, unit_price, location, manufacturer, stock_status], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).send("Error adding product");
        }
        res.status(201).send("Product added successfully"); // Product added successfully
    });
});

// 4. Update an existing product's details
app.put("/products/:id", (req, res) => {
    const productId = req.params.id;
    const { item_name, quantity, unit_price, location, manufacturer } = req.body;
    const stock_status = quantity > 0 ? "In Stock" : "Out of Stock"; // Update stock status

    const query = `
        UPDATE Product 
        SET item_name = ?, quantity = ?, unit_price = ?, location = ?, manufacturer = ?, stock_status = ? 
        WHERE item_id = ?
    `;

    db.query(query, [item_name, quantity, unit_price, location, manufacturer, stock_status, productId], (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).send("Error updating product");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Product not found");
        }
        res.send("Product updated successfully");
    });
});

// 5. Delete a product from the Product table
app.delete("/products/:id", (req, res) => {
    const productId = req.params.id;

    db.query("DELETE FROM Product WHERE item_id = ?", [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).send("Error deleting product");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Product not found");
        }
        res.send("Product deleted successfully");
    });
});

// 6. Get all vendors (as an example route)
app.get("/vendors", (req, res) => {
    db.query("SELECT * FROM Vendor", (err, results) => {
        if (err) {
            console.error("Error fetching vendors:", err);
            return res.status(500).send("Error fetching vendors");
        }
        res.json(results);
    });
});

// Existing routes for Products and Vendors (make sure they are here before adding the new ones)

// 7. Get all purchase orders
app.get("/purchase-orders", (req, res) => {
    db.query("SELECT * FROM PurchaseOrder", (err, results) => {
        if (err) {
            console.error("Error fetching purchase orders:", err);
            return res.status(500).send("Error fetching purchase orders");
        }
        res.json(results);
    });
});

// 8. Get all shipments
app.get("/shipments", (req, res) => {
    db.query("SELECT * FROM Shipment", (err, results) => {
        if (err) {
            console.error("Error fetching shipments:", err);
            return res.status(500).send("Error fetching shipments");
        }
        res.json(results);
    });
});


// Server listening on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
