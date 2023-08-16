FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg python3 make g++

RUN npm install -g typescript yarn

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN tsc --build

CMD node dist/index.js