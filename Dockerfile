#Created Dockerfile for Reverse Proxy taken from Rebuild monolithic to microservices exercise
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf