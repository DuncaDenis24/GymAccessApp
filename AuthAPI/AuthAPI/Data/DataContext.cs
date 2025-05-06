using AuthAPI.Models;
using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<MembershipPlans> Plans { get; set; }
    public DbSet<Instructor> Instructors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User-Membership relationship
        modelBuilder.Entity<User>()
            .HasOne(u => u.Membership)
            .WithMany(m => m.Users)
            .HasForeignKey(u => u.Membership_Id)
            .OnDelete(DeleteBehavior.Cascade);

        // User-Instructor relationship
        modelBuilder.Entity<User>()
            .HasOne(u => u.Instructor)
            .WithMany(i => i.Users)
            .HasForeignKey(u => u.Instructor_Id)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<MembershipPlans>().HasData(
        new MembershipPlans { MembershipId = 1, Name = "Starter", Price = 30, Description = "2 hours/week with Instructor & Free water bottle", Access = "Access from 9 AM to 5 PM (Weekdays)", HasInstructor = true },
        new MembershipPlans { MembershipId = 2, Name = "Basic", Price = 40, Description = "4 hours/week with Instructor & Water bottle + Gym Towel", Access = "Access from 6 AM to 10 PM (Weekdays + Sat)", HasInstructor = true },
        new MembershipPlans { MembershipId = 3, Name = "Premium", Price = 50, Description = "6 hours/week with Instructor & T-shirt + Supplements Samples", Access = "Full-time Access + Sauna", HasInstructor = true },
        new MembershipPlans { MembershipId = 4, Name = "Pro", Price = 70, Description = "8 hours/week with Instructor & Complete Gym Kit", Access = "24/7 Access + Sauna + Pool", HasInstructor = true },
        new MembershipPlans { MembershipId = 5, Name = "Elite", Price = 99, Description = "Personal Trainer. Included Custom Nutrition Plan + All Gear", Access = "VIP Lounge + 24/7 Access + Spa", HasInstructor = true },
        new MembershipPlans { MembershipId = 6, Name = "Solo Splash", Price = 20, Description = "No instructor. Swim Cap + Water Bottle", Access = "Access to Pool + Gym (6 AM - 10 PM)", HasInstructor = false },
        new MembershipPlans { MembershipId = 7, Name = "Solo Zen", Price = 40, Description = "No instructor. Yoga Mat + Relaxation Kit", Access = "Full Gym + Yoga Studio (Weekdays + Sat)", HasInstructor = false },
        new MembershipPlans { MembershipId = 8, Name = "Solo Bliss", Price = 50, Description = "No instructor. Spa Pass + Premium Locker", Access = "Gym + Sauna + Yoga Studio + Pool (Full-Time Access)", HasInstructor = false }
    );

    }
}