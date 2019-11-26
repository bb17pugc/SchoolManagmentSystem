using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class addteachersperiodcount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PeriodDetail_Courses_CourseID",
                table: "PeriodDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_PeriodDetail_Teachers_teacherID",
                table: "PeriodDetail");

            migrationBuilder.RenameColumn(
                name: "teacherID",
                table: "PeriodDetail",
                newName: "TeacherID");

            migrationBuilder.RenameIndex(
                name: "IX_PeriodDetail_teacherID",
                table: "PeriodDetail",
                newName: "IX_PeriodDetail_TeacherID");

            migrationBuilder.AddColumn<int>(
                name: "CountPeriod",
                table: "Teachers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "TeacherID",
                table: "PeriodDetail",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CourseID",
                table: "PeriodDetail",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PeriodDetail_Courses_CourseID",
                table: "PeriodDetail",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PeriodDetail_Teachers_TeacherID",
                table: "PeriodDetail",
                column: "TeacherID",
                principalTable: "Teachers",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PeriodDetail_Courses_CourseID",
                table: "PeriodDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_PeriodDetail_Teachers_TeacherID",
                table: "PeriodDetail");

            migrationBuilder.DropColumn(
                name: "CountPeriod",
                table: "Teachers");

            migrationBuilder.RenameColumn(
                name: "TeacherID",
                table: "PeriodDetail",
                newName: "teacherID");

            migrationBuilder.RenameIndex(
                name: "IX_PeriodDetail_TeacherID",
                table: "PeriodDetail",
                newName: "IX_PeriodDetail_teacherID");

            migrationBuilder.AlterColumn<int>(
                name: "teacherID",
                table: "PeriodDetail",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "CourseID",
                table: "PeriodDetail",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_PeriodDetail_Courses_CourseID",
                table: "PeriodDetail",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PeriodDetail_Teachers_teacherID",
                table: "PeriodDetail",
                column: "teacherID",
                principalTable: "Teachers",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
