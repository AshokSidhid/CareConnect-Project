# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
# Copy the built files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
# Tell Docker that the container listens on port 80
EXPOSE 80
# The command to start the Nginx server
CMD ["nginx", "-g", "daemon off;"]