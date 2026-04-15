# Stage 1: build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN npm install -g bun && bun install

COPY . .
RUN bun run build


# Stage 2: serve with nginx
FROM nginx:alpine

# copy built files (adjust if your build folder is different)
COPY --from=builder /app/dist /usr/share/nginx/html

# custom nginx config (important for SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
