# Use an official Node LTS image
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json jest.config.js ./
COPY src ./src

RUN npm run build
RUN npm run test

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/index.js", "Create a Spanish dub for this video"] 