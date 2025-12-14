FROM node:22-alpine

WORKDIR /app

COPY ./package*.json .
COPY ./domain/package*.json ./domain/
COPY ./infrastructure/adapters/sse/package*.json ./infrastructure/adapters/sse/
COPY ./infrastructure/frontend/package*.json ./infrastructure/frontend/

RUN npm -w domain install
RUN npm -w infrastructure/adapters/sse install
RUN npm -w infrastructure/frontend install

COPY ./domain ./domain
COPY ./application ./application
COPY ./infrastructure/frontend ./infrastructure/frontend
COPY ./infrastructure/adapters ./infrastructure/adapters
COPY ./infrastructure/utils/frontend ./infrastructure/utils/frontend

EXPOSE 3000

CMD ["npm", "-w", "infrastructure/frontend", "run", "dev"]
