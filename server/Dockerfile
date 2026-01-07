# Use official Node.js LTS
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY server/package*.json ./server/
WORKDIR /usr/src/app/server
RUN npm ci --production

# Copy server source
COPY server/ ./server/
WORKDIR /usr/src/app/server

# Ensure uploads dir exists at build time (Cloud Run ephemeral FS — keep in mind)
RUN mkdir -p uploads/hero

# Expose port (Cloud Run sets PORT env variable at runtime)
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]