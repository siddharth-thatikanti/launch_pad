
# Stage 1: Install all dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# Stage 2: Build NestJS application
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# Stage 3: Production dependencies
FROM node:22-alpine AS prod-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# Stage 4: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME=0.0.0.0

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000

CMD ["node", "dist/main.js"]
