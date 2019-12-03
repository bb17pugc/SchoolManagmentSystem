using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class addClassStudents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Class",
                table: "Students");

            migrationBuilder.AddColumn<int>(
                name: "ClassID",
                table: "Students",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_ClassID",
                table: "Students",
                column: "ClassID");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Classes_ClassID",
                table: "Students",
                column: "ClassID",
                principalTable: "Classes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Classes_ClassID",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_ClassID",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "Students");

            migrationBuilder.AddColumn<string>(
                name: "Class",
                table: "Students",
                nullable: true);
        }
    }
}
