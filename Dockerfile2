FROM node:10.16-buster

WORKDIR /okapi/
COPY package*.json /okapi/

RUN npm install

COPY . /okapi/
CMD node .
