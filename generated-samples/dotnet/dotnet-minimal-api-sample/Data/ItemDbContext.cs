namespace Data;

using Microsoft.EntityFrameworkCore;
using Models;

public class ItemDbContext : DbContext
{
    public DbSet<Item> Items { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? "Host=localhost;Database=items;Username=postgres;Password=password";
        
        optionsBuilder.UseNpgsql(connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>()
            .HasKey(e => e.Id);

        modelBuilder.Entity<Item>()
            .Property(e => e.Title)
            .IsRequired();
    }
}
