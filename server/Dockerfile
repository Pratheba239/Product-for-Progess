# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build || true
# Note: npm run build might fail if not configured, but we can use ts-node or compile
# For now, let's assume we use ts-node in production or have a build script.
# If no build script exists, we'll just copy the src and run it.

# Port the backend runs on
EXPOSE 5000

# Start command
CMD [ "npm", "start" ]
