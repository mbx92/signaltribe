# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Nuxt app
RUN npm run build


# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy the generic output from builder
COPY --from=builder /app/.output ./.output

# Expose port
EXPOSE 3036

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Start the application
CMD ["node", ".output/server/index.mjs"]
