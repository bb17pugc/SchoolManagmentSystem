using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class applydataannotations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassesID",
                table: "PeriodDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Period",
                table: "PeriodDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PeriodDetail_ClassesID",
                table: "PeriodDetail",
                column: "ClassesID");

            migrationBuilder.AddForeignKey(
                name: "FK_PeriodDetail_Classes_ClassesID",
                table: "PeriodDetail",
                column: "ClassesID",
                principalTable: "Classes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PeriodDetail_Classes_ClassesID",
                table: "PeriodDetail");

            migrationBuilder.DropIndex(
                name: "IX_PeriodDetail_ClassesID",
                table: "PeriodDetail");

            migrationBuilder.DropColumn(
                name: "ClassesID",
                table: "PeriodDetail");

            migrationBuilder.DropColumn(
                name: "Period",
                table: "PeriodDetail");
        }
    }
}
