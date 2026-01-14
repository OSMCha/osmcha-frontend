FROM node:22-alpine as builder

ENV DEBIAN_FRONTEND noninteractive

ARG BUILD_ENV=prod

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm clean-install --legacy-peer-deps

COPY src/ /app/src
COPY public/ /app/public
COPY index.html /app/
COPY vite.config.ts /app/
COPY tsconfig.json /app/
COPY tsconfig.node.json /app/
ENV VITE_PRODUCTION_API_URL /api/v1

RUN npm run build:${BUILD_ENV}

FROM nginx:alpine
COPY --from=builder /app/build /srv/www
COPY nginx.conf /etc/nginx/templates/default.conf.template
