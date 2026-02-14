namespace Services;

using Models;
using Data;

public class ItemService : IItemService
{
    private readonly ItemDbContext _context;

    public ItemService(ItemDbContext context)
    {
        _context = context;
    }

    public async Task<List<Item>> GetAllItemsAsync()
    {
        return await Task.FromResult(_context.Items.ToList());
    }

    public async Task<Item?> GetItemByIdAsync(int id)
    {
        return await Task.FromResult(_context.Items.FirstOrDefault(i => i.Id == id));
    }

    public async Task<Item> CreateItemAsync(string title, string description)
    {
        var item = new Item { Title = title, Description = description };
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<Item?> UpdateItemAsync(int id, string title, string description)
    {
        var item = _context.Items.FirstOrDefault(i => i.Id == id);
        if (item == null) return null;

        item.Title = title;
        item.Description = description;
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> DeleteItemAsync(int id)
    {
        var item = _context.Items.FirstOrDefault(i => i.Id == id);
        if (item == null) return false;

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
