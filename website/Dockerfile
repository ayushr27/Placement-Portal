FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Was /usr/share/ngnix/html - a typo. nginx.conf serves /usr/share/nginx/html
# and entrypoint.sh writes env-config.js there, so the build output was copied
# somewhere nginx never reads and the container served the default page.
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 3000