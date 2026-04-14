FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN npm install -g bun && bun install

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "3000"]
