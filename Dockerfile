FROM node:20-alpine

# Install build tools required for sqlite3
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Copy package.json and install only backend deps
COPY package*.json ./
RUN npm install

# Copy server and database
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
