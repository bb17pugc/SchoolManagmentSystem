using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SubAccountsController : ControllerBase
    {
        private readonly UserManager<CustomizeUser> _userManager;
        private readonly AuthDb authDb;
        public SubAccountsController(AuthDb authdb , UserManager<CustomizeUser> userManager)
        {
            _userManager = userManager;
             authDb = authdb;
        }
        public async Task<object> Add(SubAccount model)
        {
            SubAccountsDetails subAccountsDetails = new SubAccountsDetails();
            subAccountsDetails.User  = await _userManager.FindByNameAsync(model.UserName) ;
            subAccountsDetails.Name = model.Name;
            subAccountsDetails.Password = model.Password;
            subAccountsDetails.Role = "Customer";
            return Ok(model);
        }
    }
}