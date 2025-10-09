FROM node:22-alpine

WORKDIR /app

COPY ./package*.json .
COPY ./infrastructure/adapters/mariadb/package*.json ./infrastructure/adapters/mariadb/
COPY ./infrastructure/adapters/mongodb/package*.json ./infrastructure/adapters/mongodb/
COPY ./infrastructure/express/package*.json ./infrastructure/express/

RUN npm -w infrastructure/adapters/mariadb install
RUN npm -w infrastructure/adapters/mongodb install
RUN npm -w infrastructure/express install

COPY ./domain ./domain
COPY ./application ./application
COPY ./infrastructure/adapters/mariadb ./infrastructure/adapters/mariadb
COPY ./infrastructure/adapters/mongodb ./infrastructure/adapters/mongodb
COPY ./infrastructure/express ./infrastructure/express

EXPOSE 3000

CMD ["npm", "-w", "infrastructure/express", "run", "dev", "--", "--host", "0.0.0.0"]
