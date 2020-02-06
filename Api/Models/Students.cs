using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Students
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Father { get; set; }
        public Classes Class { get; set; }
        [DataType(DataType.Date)]
        public string DateOfBirth { get; set; }
    }

    public class StudentModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Father { get; set; }
        public int ClassId { get; set; }
        [DataType(DataType.Date)]
        public string DateOfBirth { get; set; }
    }

}
