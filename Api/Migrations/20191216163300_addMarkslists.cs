using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class addMarkslists : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Markslists",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    classesID = table.Column<int>(nullable: true),
                    courseID = table.Column<int>(nullable: true),
                    studentsID = table.Column<int>(nullable: true),
                    Marks = table.Column<int>(nullable: false),
                    Total = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Markslists", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Markslists_Classes_classesID",
                        column: x => x.classesID,
                        principalTable: "Classes",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Markslists_Courses_courseID",
                        column: x => x.courseID,
                        principalTable: "Courses",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Markslists_Students_studentsID",
                        column: x => x.studentsID,
                        principalTable: "Students",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Markslists_classesID",
                table: "Markslists",
                column: "classesID");

            migrationBuilder.CreateIndex(
                name: "IX_Markslists_courseID",
                table: "Markslists",
                column: "courseID");

            migrationBuilder.CreateIndex(
                name: "IX_Markslists_studentsID",
                table: "Markslists",
                column: "studentsID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Markslists");
        }
    }
}
