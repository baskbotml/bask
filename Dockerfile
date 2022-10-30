FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install -g typescript

RUN npm install

COPY . .

RUN tsc --build

COPY ./.env ./dist/.env

CMD cd dist;node index.js