defmodule TestElixirPhoenixApp.MixProject do
  use Mix.Project

  def project do
    [
      app: :test_elixir_phoenix_app,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {TestElixirPhoenixApp.Application, []}
    ]
  end

  defp deps do
    [
      {:phoenix, "~> 1.7"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.10"},
      {:postgrex, "~> 0.17"},
      {:plug_cowboy, "~> 2.6"}
    ]
  end
end
