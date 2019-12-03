using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class AuthDb : IdentityDbContext
    {
        public AuthDb()
        {
        }

        public AuthDb(DbContextOptions options) : base(options)
        {

        }

        public DbSet<CustomizeUser> customizeUsers { get; set; }
        public DbSet<Classes> Classes { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<PeriodDetail> PeriodDetail { get; set; }
        public DbSet<SubAccountsDetails> SubAccounts { get; set; }
        public DbSet<Students> Students { get; set; }
    }
}
