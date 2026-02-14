defmodule TestElixirPhoenixApp.HealthController do
  use TestElixirPhoenixApp, :controller

  def check(conn, _params) do
    json(conn, %{status: "healthy", service: "Phoenix API"})
  end
end

defmodule TestElixirPhoenixApp.ItemController do
  use TestElixirPhoenixApp, :controller
  alias TestElixirPhoenixApp.Items

  def index(conn, _params) do
    items = Items.list_items()
    json(conn, %{items: items})
  end

  def show(conn, params) do
    case Items.get_item(params["id"]) do
      nil -> send_resp(conn, :not_found, "")
      item -> json(conn, item)
    end
  end

  def create(conn, params) do
    case Items.create_item(%{title: params["title"], description: params["description"]}) do
      {:ok, item} -> json(conn |> put_status(:created), item)
      {:error, _} -> send_resp(conn, :bad_request, "")
    end
  end

  def update(conn, params) do
    item = Items.get_item(params["id"])
    case Items.update_item(item, params) do
      {:ok, updated} -> json(conn, updated)
      {:error, _} -> send_resp(conn, :not_found, "")
    end
  end

  def delete(conn, params) do
    item = Items.get_item(params["id"])
    case Items.delete_item(item) do
      {:ok, _} -> send_resp(conn, :no_content, "")
      {:error, _} -> send_resp(conn, :not_found, "")
    end
  end
end
