using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AuthAPI.Models.DTOs;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly DataContext _context;

    // Constructor
    public UserController(DataContext context)
    {
        _context = context;
    }

    // Endpoint to get user data
    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        // Ensure that we're querying only the Users table
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.User_Id == id); // Adjust the query as needed

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDto updatedUser)
    {
      try{
            var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        // Find Membership by name
     
        //if (membership == null)
          //  return BadRequest("Invalid membership type");

        // Update fields
        user.Name = updatedUser.Name;
        user.Surname = updatedUser.Surname;
        user.Email = updatedUser.Email;
        user.Phone = updatedUser.Phone;
        user.Photo = updatedUser.Photo;
       // user.Membership_Id = membership.Membership_Id;

        await _context.SaveChangesAsync();
        return NoContent();
    }catch (Exception ex)
    {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
}

