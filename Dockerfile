FROM frolvlad/alpine-glibc

WORKDIR /okapi/
COPY package*.json /okapi/

RUN apk add --no-cache nodejs-current npm && \
    apk add --no-cache python make g++ cairo-dev pango-dev libjpeg-turbo-dev giflib-dev && \
    npm install && \
    apk del g++ python make npm

COPY . /okapi

CMD node .
