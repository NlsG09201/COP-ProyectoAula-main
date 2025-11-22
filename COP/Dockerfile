FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/COP/browser /usr/share/nginx/html
COPY docker-entrypoint.d/10-create-cita.sh /docker-entrypoint.d/10-create-cita.sh
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
