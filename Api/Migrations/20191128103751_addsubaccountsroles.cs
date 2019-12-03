using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class addsubaccountsroles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "SubAccounts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "SubAccounts");
        }
    }
}
