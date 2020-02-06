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
    public class DateSheetController : ControllerBase
    {
        private readonly AuthDb authDb;
        //Creating constructer
        public DateSheetController(AuthDb db)
        {
            authDb = db;
        }
        //method to get the list of datesheet
        public async Task<object> List()
        {
            var List = await Task.Run( () => authDb.DateSheetInitial.ToList());
            return Ok(List);
        }
        [Route("{id}")]
        public async Task<Object> GetDateSheet(int id)
        {
            return await Task.Run(()=>authDb.DateSheetInitial.Where(a=>a.ID == id).FirstOrDefault());
        }
        public async Task<Object> Add(InitData model)
        {
            if (ModelState.IsValid)
            {
                var check = authDb.DateSheetInitial.Where(a => a.Start == model.Start && a.End == model.End).FirstOrDefault();
                if (check != null)
                {
                    return BadRequest("datesheet is already created ");
                }
                await authDb.DateSheetInitial.AddAsync(model);
                await authDb.SaveChangesAsync();
                return Ok(authDb.DateSheetInitial.Where(a => a.Start == model.Start && a.End == model.End).Select(a =>a.ID));
            }
            return BadRequest(ModelState);
        }
        //creating method to add data coming from angular project through url
        public async Task<Object> AddDetail(DateSheetViewModel dateSheet)
        {
            if(ModelState.IsValid)
            {
                DateSheet model = new DateSheet
                {
                    ID = dateSheet.ID,
                    Class = authDb.Classes.Where(a => a.ID == dateSheet.Class).FirstOrDefault(),
                    Subject = authDb.Courses.Where(a => a.ID == dateSheet.Subject).FirstOrDefault(),
                    Teacher = authDb.Teachers.Where(a => a.ID == dateSheet.Teacher).FirstOrDefault(),
                    Date = dateSheet.Date,
                    StartDate = dateSheet.StartDate,
                    EndDate = dateSheet.EndDate,
                    DateSheetName = dateSheet.DateSheetName,
                };
                if(authDb.DateSheet.Any(a => a.Class == model.Class && a.Date == model.Date))
                {
                    await Task.Run(() => authDb.RemoveRange(authDb.DateSheet.Where(a => a.Class == model.Class && a.Date == model.Date).ToList()));
                    await authDb.SaveChangesAsync(); 
                }

                    await Task.Run(() => authDb.AddAsync(model));
                await authDb.SaveChangesAsync();
                return Ok("success");
            }
            return BadRequest(ModelState);
        }
        //get datesheet by name for edit 
        [Route("{name}")]
        public async Task<object> Edit(string name)
        {
            return Ok(await Task.Run(() => authDb.DateSheet.Where(a => a.DateSheetName == name).Include(a => a.Class).Include(a => a.Subject).Include(a => a.Teacher).ToList()));
        }
        [Route("{id}")]
        public async Task<Object> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest("invalid id");
            }
            var recored = authDb.DateSheetInitial.Where(a => a.ID == id).FirstOrDefault();
            if (recored != null)
            {
                authDb.Remove(recored);
                await authDb.SaveChangesAsync();
                return Ok("deleted successfully");
            }
            return BadRequest("no recored found");
        }
    }
}