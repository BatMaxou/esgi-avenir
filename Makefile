install:
	@docker compose up -d
	@npm install
.PHONY: install

express-sync:
	@docker compose exec express npm -w infrastructure/express run sync
.PHONY: express-sync

express-fixtures:
	@docker compose exec express npm -w infrastructure/express run fixtures
.PHONY: express-fixtures

fastify-sync:
	@docker compose exec fastify npm -w infrastructure/fastify run sync
.PHONY: fastify-sync

fastify-fixtures:
	@docker compose exec fastify npm -w infrastructure/fastify run fixtures
.PHONY: fastify-fixtures
