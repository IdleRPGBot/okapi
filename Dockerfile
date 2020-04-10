FROM frolvlad/alpine-glibc

#ENV C_INCLUDE_PATH /usr/include/glib-2.0:/usr/lib/glib-2.0/include

WORKDIR /okapi/
COPY package*.json /okapi/

RUN apk add --no-cache nodejs-current npm

RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/community --no-cache python make g++ cairo-dev pango-dev libjpeg-turbo-dev giflib-dev vips-dev librsvg-dev

RUN npm install && \
    apk del g++ python make npm

COPY . /okapi

CMD node .
