# Use Node.js 20 slim image as the base
FROM node:20-bookworm-slim

# Install Python 3 and FFmpeg (required for yt-dlp)
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json files first to leverage Docker cache
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies for both frontend and backend
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy all project files
COPY . .

# Build the React frontend
RUN cd frontend && npm run build

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=4000

# Expose the backend port
EXPOSE 4000

# Start the server
CMD ["node", "backend/src/server.js"]
