FROM node:18

COPY dist ./dist
COPY package*.json ./

RUN npm ci

ENTRYPOINT ["node", "/dist/main.js"]