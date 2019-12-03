using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class SubAccount
    {
        [Required]
        [RegularExpression("^([a-z A-Z]+)$", ErrorMessage = "Invalid Name")]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }
        public string UserName { get; set; }
    }
    public class SubAccountsDetails
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public IdentityUser User { get; set; }
        public string Role { get; set; }
    }
}
