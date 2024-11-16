# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:lts-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
# RUN npm run build

# Run the Next.js app
CMD ["npm", "run", "dev"]

# Document that the service listens on port 3000.
EXPOSE 3000
