FROM node:18

COPY src /src
COPY package.json /package.json
COPY package-lock.json /package-lock.json

RUN npm ci

ENTRYPOINT ["node", "src/main.js"]