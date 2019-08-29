FROM node:12.9.1-alpine
WORKDIR /okapi/
COPY package*.json /okapi/
RUN apk --no-cache add ca-certificates wget && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-2.30-r0.apk && apk add glibc-2.30-r0.apk && rm glibc-2.30-r0.apk && apk add --no-cache --virtual .gyp python make g++ cairo-dev pango-dev libjpeg-turbo-dev giflib-dev && npm install && apk del .gyp && apk add --no-cache libuuid
COPY . /okapi
CMD node .
COPY . /okapi/
