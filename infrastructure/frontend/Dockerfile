FROM node:22-alpine

WORKDIR /app

COPY ./infrastructure/frontend/package*.json ./

RUN npm install

COPY ./infrastructure/frontend .

EXPOSE 3000

CMD ["npm", "run", "dev"]
