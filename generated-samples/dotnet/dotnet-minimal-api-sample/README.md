# test-dotnet-minimal-api-app

ASP.NET Core Minimal APIs - Production-Ready Template

## Features

- **Minimal APIs** - Lightweight and performant
- **Entity Framework Core** - ORM for data access
- **PostgreSQL** - Database support
- **Swagger/OpenAPI** - API documentation
- **Dependency Injection** - Built-in DI container

## Getting Started

### Prerequisites

- .NET 8.0+
- PostgreSQL (optional - uses in-memory by default)

### Installation

```bash
cd test-dotnet-minimal-api-app
dotnet restore
```

### Running

```bash
dotnet run
```

API available at: https://localhost:5001/api/v1

Swagger UI: https://localhost:5001/swagger

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/{id}` - Get item by ID
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/{id}` - Update item
- `DELETE /api/v1/items/{id}` - Delete item

## Project Structure

```
.
├── Program.cs           # Main entry point
├── Models/              # Data models
├── Services/            # Business logic
├── Data/                # EF Core contexts
└── test-dotnet-minimal-api-app.csproj
```

## Testing

```bash
dotnet test
```

## License

MIT
