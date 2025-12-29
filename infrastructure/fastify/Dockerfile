FROM node:22-alpine

WORKDIR /app

COPY ./package*.json .
COPY ./domain/package*.json ./domain/
COPY ./infrastructure/adapters/mariadb/package*.json ./infrastructure/adapters/mariadb/
COPY ./infrastructure/adapters/mongodb/package*.json ./infrastructure/adapters/mongodb/
COPY ./infrastructure/adapters/nodemailer/package*.json ./infrastructure/adapters/nodemailer/
COPY ./infrastructure/adapters/bcrypt/package*.json ./infrastructure/adapters/bcrypt/
COPY ./infrastructure/adapters/uuid/package*.json ./infrastructure/adapters/uuid/
COPY ./infrastructure/adapters/jwt/package*.json ./infrastructure/adapters/jwt/
COPY ./infrastructure/adapters/nodecron/package*.json ./infrastructure/adapters/nodecron/
COPY ./infrastructure/fastify/package*.json ./infrastructure/fastify/

RUN npm -w domain install
RUN npm -w infrastructure/adapters/mariadb install
RUN npm -w infrastructure/adapters/mongodb install
RUN npm -w infrastructure/adapters/nodemailer install
RUN npm -w infrastructure/adapters/bcrypt install
RUN npm -w infrastructure/adapters/uuid install
RUN npm -w infrastructure/adapters/jwt install
RUN npm -w infrastructure/adapters/nodecron install
RUN npm -w infrastructure/fastify install

COPY ./domain ./domain
COPY ./application ./application
COPY ./infrastructure/adapters ./infrastructure/adapters
COPY ./infrastructure/fastify ./infrastructure/fastify

EXPOSE 3000

CMD ["npm", "-w", "infrastructure/fastify", "run", "dev"]
