# test-elixir-phoenix-app

Phoenix API - Real-time Elixir web framework

## Features

- **Phoenix Framework** - Web framework
- **LiveView** - Real-time components
- **Channels** - WebSocket support
- **Ecto** - Database library
- **PostgreSQL** - Database

## Getting Started

### Prerequisites

- Elixir 1.14+
- Phoenix 1.7+
- PostgreSQL

### Installation

```bash
cd test-elixir-phoenix-app
mix deps.get
mix ecto.create
mix ecto.migrate
```

### Running

```bash
mix phx.server
```

Server: http://localhost:4000

## API Endpoints

- GET /api/health - Health check
- GET /api/items - List items
- POST /api/items - Create item
- GET /api/items/:id - Get item
- PUT /api/items/:id - Update item
- DELETE /api/items/:id - Delete item

## Project Structure

```
lib/
  test_elixir_phoenix_app/
    - application.ex
    - repo.ex
    - items.ex (context)
    - item.ex (schema)
    web/
      - router.ex
      - controllers/
      - channels/

priv/
  repo/
    migrations/

mix.exs
```

## License

MIT
