FROM node:12.9.1-alpine

WORKDIR /okapi

RUN npm install
CMD node .
