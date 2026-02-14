package main

import (
    "log"
    "net/http"
    "os"
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
    "github.com/joho/godotenv"
    "myapp/handlers"
)

func main() {
    // Load environment variables
    godotenv.Load()

    // Create Chi router
    r := chi.NewRouter()

    // Global middleware
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.SetHeader("Content-Type", "text/html"))

    // Static files
    r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

    // Health check
    r.Get("/health", handlers.HealthCheck)

    // HTMX routes
    r.Get("/", handlers.HomePage)
    r.Get("/items", handlers.ListItems)
    r.Post("/items", handlers.CreateItem)
    r.Get("/items/{id}", handlers.GetItem)
    r.Put("/items/{id}", handlers.UpdateItem)
    r.Delete("/items/{id}", handlers.DeleteItem)
    r.Get("/items/{id}/edit", handlers.EditItemForm)

    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    log.Println("🚀 Server running on http://localhost:" + port)
    if err := http.ListenAndServe(":"+port, r); err != nil {
        log.Panic(err)
    }
}