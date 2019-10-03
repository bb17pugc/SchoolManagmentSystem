using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Api.Models;

namespace Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        AuthDb authDb;
        public CourseController(AuthDb db)
        {
            authDb = db;
        }

        [Route("{id}")]
        public async Task<Object> Edit(int id = 0)
        {
            if (id == 0)
            {
                return BadRequest("id is 0");
            }
            var record = await Task.Run(() => authDb.Courses.Where(a => a.ID == id).FirstOrDefault());
            if (record != null)
            {
                return Ok(record);
            }
            return BadRequest("recored not found");

        }
        public async Task<Object> List()
        {
            var List = await Task.Run(() => authDb.Courses.ToList());
            return Ok(List);
        }
        [Route("{id}")]
        public async Task<Object> Delete(int id = 0)
        {
            if (id != 0)
            {
                Course course = await Task.Run(() => authDb.Courses.Where(a => a.ID == id).FirstOrDefault());
                if (course != null)
                {
                    await Task.Run(() => authDb.Remove(course));
                    await authDb.SaveChangesAsync();
                    return Ok("deleted successfully");
                }
                else
                {
                    return BadRequest("data not found");
                }
            }
            return BadRequest("invalid id");
        }
        public async Task<Object> Add(Course course)
        {
            if(ModelState.IsValid)
            {
                Course newrecord = new Course
                {
                    ID = course.ID,
                    Name = course.Name,
                    Class = course.Class
                };

                if (newrecord.ID != 0)
                {
                    authDb.Entry(newrecord).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                }
                else
                {
                    var checkrecored = await Task.Run(() => authDb.Courses.Where(a => a.Name == course.Name && a.Class == course.Class).FirstOrDefault());
                    if (checkrecored != null)
                    {
                        return BadRequest("recored of subject " + course.Name + " in class " + course.Class + " is already added");
                    }
                    await Task.Run(()=> authDb.AddAsync(newrecord));
                }
                await authDb.SaveChangesAsync();
                return Ok("recored saved successfully");
            }
            return BadRequest(ModelState);
        }
    }
}