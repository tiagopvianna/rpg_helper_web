# Usa Node.js como base
FROM node:18

# Instala o inotify-tools
RUN apt-get update && apt-get install -y inotify-tools

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o código do jogo para dentro do container
COPY . .

# Expõe a porta do servidor do Webpack
EXPOSE 8080

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]

# Instala o ngrok
# RUN npm install -g ngrok
# Set the ngrok authtoken (replace YOUR_AUTHTOKEN)
# RUN ngrok config add-authtoken YOUR_AUTHTOKEN
# Comando para iniciar o jogo e o ngrok simultaneamente
# CMD npm run dev & ngrok http 8080 --log stdout
