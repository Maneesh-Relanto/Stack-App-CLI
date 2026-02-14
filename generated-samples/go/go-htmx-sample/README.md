# test-go-htmx-app

Go + HTMX Server-Side Rendering Application

## Features

- **Chi Router** - Lightweight HTTP router
- **HTMX** - Interactive server-rendered components
- **Templ** - Type-safe HTML templating
- **PostgreSQL** ready - Database integration
- **Tailwind CSS** - Utility-first CSS

## Getting Started

### Prerequisites

- Go 1.21+
- Templ `go install github.com/a-h/templ/cmd/templ@latest`

### Installation

```bash
cd test-go-htmx-app
go mod download
templ generate
```

### Running

```bash
go run main.go
```

Visit http://localhost:3000

## API Routes

- `GET /` - Home page
- `GET /items` - List all items
- `POST /items` - Create item
- `GET /items/:id` - Get item detail
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item
- `GET /items/:id/edit` - Edit form

## Project Structure

```
.
├── main.go          # Entry point
├── go.mod           # Dependencies
├── handlers/        # HTTP handlers
├── models/          # Data models
├── views/           # Templ templates
├── static/          # CSS/JS assets
└── README.md
```

## License

MIT
