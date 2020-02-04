using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class DateSheetViewModel
    {
        public int ID { get; set; }
        [Required]
        public int Class { get; set; }
        [Required]
        public string Date { get; set; }
        [Required]
        public int Subject { get; set; }
        [Required]
        public int Teacher { get; set; }
        [Required]
        public string StartDate { get; set; }
        [Required]
        public string EndDate { get; set; }
        [Required]
        public string DateSheetName { get; set; }
    }
    public class DateSheet
    {
        public int ID { get; set; }
        public Classes Class { get; set; }
        public Course Subject { get; set; }
        public Teacher Teacher { get; set; }
        [DataType(DataType.DateTime)]
        public string Date { get; set; }
        [Required]
        public string StartDate { get; set; }
        [Required]
        public string EndDate { get; set; }
        [Required]
        public string DateSheetName { get; set; }
    }
}
