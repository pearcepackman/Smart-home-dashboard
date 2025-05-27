//Requiring a few things here
const express = require("express");
const SerialPort = require("serialport").SerialPort; //USB connection to ESP32
const ReadlineParser = require("@serialport/parser-readline").ReadlineParser; //Helps read raw data from Serial port
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sensor_data.db');
//Database stuff, initializing DB to store data from serial port
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

//Setting port path for Serial ESP32 connection
const portPath = "COM3"; //This could change depending on port
const BAUD_RATE = 115200;
let latestSensorData = {};
const port = new SerialPort({
  path: portPath,
  baudRate: BAUD_RATE,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

//Getting data and inserting into DB
const insertReading = (data) => {
  const { temperature, humidity, air_quality, motion, light } = data;
  db.run(
    `INSERT INTO readings (temperature, humidity, air_quality, motion, light) VALUES (?, ?, ?, ?, ?)`,
    [temperature, humidity, air_quality, motion, light],
    (err) => {
      if (err) console.error("Database Error:", err.message);
    }
  );
};

//On data coming through, attempt to parse data and insert it into DB
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

//Latest is what is being parsed at that moment
app.get("/latest", (req, res) => {
  res.json(latestSensorData);
});

//History either gets 100 entries or you can request a specific amount in the fetch
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
//Start server
app.listen(PORT, () => {
  console.log(`SERVER RUNNING: http://localhost:${PORT}`);
});
