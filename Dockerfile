# Use the official Node.js image as the base image
FROM node:18

# Set a working directory for your application
WORKDIR /app

# Copy the backend code into the container
COPY Backend/ ./backend

# Copy the frontend code into the container
COPY Frontend/ ./frontend

# Install backend dependencies
RUN cd backend && npm install

# Install frontend dependencies
RUN cd frontend && npm install

# Expose any necessary ports (e.g., for your backend server)
EXPOSE 5173
EXPOSE 3030
EXPOSE 8080

# Define how to start your application
CMD ["sh", "-c", "cd backend && node index && cd .. && cd frontend && npm run dev"]
