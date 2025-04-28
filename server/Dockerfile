FROM node:18-alpine

WORKDIR /server

# Install deps first for better layer caching
COPY server/package.json server/package-lock.json ./
COPY shared_core ./shared_core
RUN npm install

# Copy source and compile
COPY server/tsconfig.json ./
COPY server/src ./src
RUN cd shared_core && npm install && npm run build
RUN npx tsc

EXPOSE 3000
CMD ["node", "dist/index.js"]
