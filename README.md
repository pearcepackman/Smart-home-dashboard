<p align="left">
  <img src="https://img.shields.io/badge/ESP32-000000?style=flat&logo=espressif&logoColor=white" />
  <img src="https://img.shields.io/badge/C++-00599C?style=flat&logo=c%2B%2B&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/REST_API-6DB33F?style=flat&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
</p>


# Smart Home Dashboard

Hello!, I'm Pearce, and this is a full-stack Internet of Things (IoT) project that collects, stores, and visualizes real-time sensor data from an ESP32 device. 

This project combines ESP32 hardware, embedded C++ firmware, a JavaScript backend server, and a mobile React Native app.

## Tech Stack

- **ESP32 + Sensors** – C++ firmware collects temperature, humidity, gas, motion, and light data
- **C++ (Arduino IDE)** – Sensor polling, JSON formatting, serial transmission
- **Node.js + Express.js** – Backend API to receive and serve data
- **SQLite** – Lightweight, persistent storage
- **React Native** – Mobile app frontend using `react-native-chart-kit` for real-time graphs
- **ExpoGo** - For mobile app development and testing
- **Docker + Docker Compose** – Containerized deployment of backend + frontend

## Features
- Real-time sensor data: Temperature, humidity, air quality, movement, and light
- Backend server built to handle, store, and send data
- Interactive mobile app displaying live and historical data
- Smoother data visualization using data smoothing and downsampling
- Modular architecture designed to easily handle new sensors
- Containerized deployment using Docker and Docker Compose

## Demos and Media
<table align="center" style="width: 100%; table-layout: fixed;">
  <tr>
    <td align="center" style="width: 50%;">
      <img src="screenshots/IMG_3612.jpeg" width="250" alt="Breadboard and hardware" /><br>
        <em>Breadboard with sensors and ESP32 module</em>
    </td>
    <td align="center" style="width: 50%;">
      <img src="screenshots/vid.gif" width="250" alt="App demo" /><br>
        <em>React Native app showing live sensor data</em>
    </td>
  </tr>
</table>

## Notes
- This project is a **technical demo**, not a plug-and-play smart home system
- The ESP32 device must be on the same network as the backend
- The mobile app must also be connected locally to access the live API
- If the app doesn't detect the ESP32 device, it will enter 'fake data' mode for visualization sake

## Getting Started
You can now run this entire project (backend + frontend) quickly and easily using Docker!

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/) 

### Quick Setup
1. **Clone this repository**
    ```bash
   git clone https://github.com/pearcepackman/smart-home-dashboard.git
   cd smart-home-dashboard
2. **Run the full stack**
    ```bash 
    docker compose up --build
3. **Visit the app**
    - Frontend: http://localhost
    - Backend API: http://localhost:3000/latest, http://localhost:3000/history

## Update History
- 7/25/2025 – Docker deployment!! License, final polish
- 7/22/2025 - Prepped for Docker deployment
- 5/27/2025 - History tab made, README edits, added comments\
- 5/24/2025 - Initializing project, React Native boilerplate


## Contact

<p align="center">
  If you like this project and want to chat with me, here's some of my links! :)<br>
  <a href="https://pearcepackman.com/" target="_blank">🌐 Portfolio Website</a> |
  <a href="https://www.linkedin.com/in/pearce-packman/" target="_blank">🔗 LinkedIn</a> |
  <a href="mailto:pearcepackman@gmail.com">📧 Email</a>
</p>
