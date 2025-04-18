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
    public async Task<IActionResult> GetUserDetails(int id)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.User_Id == id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            // Fetch Membership Details
            var membership = await _context.Memberships
                .FirstOrDefaultAsync(m => m.Membership_Id == user.Membership_Id);

            // Fetch Instructor Details
            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.Instructor_Id == user.Instructor_Id);

            var userDetails = new
            {
                UserId = user.User_Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Phone = user.Phone,
                Photo = user.Photo,
                JoinDate= user.JoinDate,
                Membership = membership != null ? new
                {
                    MembershipType = membership.Membership_Type,
                    Price = membership.Price,
                    StartDate = membership.StartDate,
                    EndDate = membership.EndDate
                } : null,
                Instructor = instructor != null ? new
                {
                    InstructorName = instructor.Name + " " + instructor.Surname,
                    InstructorEmail = instructor.Email,
                    InstructorPhone = instructor.Phone
                } : null
            };

            return Ok(userDetails);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the user.", error = ex.Message });
        }
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

