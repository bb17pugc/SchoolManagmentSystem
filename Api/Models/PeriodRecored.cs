using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class PeriodRecored
    {
        public int ID { get; set; } 
        public int Classes { get; set;}
        public string Section { get; set; }
        public int Period { get; set; }
        public string Course { get; set; }
        public string Teacher { get; set; }
    }
}
