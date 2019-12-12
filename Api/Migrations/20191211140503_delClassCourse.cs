using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class delClassCourse : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Classes_classesID",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_classesID",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "classesID",
                table: "Courses");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "classesID",
                table: "Courses",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_classesID",
                table: "Courses",
                column: "classesID");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Classes_classesID",
                table: "Courses",
                column: "classesID",
                principalTable: "Classes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
