defmodule TestElixirPhoenixApp.Repo do
  use Ecto.Repo,
    otp_app: :test_elixir_phoenix_app,
    adapter: Ecto.Adapters.Postgres
end
