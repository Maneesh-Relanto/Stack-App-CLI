namespace Services;

using Models;

public interface IItemService
{
    Task<List<Item>> GetAllItemsAsync();
    Task<Item?> GetItemByIdAsync(int id);
    Task<Item> CreateItemAsync(string title, string description);
    Task<Item?> UpdateItemAsync(int id, string title, string description);
    Task<bool> DeleteItemAsync(int id);
}
