# Tix 🎫

A ticketing system that enables users to submit tickets for assistance and support requests. Built as a monorepo containing both UI and server applications.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v22 or higher) - for local development
- [npm](https://www.npmjs.com/) - comes with Node.js

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/jallenmanaloto/tix
cd tix
```

### Running with Docker (Recommended)

Start both services with a single command:

```bash
// Make sure you are at the root directory of the cloned repository
cd tix

// Build ui and server images
docker compose up --build
```

The `--build` flag ensures Docker rebuilds the images with the latest changes.

### Accessing the Application

Containers will start at the following ports:

- **UI (Frontend)**: http://localhost:5173
- **Server (Backend API)**: http://localhost:3000

### Database Setup

After starting the containers, you need to run migrations and seed data.

#### Run migrations:
```bash
# From your local machine (server directory)
cd server
npm run migrate:up
```

#### Seed data:
```bash
# From your local machine (server directory)
cd server
npm run seed
```

#### Database scripts:
```bash
# Create a new migration
npm run migrate:create <migration-name>

# Run pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Seed database with dummy data
npm run seed
```

## Development

### Project Structure

```bash
tix/
├── ui/          # Frontend application (Vite + React)
├── server/      # Backend API (Express + TypeScript)
└── docker-compose.yml
```

### Local Development (Without Docker)

If you prefer to run services locally:

**Server:**
```bash
cd server
npm install
npm run dev
```

**UI:**
```bash
cd ui
npm install
npm run dev
```

## Docker Commands

```bash
# Start services
docker compose up

# Rebuild and start services
docker compose up --build

# Stop services
docker compose down

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f server
docker compose logs -f ui
```
