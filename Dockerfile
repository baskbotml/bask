FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install -g typescript

RUN npm install

COPY . .

RUN tsc --build

RUN node dist/index.js