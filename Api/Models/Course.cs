using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class CourseViewModel
    {
        public int ID { get; set; }
        [Required]
        [RegularExpression("^([a-z A-Z]+)$", ErrorMessage = "incorrrect name")]
        public string Name { get; set; }
        public int Class { get; set; }
    }
    public class Course
    {
        public int ID { get; set; }
        [Required]
        [RegularExpression("^([a-z A-Z]+)$", ErrorMessage ="incorrrect name")]
        public string Name { get; set; }
        public Classes Classes { get; set; }
    }
}
