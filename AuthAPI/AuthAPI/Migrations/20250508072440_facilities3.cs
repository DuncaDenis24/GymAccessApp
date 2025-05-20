using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class facilities3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1,
                column: "ImageUrl",
                value: "https://cdn-imgproxy.mamado.su/9bAjh3C9IDh3T8h5OjB6kIJKFQESs9Zz-sSAiALQtJU/rs:fit:1024:768:1/g:ce/q:90/czM6Ly9tYW1hZG8t/YXBpLXByb2R1Y3Rp/b24vc3RvcmFnZS8x/MzIzMzIzL2d5bS5q/cGc.webp");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 2,
                column: "ImageUrl",
                value: "https://www.revofitnessclub.ro/wp-content/uploads/2024/01/DAN01620-800x450.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 3,
                column: "ImageUrl",
                value: "https://cdn.myportfolio.com/62ebf0c9-4a49-4538-9cdf-f480ad08a25f/8a73dcad-e770-430a-9ff4-b8031571bc5e_rw_1920.jpg?h=7151f0973b1b6cacba580f5d6e76401f");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 4,
                column: "ImageUrl",
                value: "https://trustyspotter.com/wp-content/uploads/2022/07/nuffield_pool.jpeg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 5,
                column: "ImageUrl",
                value: "https://fionaspa.ro/wp-content/uploads/2023/08/Sauna-umeda-sau-uscata-descopera-modul-perfect-in-care-te-poti-relaxa-si-elibera-de-stres-1200x675.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 6,
                column: "ImageUrl",
                value: "https://www.revofitnessclub.ro/wp-content/uploads/2024/01/DAN01451-800x450.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1,
                column: "ImageUrl",
                value: "/images/cardio.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 2,
                column: "ImageUrl",
                value: "/images/weights.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 3,
                column: "ImageUrl",
                value: "/images/yoga.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 4,
                column: "ImageUrl",
                value: "/images/pool.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 5,
                column: "ImageUrl",
                value: "/images/sauna.jpg");

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 6,
                column: "ImageUrl",
                value: "/images/locker.jpg");
        }
    }
}
