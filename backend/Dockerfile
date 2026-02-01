# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Hugging Face uses 7860 by default)
EXPOSE 7860

# Set environment variable for port
ENV PORT=7860

# Start the application
CMD ["node", "server.js"]
