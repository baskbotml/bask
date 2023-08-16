FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg python3 make alpine-sdk

RUN npm install -g typescript

COPY package.json ./

RUN npm install

COPY . .

RUN tsc --build

CMD node dist/index.js