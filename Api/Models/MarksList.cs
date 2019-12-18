using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class MarksList
    {
        public int ID { get; set; }
        [Required]
        public int Class { get; set; }
        [Required]
        public int Subject { get; set; }
        [Required]
        public int Student { get; set; }
        [Required]
        public int Marks { get; set; }
        [Required]
        public int Total { get; set; }
    }
    public class MarkslistData
    {
        public int ID { get; set; }
        public virtual Classes Classes { get; set; }
        public virtual Course  Course{ get; set; }
        public virtual Students Students { get; set; }
        public int Marks{ get; set; }
        public int Total{ get; set; }
    }
}
