FROM alpine:3.10
ENV LD_LIBRARY_PATH="/usr/glibc-compat/lib:/usr/glibc-compat/lib64:${LD_LIBRARY_PATH}"
WORKDIR /okapi/
COPY package*.json /okapi/
RUN apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-2.30-r0.apk && \
    apk add glibc-2.30-r0.apk &&\
    apk add --no-cache nodejs-current npm && \
    apk add --no-cache --virtual .gyp python make g++ cairo-dev pango-dev libjpeg-turbo-dev giflib-dev && \
    npm install && \
    apk del .gyp && \
    apk add --no-cache libuuid libmount musl-dev
COPY . /okapi
CMD node .
COPY . /okapi/
