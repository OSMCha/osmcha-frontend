FROM node:16-slim as builder

ENV DEBIAN_FRONTEND noninteractive

ARG BUILD_ENV=prod

RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install

COPY src/ /app/src
COPY public/ /app/public
ENV REACT_APP_PRODUCTION_API_URL /api/v1
RUN yarn run build:${BUILD_ENV}

FROM nginx:alpine
COPY --from=builder /app/build /srv/www
COPY nginx.conf /etc/nginx/templates/default.conf.template
