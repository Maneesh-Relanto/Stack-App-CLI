defmodule TestElixirPhoenixApp.Router do
  use Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", TestElixirPhoenixApp do
    pipe_through :browser
    get "/", PageController, :home
  end

  scope "/api", TestElixirPhoenixApp do
    pipe_through :api
    get "/health", HealthController, :check
    get "/items", ItemController, :index
    post "/items", ItemController, :create
    get "/items/:id", ItemController, :show
    put "/items/:id", ItemController, :update
    delete "/items/:id", ItemController, :delete
  end
end
