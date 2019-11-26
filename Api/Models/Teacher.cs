using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Teacher
    {
        public int ID { get; set; }
        [Required]
        [RegularExpression("^[a-z A-Z]+$", ErrorMessage = "The name is incorrect use only alphabets")]
        public string Name { get; set; }
        [Required]
        [RegularExpression("^[0-9]{5}-[0-9]{7}-[0-9]$", ErrorMessage = "The name is incorrect use only alphabets")]
        public string Cnic { get; set; }
        [Required]
        public string Education { get; set; }
        [Required]
        [RegularExpression("^[a-z A-Z]+$", ErrorMessage = "The name is incorrect use only alphabets")]
        public string Institute { get; set; }
        [DataType(DataType.Date)]
        [Required]
        public string CompletionDate { get; set; }
        public int CountPeriod { get; set; }
    }
}
