package models

type Item struct {
    ID          string
    Title       string
    Description string
}

type ItemRequest struct {
    Title       string
    Description string
}