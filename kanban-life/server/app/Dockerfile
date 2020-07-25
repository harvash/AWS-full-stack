FROM node:14.4.0-alpine3.11
LABEL maintainer="Harvash <harvash2004@yahoo.com>"

RUN mkdir -p /home/node/server/app && chown node:node /home/node/server/app

WORKDIR /home/node/server/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel=error

RUN npm install express socket.io pg

COPY --chown=node:node server.js .
COPY --chown=node:node css ./css
COPY --chown=node:node db ./db
COPY --chown=node:node routes ./routes

CMD [ "node", "server.js" ]
