FROM node:latest

WORKDIR /api

COPY . .

RUN npm install

EXPOSE 3333

CMD ["sh", "-c", "npm run migrate && npm run start"]
