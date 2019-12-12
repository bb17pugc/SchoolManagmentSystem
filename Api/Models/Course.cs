using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Course
    {
        public int ID { get; set; }
        [Required]
        [RegularExpression("^([a-z A-Z]+)$", ErrorMessage ="incorrrect name")]
        public string Name { get; set; }
        [Required]
        [RegularExpression("^([a-z A-Z 0-9]+)$", ErrorMessage = "incorrrect class")]
        public int Class { get; set; }
    }
}
