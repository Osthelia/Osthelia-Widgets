FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Unprivileged image: runs as `nginx` (uid 101) and listens on 8080, so the pod can run non-root.
FROM nginxinc/nginx-unprivileged:1.30-alpine3.24

USER root
RUN apk upgrade --no-cache
USER 101

# Rendered into /etc/nginx/conf.d/default.conf at start; GCS_API_URL (base URL of GC Stats) is required.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
