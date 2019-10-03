using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    public class AccountController : Controller 
    {
        private readonly UserManager<CustomizeUser> _userManager;
        AuthDb db = new AuthDb();

        public AccountController(UserManager<CustomizeUser> userManager)
        {
            _userManager = userManager;
        }
        public ActionResult ConfirmEmail(bool status = false, string User = null ,  string Code = null)
        {
            if (status == true && !String.IsNullOrWhiteSpace(Code) && !String.IsNullOrWhiteSpace(User))
            {

                Task<bool> userStatus = CheckEmailConfirmCode(User , Code);
                if (userStatus.Result == true)
                {
                    return Redirect("http://localhost:4200/login");
                }
            }
            return View();
        }

        public async Task<bool> CheckEmailConfirmCode(string email, string code)
        {
            CustomizeUser user = await _userManager.FindByEmailAsync(email);
            if (user.ConfirmationEmailCode.Equals(code))
            { 
                user.EmailConfirmed = true;
                IdentityResult x = await _userManager.UpdateAsync(user);
                return true;
            }
            return false;
        }

    }
}