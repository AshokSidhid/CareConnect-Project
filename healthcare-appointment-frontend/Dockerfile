# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy our custom config
COPY nginx.conf /etc/nginx/conf.d
# Copy the built files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]