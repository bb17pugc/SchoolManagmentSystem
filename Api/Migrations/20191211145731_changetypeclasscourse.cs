using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class changetypeclasscourse : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Class",
                table: "Courses",
                nullable: false,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Class",
                table: "Courses",
                nullable: false,
                oldClrType: typeof(int));
        }
    }
}
