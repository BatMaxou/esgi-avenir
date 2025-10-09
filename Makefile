install:
	@npm install
.PHONY: install

build-express:
	@docker compose exec express npm -w infrastructure/express run build
.PHONY: build-express

sync-express:
	@docker compose exec express npm -w infrastructure/express run sync
.PHONY: sync-express
