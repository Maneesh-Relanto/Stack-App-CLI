defmodule TestElixirPhoenixApp.Item do
  use Ecto.Schema
  import Ecto.Changeset

  schema "items" do
    field :title, :string
    field :description, :string
    
    timestamps()
  end

  def changeset(item, attrs) do
    item
    |> cast(attrs, [:title, :description])
    |> validate_required([:title])
  end
end
