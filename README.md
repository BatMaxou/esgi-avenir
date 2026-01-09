# Avenir

## Équipe

- BATISTA Maxime (IW2)
- COUVIDOU Guillaume (IW2)

## Installation

Copier le fichier `compose.override.example.yaml` en `compose.override.yaml`.

```bash
cp compose.override.example.yaml compose.override.yaml
```

Puis lancer la commande suivante :

```bash
make install
```

### Backend

> [!WARNING]
> Un seul backend peut être utilisé à la fois à cause des cron jobs.

#### Express

Express est le choix par défaut pour la partie backend de l'application.

Copier le fichier `infrastructure/express/.env` en `infrastructure/express/.env.local` et remplacer, si besoin, les variables d'environnement par les bonnes valeurs.

```bash
cp infrastructure/express/.env.example infrastructure/express/.env.local
```

Lancer la commande suivante pour synchroniser la base de données :

```bash
make express-sync
```

#### Fastify

Pour utiliser Fastify, copier le fichier `infrastructure/fastify/.env` en `infrastructure/fastify/.env.local` et remplacer, si besoin, les variables d'environnement par les bonnes valeurs.

Décommenter également le service `fastify` dans le fichier `compose.yaml` sans oublier de commenter le service `express` en même temps.

```bash
cp infrastructure/fastify/.env.example infrastructure/fastify/.env.local
```

Lancer la commande suivante pour synchroniser la base de données :

```bash
make fastify-sync
```

### BDD

Par défaut, MariaDB est utilisé comme base de données, MongoDB est aussi disponible.

Le choix de la base de données à utiliser est fait dans le fichier d'env de chaque service backend via la variable `DB_SOURCE`.

### Frontend

Copier le fichier `infrastructure/frontend/.env` en `infrastructure/frontend/.env.local` et remplacer, si besoin, les variables d'environnement par les bonnes valeurs.

```bash
cp infrastructure/frontend/.env.example infrastructure/frontend/.env.local
```

## Fixtures

Pour créer des fixtures, lancer une des commandes suivantes :

```bash
# Express
make express-fixtures

# Fastify
make fastify-fixtures
```

Les comptes utilisateurs suivants seront créés :

- Director : `director@avenir.com`
- User : `user@avenir.com`, `second.user@avenir.com` et `third.user@avenir.com`
- Advisor : `advisor@avenir.com` et `second.advisor@avenir.com`

Avec le mot de passe `azertyuiAZ123#`.

## Lancer l'application

Lancer l'application avec docker :

```bash
docker compose up
```

L'application sera accessible, par défaut, sur `http://localhost:3000`.
