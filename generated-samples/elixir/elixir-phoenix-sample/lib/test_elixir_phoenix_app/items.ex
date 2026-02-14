defmodule TestElixirPhoenixApp.Items do
  import Ecto.Query
  alias TestElixirPhoenixApp.{Item, Repo}

  def list_items do
    Repo.all(Item)
  end

  def get_item(id) do
    Repo.get(Item, id)
  end

  def create_item(attrs) do
    percent_item = %Item{}
    Item.changeset(percent_item, attrs)
    |> Repo.insert()
  end

  def update_item(percent_item, attrs) do
    percent_item
    |> Item.changeset(attrs)
    |> Repo.update()
  end

  def delete_item(percent_item) do
    Repo.delete(percent_item)
  end
end
