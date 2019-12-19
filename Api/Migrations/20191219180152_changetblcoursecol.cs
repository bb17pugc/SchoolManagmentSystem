using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class changetblcoursecol : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassesID",
                table: "Courses",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_ClassesID",
                table: "Courses",
                column: "ClassesID");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Classes_ClassesID",
                table: "Courses",
                column: "ClassesID",
                principalTable: "Classes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Classes_ClassesID",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_ClassesID",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "ClassesID",
                table: "Courses");
        }
    }
}
