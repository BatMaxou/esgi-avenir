FROM node:22-alpine

WORKDIR /app

COPY ./infrastructure/express/package*.json ./

RUN npm install

COPY ./infrastructure/express .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
