FROM node:18

COPY src ./src
COPY package*.json ./

RUN npm ci

ENTRYPOINT ["node", "/src/main.js"]