FROM node:18

RUN apt-get update && apt-get install -y inotify-tools

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]