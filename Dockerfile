FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy your React build files from 'dist' directory
COPY client/dist/ /usr/share/nginx/html/

# Copy SSL certificates
COPY cert.pem /etc/nginx/cert.pem
COPY key.pem /etc/nginx/key.pem

# Add these lines for debugging
RUN nginx -t
RUN ls -la /etc/nginx/conf.d/
RUN cat /etc/nginx/conf.d/nginx.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
