FROM node:18-slim

WORKDIR /app

# Package files copy karke dependencies install karein
COPY package*.json ./
RUN npm install

# Saari files copy karein
COPY . .

# CRA (Create React App) ke liye port 3000 zaroori hai
EXPOSE 3000

# Docker environment mein hot-reloading aur startup ke liye
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

CMD ["npm", "start"]