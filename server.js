const express = require("express");
const SerialPort = require("serialport").SerialPort;
const ReadlineParser = require("@serialport/parser-readline").ReadlineParser;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sensor_data.db');

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

const portPath = "COM3";
const BAUD_RATE = 115200;

let latestSensorData = {};

const port = new SerialPort({
  path: portPath,
  baudRate: BAUD_RATE,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

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

app.get("/latest", (req, res) => {
  res.json(latestSensorData);
});

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
      res.json(rows.reverse()); // return oldest to newest
    }
  );
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING: http://localhost:${PORT}`);
});
