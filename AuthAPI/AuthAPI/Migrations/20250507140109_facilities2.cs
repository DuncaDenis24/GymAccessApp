using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class facilities2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Facilities",
                columns: new[] { "FacilityId", "Description", "ImageUrl", "Title" },
                values: new object[,]
                {
                    { 1, "Equipped with the latest treadmills, bikes, and ellipticals for all your cardio needs.", "https://cdn-imgproxy.mamado.su/9bAjh3C9IDh3T8h5OjB6kIJKFQESs9Zz-sSAiALQtJU/rs:fit:1024:768:1/g:ce/q:90/czM6Ly9tYW1hZG8t/YXBpLXByb2R1Y3Rp/b24vc3RvcmFnZS8x/MzIzMzIzL2d5bS5q/cGc.webp", "Cardio Area" },
                    { 2, "Dumbbells, barbells, and machines to help you grow stronger every day.", "https://www.revofitnessclub.ro/wp-content/uploads/2024/01/DAN01620-800x450.jpg", "Weightlifting Zone" },
                    { 3, "Join a variety of classes from HIIT to yoga with expert instructors.", "https://cdn.myportfolio.com/62ebf0c9-4a49-4538-9cdf-f480ad08a25f/8a73dcad-e770-430a-9ff4-b8031571bc5e_rw_1920.jpg?h=7151f0973b1b6cacba580f5d6e76401f", "Group Classes Studio" },
                    { 4, "Olympic-sized indoor pool available all year round for lap swimming or leisure.", "https://trustyspotter.com/wp-content/uploads/2022/07/nuffield_pool.jpeg", "Swimming Pool" },
                    { 5, "Relax and recover in our state-of-the-art sauna and spa facilities.", "https://fionaspa.ro/wp-content/uploads/2023/08/Sauna-umeda-sau-uscata-descopera-modul-perfect-in-care-te-poti-relaxa-si-elibera-de-stres-1200x675.jpg", "Sauna & Spa" },
                    { 6, "Clean and spacious locker rooms with showers, hairdryers, and secure storage.", "https://www.revofitnessclub.ro/wp-content/uploads/2024/01/DAN01451-800x450.jpg", "Locker Rooms" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 6);
        }
    }
}
