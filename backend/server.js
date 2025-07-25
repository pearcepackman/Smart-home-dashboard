//Requiring stuff for reading the data from ports
const express = require("express");
const SerialPort = require("serialport").SerialPort;
const ReadlineParser = require("@serialport/parser-readline").ReadlineParser;
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");


const db = new sqlite3.Database("./sensor_data.db");

// Create readings table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      temperature REAL,
      humidity REAL,
      air_quality INTEGER,
      motion INTEGER,
      light TEXT
    )
  `);
});

const app = express();
const PORT = 3000;
app.use(cors());

const portPath = "COM3";
const BAUD_RATE = 115200;
let latestSensorData = {};


let port;
let parser;
let isOffline = false;
//Try to launch the server connected to the COM3 port (IoT device)
//If it can't do that, generate data for viewing
try {
  port = new SerialPort({ path: portPath, baudRate: BAUD_RATE });
  parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  parser.on("data", (line) => {
    try {
      const parsed = JSON.parse(line.trim());
      latestSensorData = parsed;
      insertReading(parsed);
      console.log("Data Received:", parsed);
    } catch (err) {
      console.error("BAD JSON:", line);
    }
  });
  //Make fake data if !port
  port.on("error", (err) => {
    console.error("Serial port error:", err.message);
    startFakeData(); // fallback if serial port errors later
  });

} catch (err) {
  console.error("Failed to open serial port:", err.message);
  startFakeData(); // fallback if serial port throws immediately
}
//This is basically for demonstration, testing purposes, just to show I did have something
function startFakeData() {
  if (isOffline) return;
  isOffline = true;

  console.log("Starting fake data loop...");
  setInterval(() => {
    const fakeReading = {
      temperature: +(Math.random() * 5 + 70).toFixed(1),
      humidity: +(Math.random() * 10 + 40).toFixed(1),
      air_quality: Math.floor(Math.random() * 100),
      motion: Math.random() > 0.8 ? 1 : 0,
      light: Math.random() > 0.5 ? "light" : "dark",
    };
    //Give it fake data to display
    latestSensorData = fakeReading;
    insertReading(fakeReading);
    console.log("Generated fake reading:", fakeReading);
  }, 1000);
}

// Insert sensor reading into DB
const insertReading = (data) => {
  const { temperature, humidity, air_quality, motion, light } = data;
  db.run(
    `INSERT INTO readings (temperature, humidity, air_quality, motion, light)
     VALUES (?, ?, ?, ?, ?)`,
    [temperature, humidity, air_quality, motion, light],
    (err) => {
      if (err) console.error("Database Error:", err.message);
    }
  );
};

// Serve latest reading
app.get("/latest", (req, res) => {
  res.json(latestSensorData);
});

// Serve historical data
app.get("/history", (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  db.all(
    `SELECT * FROM readings ORDER BY timestamp DESC LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve history" });
      }
      res.json(rows.reverse());
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`SERVER RUNNING: http://localhost:${PORT}`);
});
