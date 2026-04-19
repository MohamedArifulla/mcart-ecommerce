FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG BUILD_ID=REPLACED_BY_CI
RUN sed -i "s/REPLACED_BY_CI/$BUILD_ID/g" src/environments/environment.ts
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
