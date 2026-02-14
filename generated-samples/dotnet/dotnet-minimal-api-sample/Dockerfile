FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet build "test-dotnet-minimal-api-app.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "test-dotnet-minimal-api-app.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "test-dotnet-minimal-api-app.dll"]
