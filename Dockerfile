FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

RUN apk add --no-cache --virtual .gyp python make g++ \
    && apk del .gyp

RUN npm install -g typescript

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN tsc --build

CMD node dist/index.js