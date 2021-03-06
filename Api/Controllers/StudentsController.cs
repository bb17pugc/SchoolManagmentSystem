﻿using System;
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
    public class StudentsController : ControllerBase
    {
        AuthDb authDb;
        public StudentsController(AuthDb auth)
        {
            authDb = auth;
        }
        public async Task<object> List()
        {
            var list = await Task.Run(() => authDb.Students.Include(a => a.Class).ToList());           
            return Ok(list);
        }
        public async Task<object> Add(StudentModel model)
        {
            Students NewStudent = new Students();
            NewStudent.ID = model.ID;
            NewStudent.Name = model.Name;
            NewStudent.Father = model.Father;
            NewStudent.Class = authDb.Classes.Where(a => a.ID == model.ClassId).FirstOrDefault();
            NewStudent.DateOfBirth = model.DateOfBirth;
            if (NewStudent.ID != 0)
            {
                authDb.Entry(NewStudent).State = EntityState.Modified;
            }
            else
            {
                await Task.Run(() => authDb.AddAsync(NewStudent));
            }
            await authDb.SaveChangesAsync();
            return Ok();
        }
        [Route("{id}")]
        public async Task<object> Edit( int ? id)
        {
             var student =  await authDb.Students.FindAsync(id);
            return Ok(student);
        }
        [Route("{id}")]
        public async Task<object> Delete(int? id)
        {
            if (id != 0)
            {
                var student = await authDb.Students.FindAsync(id);
                if (student != null)
                {
                    authDb.Remove(student);
                    await authDb.SaveChangesAsync();
                    return Ok("Deleted successfully");
                }
                else
                {
                    BadRequest("No recored found");
                }
            }
             return BadRequest("invalid id");
        }
    }
}