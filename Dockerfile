# Production-appropriate Nginx Alpine image for serving static frontend
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy application static files to Nginx web root
COPY index.html style.css script.js /usr/share/nginx/html/

# Expose HTTP port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
