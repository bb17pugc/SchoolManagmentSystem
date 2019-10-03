using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class CustomizeUser : IdentityUser
    {
        public string FullName { get; set; }
        public string ConfirmationEmailCode { get; set; }
    }
}
