using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class connections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_Instructor_Id",
                table: "Users",
                column: "Instructor_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Membership_Id",
                table: "Users",
                column: "Membership_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Instructors_Instructor_Id",
                table: "Users",
                column: "Instructor_Id",
                principalTable: "Instructors",
                principalColumn: "Instructor_Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Memberships_Membership_Id",
                table: "Users",
                column: "Membership_Id",
                principalTable: "Memberships",
                principalColumn: "Membership_Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Instructors_Instructor_Id",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Memberships_Membership_Id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Instructor_Id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Membership_Id",
                table: "Users");
        }
    }
}
