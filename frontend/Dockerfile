FROM node:24-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]