FROM node:20.17

WORKDIR /api

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY package*.json ./

RUN npm install @swc/core-linux-x64-gnu && npm ci

COPY . .

EXPOSE 3333


CMD ["/entrypoint.sh"]
