var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddDbContext<ItemDbContext>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map endpoints
var api = app.MapGroup("/api/v1").WithOpenApi();

// Health check
app.MapGet("/health", () => new { status = "healthy", service = ".NET Minimal API" })
    .WithName("HealthCheck")
    .WithOpenApi();

// Items endpoints
api.MapGet("/items", GetItems)
    .WithName("GetItems")
    .WithOpenApi();

api.MapGet("/items/{id}", GetItemById)
    .WithName("GetItemById")
    .WithOpenApi();

api.MapPost("/items", CreateItem)
    .WithName("CreateItem")
    .WithOpenApi();

api.MapPut("/items/{id}", UpdateItem)
    .WithName("UpdateItem")
    .WithOpenApi();

api.MapDelete("/items/{id}", DeleteItem)
    .WithName("DeleteItem")
    .WithOpenApi();

app.Run();

// Endpoint handlers
async Task<IResult> GetItems(IItemService itemService)
{
    var items = await itemService.GetAllItemsAsync();
    return Results.Ok(items);
}

async Task<IResult> GetItemById(int id, IItemService itemService)
{
    var item = await itemService.GetItemByIdAsync(id);
    return item == null ? Results.NotFound() : Results.Ok(item);
}

async Task<IResult> CreateItem(CreateItemRequest request, IItemService itemService)
{
    var item = await itemService.CreateItemAsync(request.Title, request.Description);
    return Results.Created($"/api/v1/items/{item.Id}", item);
}

async Task<IResult> UpdateItem(int id, UpdateItemRequest request, IItemService itemService)
{
    var item = await itemService.UpdateItemAsync(id, request.Title, request.Description);
    return item == null ? Results.NotFound() : Results.Ok(item);
}

async Task<IResult> DeleteItem(int id, IItemService itemService)
{
    var success = await itemService.DeleteItemAsync(id);
    return success ? Results.NoContent() : Results.NotFound();
}

public record CreateItemRequest(string Title, string Description);
public record UpdateItemRequest(string Title, string Description);
