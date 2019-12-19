using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class PeriodDetail
    {
        public int ID { get; set; }
        [Required]
        public Course Course { get; set; }
        [Required]
        public Teacher Teacher { get; set; }
        [Required]
        public Classes Classes { get; set; }
        public int Period { get; set; }
    }
}
