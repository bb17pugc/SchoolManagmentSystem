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
              var Teachers = authDb.PeriodDetail.GroupBy(a => a.Teacher).Select(b => new { teacher = b.Key, periods = b.Count() });
              var NotFreeTeachers = Teachers.Where(a => a.periods > 9);
              var List = await Task.Run(() => authDb.PeriodDetail.Include(a=>  a.Course).Include(a => a.Teacher).Include(a => a.Classes));
              return Ok( new { list = List.ToList() , notfree = NotFreeTeachers} );
     
        }
        public async Task<Object> Add(PeriodRecored recored)
        {
            if(ModelState.IsValid)
            {
                PeriodDetail model = new PeriodDetail
                {
                    ID = recored.ID,
                    Course = authDb.Courses.Where(a => a.ID == recored.Course).FirstOrDefault(),
                    Teacher = authDb.Teachers.Where(a => a.ID == recored.Teacher).FirstOrDefault(),
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
                return Ok();
            } 
            return BadRequest("data is not valid");
        }
    }
}