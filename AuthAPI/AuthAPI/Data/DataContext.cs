using AuthAPI.Models;
using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<MembershipPlans> Plans { get; set; }
    public DbSet<Instructor> Instructors { get; set; }
    public DbSet<Facility> Facilities { get; set; }

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
       
         modelBuilder.Entity<Facility>().HasData(
            new Facility
            {
                FacilityId = 1,
                Title = "Cardio Area",
                Description = "Equipped with the latest treadmills, bikes, and ellipticals for all your cardio needs.",
                ImageUrl = "https://cdn-imgproxy.mamado.su/9bAjh3C9IDh3T8h5OjB6kIJKFQESs9Zz-sSAiALQtJU/rs:fit:1024:768:1/g:ce/q:90/czM6Ly9tYW1hZG8t/YXBpLXByb2R1Y3Rp/b24vc3RvcmFnZS8x/MzIzMzIzL2d5bS5q/cGc.webp"
            },
            new Facility
            {
                FacilityId = 2,
                Title = "Weightlifting Zone",
                Description = "Dumbbells, barbells, and machines to help you grow stronger every day.",
                ImageUrl = "https://www.revofitnessclub.ro/wp-content/uploads/2024/01/DAN01620-800x450.jpg"
            },
            new Facility
            {
                FacilityId = 3,
                Title = "Group Classes Studio",
                Description = "Join a variety of classes from HIIT to yoga with expert instructors.",
                ImageUrl = "https://cdn.myportfolio.com/62ebf0c9-4a49-4538-9cdf-f480ad08a25f/8a73dcad-e770-430a-9ff4-b8031571bc5e_rw_1920.jpg?h=7151f0973b1b6cacba580f5d6e76401f"
            },
            new Facility
            {
                FacilityId = 4,
                Title = "Swimming Pool",
                Description = "Olympic-sized indoor pool available all year round for lap swimming or leisure.",
                ImageUrl = "https://trustyspotter.com/wp-content/uploads/2022/07/nuffield_pool.jpeg"
            },
            new Facility
            {
                FacilityId = 5,
                Title = "Sauna & Spa",
                Description = "Relax and recover in our state-of-the-art sauna and spa facilities.",
                ImageUrl = "https://fionaspa.ro/wp-content/uploads/2023/08/Sauna-umeda-sau-uscata-descopera-modul-perfect-in-care-te-poti-relaxa-si-elibera-de-stres-1200x675.jpg"
            },
            new Facility
            {
                FacilityId = 6,
                Title = "Locker Rooms",
                Description = "Clean and spacious locker rooms with showers, hairdryers, and secure storage.",
                ImageUrl = "https://www.revofitnessclub.ro/wp-content/uploads/2024/01/DAN01451-800x450.jpg"
            }
        );
    }

}