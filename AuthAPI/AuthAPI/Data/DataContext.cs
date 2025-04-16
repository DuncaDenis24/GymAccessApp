using AuthAPI.Models;
using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<Instructor> Instructors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User-Membership relationship
        modelBuilder.Entity<User>()
            .HasOne(u => u.Membership)
            .WithMany(m => m.Users)
            .HasForeignKey(u => u.Membership_Id)
            .OnDelete(DeleteBehavior.SetNull);

        // User-Instructor relationship
        modelBuilder.Entity<User>()
            .HasOne(u => u.Instructor)
            .WithMany(i => i.Users)
            .HasForeignKey(u => u.Instructor_Id)
            .OnDelete(DeleteBehavior.SetNull);
    }
}