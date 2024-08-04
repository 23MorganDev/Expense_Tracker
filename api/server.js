const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql2 = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// db configuration
const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
};

// db creation and connection
(async () => {
    try {
        const connection = await mysql2.createConnection(db_config);
        console.log("Connected to the MySQL server successfully");

        // Database creation
        const dbName = process.env.DB_NAME;
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database ${dbName} created or already exists`);

        // Selecting the newly created db
        await connection.query(`USE \`${dbName}\``);
        console.log(`Using database ${dbName}`);

        // Creating the users and expenses tables
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL
            );
        `;

        await connection.query(createUsersTable);
        console.log("Users table created or already exists");

        const createExpensesTable = `
            CREATE TABLE IF NOT EXISTS Expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                date DATE NOT NULL,
                category VARCHAR(100) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(id)
            );
        `;

        await connection.query(createExpensesTable);
        console.log("Expenses table created or already exists");

        // Function to add a user
        const addUser = async (username, password) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = "INSERT INTO Users (username, password) VALUES (?, ?)";
            const values = [username, hashedPassword];
            try {
                const [rows] = await connection.execute(query, values);
                console.log("User added:", rows.insertId);
                return rows.insertId;
            } catch (error) {
                console.error("Error adding user:", error);
                throw error;
            }
        };

        // Function to add an expense
        const addExpense = async (userId, amount, date, category) => {
            const query =
                "INSERT INTO Expenses (user_id, amount, date, category) VALUES (?, ?, ?, ?)";
            const values = [userId, amount, date, category];
            try {
                const [rows] = await connection.execute(query, values);
                console.log("Expense added:", rows.insertId);
            } catch (error) {
                console.error("Error adding expense:", error);
            }
        };

        // Endpoint to register a new user
        app.post("/register", async (req, res) => {
            const { username, password } = req.body;
            try {
                const userId = await addUser(username, password);
                res.status(201).json({ userId });
            } catch (error) {
                res.status(500).json({ error: "Error registering user" });
            }
        });

        // Endpoint to add a new expense
        app.post("/expenses", async (req, res) => {
            const { userId, amount, date, category } = req.body;
            try {
                await addExpense(userId, amount, date, category);
                res.status(201).json({ message: "Expense added successfully" });
            } catch (error) {
                res.status(500).json({ error: "Error adding expense" });
            }
        });

        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the MySQL server or creating the database:", error);
    }
})();
