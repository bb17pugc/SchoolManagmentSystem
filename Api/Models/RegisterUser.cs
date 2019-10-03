using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class RegisterUser
    {
        [MaxLength(10)]
        [Required]
        [RegularExpression(("^([a-z A-Z]+)$") , ErrorMessage ="invalid name")]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(7)]
        public string Password { get; set; }
    }
}
