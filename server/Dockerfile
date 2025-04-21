FROM node:18-alpine

WORKDIR /server

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm install

# Copy source and compile
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

EXPOSE 3000
CMD ["node", "dist/index.js"]
