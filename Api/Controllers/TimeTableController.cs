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
    public class TimeTableController : ControllerBase
    {
        AuthDb authDb = new AuthDb();
        public TimeTableController(AuthDb db)
        {
            authDb = db;
        }
        public async Task<Object> List()
        {
            var List = await Task.Run(() => authDb.PeriodDetail.Include(a=>  a.Course).Include(a => a.Teacher).Include(a => a.Classes));
            return Ok(List.ToList());
        }
        public async Task<Object> Add(PeriodRecored recored)
        {
            if(ModelState.IsValid)
            {
                PeriodDetail model = new PeriodDetail
                {
                    ID = recored.ID,
                    Course = authDb.Courses.Where(a => a.Name == recored.Course).FirstOrDefault(),
                    Teacher = authDb.Teachers.Where(a => a.Name == recored.Teacher).FirstOrDefault(),
                    Classes= authDb.Classes.Where(a => a.Name == recored.Classes && a.Section == recored.Section).FirstOrDefault(),
                    Period = recored.Period,
                };
                if (model.ID != 0)
                {
                    await Task.Run(() => authDb.Entry(model).State = EntityState.Modified);
                }
                else
                {
                    await Task.Run(() => authDb.AddAsync(model));
                }
                await authDb.SaveChangesAsync();
            } 
             await authDb.SaveChangesAsync();
            return Ok("added");
        }
    }
}