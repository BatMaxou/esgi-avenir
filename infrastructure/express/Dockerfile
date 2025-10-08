FROM node:22-alpine

WORKDIR /app

COPY ./package*.json .
COPY ./infrastructure/express/package*.json ./infrastructure/express/
COPY ./domain ./domain
COPY ./application ./application

RUN npm -w infrastructure/express install

COPY ./infrastructure/express ./infrastructure/express

EXPOSE 3000

CMD ["npm", "-w", "infrastructure/express", "run", "dev", "--", "--host", "0.0.0.0"]
