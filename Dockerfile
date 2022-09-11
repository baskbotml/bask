FROM srizan10/nodejs-java13-lavalink

ADD . /bask-bot

RUN cd /bask-bot && npm i -g typescript ts-node

RUN cd /bask-bot && npm i

CMD cd /bask-bot;npm i;ts-node index.ts