package handlers

import (
    "fmt"
    "net/http"
    "github.com/go-chi/chi/v5"
    "myapp/models"
    "myapp/views"
)

// In-memory storage (replace with database in production)
var items []models.Item
var nextID int

func init() {
    nextID = 1
    items = []models.Item{
        {ID: "1", Title: "Sample Item", Description: "A sample item"},
    }
    nextID = 2
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, `{"status":"healthy","service":"Go HTMX App"}`)
}

func HomePage(w http.ResponseWriter, r *http.Request) {
    component := views.Home()
    component.Render(r.Context(), w)
}

func ListItems(w http.ResponseWriter, r *http.Request) {
    component := views.ItemList(items)
    component.Render(r.Context(), w)
}

func GetItem(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    for _, item := range items {
        if item.ID == id {
            component := views.ItemDetail(item)
            component.Render(r.Context(), w)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
    fmt.Fprintf(w, "<p>Item not found</p>")
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
    title := r.FormValue("title")
    description := r.FormValue("description")
    
    item := models.Item{
        ID: fmt.Sprintf("%d", nextID),
        Title: title,
        Description: description,
    }
    nextID++
    
    items = append(items, item)
    
    w.Header().Set("HX-Redirect", "/items")
    w.WriteHeader(http.StatusCreated)
}

func EditItemForm(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    for _, item := range items {
        if item.ID == id {
            component := views.EditItemForm(item)
            component.Render(r.Context(), w)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
}

func UpdateItem(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    r.ParseForm()
    title := r.FormValue("title")
    description := r.FormValue("description")
    
    for i, item := range items {
        if item.ID == id {
            items[i].Title = title
            items[i].Description = description
            component := views.ItemDetail(items[i])
            component.Render(r.Context(), w)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    for i, item := range items {
        if item.ID == id {
            items = append(items[:i], items[i+1:]...)
            w.WriteHeader(http.StatusOK)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
}