using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class MembershipPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Memberships_Membership_Id",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "MembershipPlans",
                columns: table => new
                {
                    MembershipId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: false),
                    Access = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HasInstructor = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MembershipPlans", x => x.MembershipId);
                });

            migrationBuilder.InsertData(
                table: "MembershipPlans",
                columns: new[] { "MembershipId", "Access", "Description", "HasInstructor", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Access from 9 AM to 5 PM (Weekdays)", "2 hours/week with Instructor & Free water bottle", true, "Starter", 30 },
                    { 2, "Access from 6 AM to 10 PM (Weekdays + Sat)", "4 hours/week with Instructor & Water bottle + Gym Towel", true, "Basic", 40 },
                    { 3, "Full-time Access + Sauna", "6 hours/week with Instructor & T-shirt + Supplements Samples", true, "Premium", 50 },
                    { 4, "24/7 Access + Sauna + Pool", "8 hours/week with Instructor & Complete Gym Kit", true, "Pro", 70 },
                    { 5, "VIP Lounge + 24/7 Access + Spa", "Personal Trainer. Included Custom Nutrition Plan + All Gear", true, "Elite", 99 },
                    { 6, "Access to Pool + Gym (6 AM - 10 PM)", "No instructor. Swim Cap + Water Bottle", false, "Solo Splash", 20 },
                    { 7, "Full Gym + Yoga Studio (Weekdays + Sat)", "No instructor. Yoga Mat + Relaxation Kit", false, "Solo Zen", 40 },
                    { 8, "Gym + Sauna + Yoga Studio + Pool (Full-Time Access)", "No instructor. Spa Pass + Premium Locker", false, "Solo Bliss", 50 }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Memberships_Membership_Id",
                table: "Users",
                column: "Membership_Id",
                principalTable: "Memberships",
                principalColumn: "Membership_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Memberships_Membership_Id",
                table: "Users");

            migrationBuilder.DropTable(
                name: "MembershipPlans");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Memberships_Membership_Id",
                table: "Users",
                column: "Membership_Id",
                principalTable: "Memberships",
                principalColumn: "Membership_Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
