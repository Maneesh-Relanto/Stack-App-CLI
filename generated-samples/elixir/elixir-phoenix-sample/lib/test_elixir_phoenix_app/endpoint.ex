defmodule TestElixirPhoenixApp.Endpoint do
  use Phoenix.Endpoint, otp_app: :test_elixir_phoenix_app

  plug :put_root_layout, {TestElixirPhoenixApp.LayoutView, :root}
  plug Phoenix.Router, router: TestElixirPhoenixApp.Router
end
