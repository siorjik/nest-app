FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app/

RUN yarn install

COPY . .

EXPOSE 8080

RUN yarn build

CMD [ "yarn", "start:prod" ]
# CMD [ "yarn", "start:dev" ]
