using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Api.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration configuration;
        private readonly AppSetting appSetting;
        private readonly   UserManager<CustomizeUser> userManager;
        private readonly SignInManager<CustomizeUser>  signinManager;
        private string message = "";

        public AuthController(IOptions<AppSetting> options ,  IConfiguration iconfig,UserManager<CustomizeUser> _userManager , SignInManager<CustomizeUser> _signInManager)
        {
            userManager = _userManager;
            signinManager = _signInManager;
            configuration = iconfig;
            appSetting = options.Value;
        }

        public bool SendEmail(string Email, string name, string code)
        {
            try
            {
                using (var smtpClient = new SmtpClient())
                {
                    smtpClient.EnableSsl = true;
                    smtpClient.Host = "smtp.gmail.com";
                    smtpClient.Port = 587;
                    smtpClient.UseDefaultCredentials = false;
                    smtpClient.Credentials
                        = new NetworkCredential("bb17pugc@gmail.com", "ggfgqavmnfxaqkmm");
                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { status=true , User = Email , Code = code }, protocol: HttpContext.Request.Scheme);


                    StringBuilder body = new StringBuilder()
                        .Append("your are registered to the SchoolManagmentSystem ")
                        .AppendLine("your email is confirmed click the below link  and get back into the application")
                        .AppendLine(callbackUrl);

                    MailMessage mailMessage = new MailMessage(new MailAddress("bb17pugc@gmail.com").Address,
                        new MailAddress(Email).Address,
                        "Congratulation! " + name ,
                        body.ToString());
                    mailMessage.Body = body.ToString();
                    mailMessage.IsBodyHtml = true;
                    smtpClient.Send(mailMessage);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



        [Route("registration")]
        public async Task<Object> Register( RegisterUser user)
        {

            if(ModelState.IsValid)
            {
                var registeration = new CustomizeUser()
                {
                    FullName = user.Name,
                    Email = user.Email,
                    UserName = user.Email
                };
                bool EmailStatus;
                var code = userManager.GenerateEmailConfirmationTokenAsync(registeration);
                EmailStatus = SendEmail(user.Email , user.Name , code.Result.ToString());
                if (EmailStatus == true)
                {
                 registeration.ConfirmationEmailCode = code.Result.ToString();
                 var result = await userManager.CreateAsync(registeration, user.Password);
                if (result.Succeeded)
                {
                        return Ok(result);
                }
                else
                {
                        string message = "";
                        foreach (var err in result.Errors)
                        {
                            message = err.Code + err.Description;
                        }
                    return BadRequest(message);
                }
                }


            }
            return BadRequest(ModelState);
        }
        [HttpPost]
        [Route("Login")]
        public async Task<object> Login( Login user)
        {
            var USER = await userManager.FindByNameAsync(user.UserName);
            if ((USER != null ? true : SetMessage(3)) && (await userManager.CheckPasswordAsync(USER, user.Password) ? true : SetMessage(1)) && (USER.EmailConfirmed ? true : SetMessage(2)))
            {
                var tokendescriptor = new SecurityTokenDescriptor()
                {
                    Subject = new System.Security.Claims.ClaimsIdentity(new Claim[] {
                          new Claim("UserId" , USER.Id)
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSetting.JWT_KEY.ToString())) , SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenhandler = new JwtSecurityTokenHandler();
                var securitytoken = tokenhandler.CreateToken(tokendescriptor);
                var token = tokenhandler.WriteToken(securitytoken);
                return Ok(new { token });
            }
            return BadRequest(message);
        }
        public bool SetMessage(int val)
        {
            if (val == 1)
            {
                message = "Username or password is incorrect";
            }
            if (val == 2)
            {
                message = "Your email is not confirmed plz check your email account  inbox and click the link that we sent you";
            }
            if (val == 3)
            {
                message = "plz register yourself first";
            }
            return false;
        }
        

    }
}