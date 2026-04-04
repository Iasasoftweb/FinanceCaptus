FROM node:24-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .


FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app /app

EXPOSE 8000

CMD ["pnpm", "start"]
