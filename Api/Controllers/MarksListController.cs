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
    public class MarksListController : ControllerBase
    {
        AuthDb authDb;
        public MarksListController(AuthDb db)
        {
            authDb = db;
        }
        public async Task<Object> List()
        {
            var list = await Task.Run(() => authDb.Markslists.Include(a => a.Classes).Include(a => a.Course).Include(a => a.Students).ToList());
            return Ok(list); 
        }
        public async Task<Object> Add(MarksList model)
        {
            if (ModelState.IsValid)
            {
                MarkslistData markslistData = new MarkslistData
                {
                    ID = model.ID,
                    Classes = authDb.Classes.Where(a => a.ID == model.Class).FirstOrDefault(),
                    Course = authDb.Courses.Where(a => a.ID == model.Subject).FirstOrDefault(),
                    Students = authDb.Students.Where(a => a.ID == model.Student).FirstOrDefault(),
                    Marks = model.Marks,
                    Total = model.Total
                };
                if(markslistData.ID != 0)
                {
                    authDb.Entry(markslistData).State = EntityState.Modified;
                }
                else
                {
                    await authDb.AddAsync(markslistData);
                }
                await authDb.SaveChangesAsync();
                return Ok("Added successfully");
            }
            return BadRequest("Error");

        }
        [Route("{id}")]
        public async Task<Object> Edit(int ? id)
        {
            if(id == 0)
            {
                return BadRequest("No data found");
            }
            MarkslistData data =  authDb.Markslists.Include(w => w.Classes).Include(c => c.Course).Include(s => s.Students).SingleOrDefault(a => a.ID == id);            
            return Ok(data);
        }
        [Route("{id}")]
        public async Task<Object> Delete(int id)
        {
            if(id == 0)
            {
                return BadRequest("invalid student id");
            }
             var data = await authDb.Markslists.FindAsync(id);
            if(data == null)
            {
                return BadRequest("Data not found");
            }
            authDb.Markslists.Remove(data);
            await authDb.SaveChangesAsync();
            return Ok("Data deleted successfully");

        }
    }
}