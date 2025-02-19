# Use the official Node.js LTS version
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the source code
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Expose the port (if needed)
EXPOSE 8080

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["node", "dist/index.js"]
