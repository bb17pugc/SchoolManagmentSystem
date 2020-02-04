using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        AuthDb authDb;
        public TeacherController(AuthDb db)
        {
            authDb = db;   
        }
        public async Task<Object> List()
        {
            var List = await Task.Run(() => authDb.Teachers.ToList());
            return Ok(List);    
        }
        public async Task<Object> Add(Teacher teacher)
        {
            try
            {
                if (DateTime.Compare(Convert.ToDateTime(teacher.CompletionDate.ToString()), DateTime.UtcNow.Date) > 0 || DateTime.Compare(Convert.ToDateTime(teacher.CompletionDate.ToString()), DateTime.UtcNow.Date) == 0)
                {
                    ModelState.AddModelError("CompletionDate" , "Date is invalid");
                }
            }
            catch (Exception e)
            {
                ModelState.AddModelError("CompletionDate", e.ToString());
            }

            if (ModelState.IsValid)
            {
                Teacher newrecored = new Teacher
                {
                    ID = teacher.ID,
                    Name = teacher.Name,
                    Cnic = teacher.Cnic,
                    Education = teacher.Education,
                    Institute = teacher.Institute,
                    CompletionDate = teacher.CompletionDate,
                };
                
                    if (newrecored.ID != 0)
                    {
                        authDb.Entry(newrecored).State = EntityState.Modified;
                    }
                    else
                    {
                        var checkrecored = await Task.Run(() => authDb.Teachers.Where(a => a.Cnic == newrecored.Cnic).FirstOrDefault());
                        if (checkrecored != null)
                        {
                            return BadRequest("recored with this cnic number is added already");
                        }
                        await Task.Run(()=> authDb.AddAsync(newrecored));
                   }
                    await authDb.SaveChangesAsync();
                    return Ok("recored updated already");
            }
            return BadRequest(ModelState);
        }
        [Route("{id}")]
        public async Task<Object> Delete(int id = 0)
        {
            if (id != 0)
            {
                Teacher recored = await Task.Run(() => authDb.Teachers.Where(a => a.ID == id).FirstOrDefault());
                if (recored != null)
                {
                    await Task.Run(()=>authDb.Teachers.Remove(recored));
                    await authDb.SaveChangesAsync();
                    return Ok("data deleted successfully");
                }
                return BadRequest("recored not found");
            }
            return BadRequest("invalid id");
        }
        [Route("{id}")]
        public async Task<Object> Edit(int id = 0)
        {
            if (id != 0)
            {
                Teacher recored = await Task.Run(() => authDb.Teachers.Where(a => a.ID == id).FirstOrDefault());
                if (recored != null)
                {
                    return Ok(recored);
                }
                return BadRequest("recored not found");
            }
            return BadRequest("invalid id");
        }
    }
}