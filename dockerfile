FROM node:lts-alpine as builder

WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn no_ts_build

FROM nginx:alpine as production-stage

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
