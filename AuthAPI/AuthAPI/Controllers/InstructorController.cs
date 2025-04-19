using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using AuthAPI.Models.DTOs;

[Route("api/instructors")]
[ApiController]
public class InstructorController : ControllerBase
{
    private readonly DataContext _context;

    // Constructor
    public InstructorController(DataContext context)
    {
        _context = context;
    }

    // Endpoint to get instructor data
    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetInstructor(int id)
    {
        var instructor = await _context.Instructors
            .FirstOrDefaultAsync(i => i.Instructor_Id == id);

        if (instructor == null)
        {
            return NotFound();
        }

        return Ok(instructor);
    }
    [HttpGet("get/instructors")]
    public async Task<IActionResult> GetInstructors()
    {
        var instructors = await _context.Instructors.ToListAsync();

        if (instructors == null || instructors.Count == 0)
        {
            return NotFound();
        }

        return Ok(instructors);
    }

    // Endpoint to get instructor's clients
    [HttpGet("get/{id}/clients")]
    public async Task<IActionResult> GetInstructorClients(int id)
    {
        try
        {
            var clients = await _context.Users
                .Include(u => u.Membership)
                .Where(u => u.Instructor_Id == id)
                .Select(u => new
                {
                    UserId = u.User_Id,
                    Name = u.Name,
                    Surname = u.Surname,
                    Email = u.Email,
                    Phone = u.Phone,
                    Photo = u.Photo,
                    Membership = u.Membership != null ? new
                    {
                        Type = u.Membership.Membership_Type,
                        Price = u.Membership.Price,
                        StartDate = u.Membership.StartDate,
                        EndDate = u.Membership.EndDate
                    } : null
                })
                .ToListAsync();

            return Ok(clients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the clients.", error = ex.Message });
        }
    }


    [HttpGet("get/{id}/clients/count")]
    public async Task<IActionResult> GetInstructorClientsNumber(int id)
    {
        var clientCount = await _context.Users
            .Where(u => u.Instructor_Id == id)
            .CountAsync(); // Count the clients instead of returning the full list

        return Ok(new { clientCount });
    }

    // Endpoint to update instructor data
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateInstructor(int id, [FromBody] InstructorDto updatedInstructor)
    {
        try
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null)
            {
                return NotFound();
            }

            instructor.Name = updatedInstructor.Name;
            instructor.Surname = updatedInstructor.Surname;
            instructor.Email = updatedInstructor.Email;
            instructor.Phone = updatedInstructor.Phone;
            instructor.Photo = updatedInstructor.Photo;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteInstructor(int id)
    {
        var instructor = await _context.Instructors.FindAsync(id);

        if (instructor == null)
            return NotFound(new { message = "Instructor not found." });

        _context.Instructors.Remove(instructor);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Instructor deleted successfully." });
    }
}
