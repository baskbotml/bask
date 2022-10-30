FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

RUN npm install -g typescript

COPY package.json ./

RUN npm install

COPY . .

RUN tsc --build

COPY ./.env ./dist/.env

CMD cd dist;node index.js