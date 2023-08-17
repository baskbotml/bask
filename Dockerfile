FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

RUN apk add --no-cache --virtual .gyp python3 make g++

COPY package.json ./

RUN yarn

COPY . .

RUN yarn tsc

RUN apk del .gyp

CMD node dist/index.js