FROM node:22-alpine as builder

WORKDIR /app
RUN apk update && apk add curl git jq

COPY package.json package-lock.json .
RUN npm clean-install

COPY . .
RUN npm run build

FROM nginx:alpine

RUN apk update && apk add jq

COPY --from=builder /app/build /srv/www
COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/90-write-env-to-json.sh /docker-entrypoint.d

EXPOSE 80
