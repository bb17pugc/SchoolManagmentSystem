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
    public class AddController : ControllerBase
    {
        private readonly AuthDb db;
        public AddController(AuthDb authDb)
        {
            db = authDb;
        }

        public async Task<Object> GetClasses()
        {
            var List = await Task.Run(() => db.Classes.ToList());
            return Ok(List);
        }

        public async Task<Object> AddClass(Classes model)

        {
            if (ModelState.IsValid)
            {
                var newclass = new Classes()
                {
                    ID = model.ID, 
                    Name = model.Name,
                    Fee = model.Fee,
                    Section = model.Section
                };
           
                if (model.ID != 0)
                {
                    db.Entry(newclass).State = EntityState.Modified;
                }
                else
                {
                    Classes record = await Task.Run(() => db.Classes.Where(a => a.Name == model.Name && a.Section == model.Section).FirstOrDefault());
                    if (record != null)
                    {
                        return BadRequest("class is added already!");
                    }
                    await Task.Run(() => db.Classes.AddAsync(newclass));
                }
                await db.SaveChangesAsync();
                return Ok();

            }
            return BadRequest();
        }
        [HttpGet]
        [Route("{id}")]
        public async Task<Object> EditClass(int id)
        {
            if (id != 0)
            {
                Classes classfound = await Task.Run(() => db.Classes.Where(a => a.ID == id).FirstOrDefault());
                if (classfound != null)
                {
                    return Ok(new {record = classfound });
                }
                else
                {
                    return BadRequest("No Record found");
                }  
            }
            return BadRequest("Null id of record");
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<Object> Delete(int id)
        {
           if(id == 0)
           {
                return BadRequest("invalid id");
           }
            var record = await Task.Run(() => db.Classes.Where(a => a.ID == id).FirstOrDefault());
            if (record != null)
            {
                try
                {
                    await Task.Run(() => db.Classes.Remove(record));
                    await db.SaveChangesAsync();

                }
                catch (Exception ex)
                {
                }
                return Ok("delete successfully");
            }
            return BadRequest("no record found");
        }
    }
}