defmodule TestElixirPhoenixApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TestElixirPhoenixApp.Repo,
      {Phoenix.PubSub, name: TestElixirPhoenixApp.PubSub},
      TestElixirPhoenixApp.Endpoint
    ]

    opts = [strategy: :one_for_one, name: TestElixirPhoenixApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    TestElixirPhoenixApp.Endpoint.config_change(changed, removed)
    :ok
  end
end
