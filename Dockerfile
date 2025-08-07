FROM node:18-alpine

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend/ .

EXPOSE 5000

CMD ["node", "server.js"]