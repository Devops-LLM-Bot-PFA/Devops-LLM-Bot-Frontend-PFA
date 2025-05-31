# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install and cache app dependencies
COPY package*.json /app/
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the application
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the port the application will be running on
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]