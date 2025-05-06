using AuthAPI.Models;
using AuthAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AuthAPI.Controllers
{
    [ApiController]
    [Route("api/memberships")]
    public class MembershipsController : ControllerBase
    {
        private readonly DataContext _context;

        public MembershipsController(DataContext context)
        {
            _context = context;
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetMembershipByUserId(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.User_Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }
            bool hasMembership = user.Membership_Id != null;

            return Ok(new { hasMembership });
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateMembership([FromBody] CreateMembershipDto dto)
        {
            var membership = new Membership
            {
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Price = dto.Price,
                Membership_Type = dto.MembershipType
            };

            _context.Memberships.Add(membership);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound("User not found");

            user.Membership_Id = membership.Membership_Id;

            user.Instructor_Id = dto.InstructorId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Membership created and user updated", membershipId = membership.Membership_Id });
        }

        [HttpPut("cancel/{userId}")]
        public async Task<IActionResult> CancelMembership( int userId)
        {
            var user = await _context.Users
                .Include(u => u.Membership)
                .FirstOrDefaultAsync(u => u.User_Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Membership_Id == null)
            {
                return BadRequest("User doesn't have an active membership.");
            }

            var membership = await _context.Memberships
                .FirstOrDefaultAsync(m => m.Membership_Id == user.Membership_Id);
            _context.Memberships.Remove(membership);

            user.Membership_Id = null;
            user.Instructor_Id = null;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Membership canceled successfully.");
        }

    }

}