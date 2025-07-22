# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy pre-built static files
COPY dist/ ./dist

# Set working directory to dist folder
WORKDIR /app/dist

# Serve the web app
EXPOSE 80
CMD ["serve", "-s", ".", "-l", "80"]
