FROM node:22-alpine

WORKDIR /app

COPY ./package*.json .
COPY ./infrastructure/frontend/package*.json ./infrastructure/frontend/

RUN npm -w infrastructure/frontend install

COPY ./infrastructure/frontend ./infrastructure/frontend

EXPOSE 3000

CMD ["npm", "-w", "infrastructure/frontend", "run", "dev"]
