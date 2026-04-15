# Stage 1: build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN npm install -g bun && bun install

COPY . .
RUN bun run build


# Stage 2: serve with nginx
FROM nginx:alpine

# remove default nginx config (optional but cleaner)
RUN rm /etc/nginx/conf.d/default.conf

# copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
