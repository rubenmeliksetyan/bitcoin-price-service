# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the TypeScript source files
COPY . .

# Build the TypeScript code
RUN npx tsc

# Expose the port that the app will run on
EXPOSE 3000

# Run the app
CMD ["node", "dist/app.js"]