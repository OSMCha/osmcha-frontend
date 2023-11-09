FROM node:16-slim as builder

ENV DEBIAN_FRONTEND noninteractive

ARG BUILD_ENV=prod

RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install

COPY . /app/
ENV REACT_APP_PRODUCTION_API_URL /api/v1
RUN yarn build:${BUILD_ENV}

FROM nginx:alpine
COPY --from=builder /app/build /assets
