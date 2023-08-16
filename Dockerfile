FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

RUN apk add --no-cache --virtual .gyp python3 make g++

COPY package.json ./

RUN yarn

RUN apk del .gyp

COPY . .

RUN yarn build

RUN yarn prune --production

CMD node dist/index.js