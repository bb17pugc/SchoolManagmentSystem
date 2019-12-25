using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class addcoldatesheet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DateSheetName",
                table: "DateSheet",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EndDate",
                table: "DateSheet",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StartDate",
                table: "DateSheet",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateSheetName",
                table: "DateSheet");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "DateSheet");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "DateSheet");
        }
    }
}
