
FROM node:18

# Set the working directory in the container
WORKDIR ./src

# Copy the application files into the working directory
COPY . .

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["node", "index.js"]

EXPOSE 3000