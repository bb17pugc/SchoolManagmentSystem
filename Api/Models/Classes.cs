using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Classes
    {
        public int ID { get; set; }
        [Required]
        [Range(0 , 10)]
        public int Name { get; set; }
        [Required]
        [Range(0 , Double.PositiveInfinity)]
        public int Fee { get; set; }
        [Required]
        [RegularExpression("^([a-z A-Z]+)$", ErrorMessage ="Invalid section name")]
        [MaxLength(1)]
        public string Section { get; set; }
    }
}
