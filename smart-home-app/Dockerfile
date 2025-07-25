FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Export static web app
RUN npx expo export --platform web --output-dir web-build

# Copy Netlify-style redirects (optional but good for SPA routing)
COPY _redirects web-build/_redirects

# Install static server
RUN npm install -g serve

EXPOSE 80

# Serve the static web app
CMD ["serve", "-s", "web-build", "-l", "80"]
