using AuthAPI.Models;
using AuthAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Numerics;
using System.Threading.Tasks;

namespace AuthAPI.Controllers
{
    [ApiController]
    [Route("api/membershipplans")]
    public class MembershipsPlansController : ControllerBase
    {
        private readonly DataContext _context;

        public MembershipsPlansController(DataContext context)
        {
            _context = context;
        }

        // GET: api/membershipplans/get
        [HttpGet("get")]
        public async Task<IActionResult> GetMembershipPlans()
        {
            var membershipPlans = await _context.Plans.ToListAsync();

            if (membershipPlans == null || membershipPlans.Count == 0)
            {
                return NotFound("No membership plans found.");
            }

            return Ok(membershipPlans);
        }

        // GET: api/membershipplans/get/{id}
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetMembershipPlanById(int id)
        {
            var plan = await _context.Plans.FindAsync(id);
            if (plan == null)
                return NotFound("Membership plan not found.");

            return Ok(plan);
        }

        [HttpPost("create")]
        public async Task<IActionResult> AddMembershipPlan([FromBody] MembershipPlanDTO planDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var plan = new MembershipPlans
            {
                Name = planDto.Name,
                Description = planDto.Description,
                Price = planDto.Price,
                Access = planDto.Access,
                HasInstructor = planDto.HasInstructor
            };

            _context.Plans.Add(plan); 
            await _context.SaveChangesAsync();

            return Ok(plan);
        }
        // PUT: api/membershipplans/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateMembershipPlan(int id, [FromBody] MembershipPlanDTO planDto)
        {
            var existing = await _context.Plans.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = planDto.Name;
            existing.Description = planDto.Description;
            existing.Price = planDto.Price;
            existing.Access = planDto.Access;
            existing.HasInstructor = planDto.HasInstructor;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/membershipplans/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteMembershipPlan(int id)
        {
            var plan = await _context.Plans.FindAsync(id);
            if (plan == null)
                return NotFound("Plan not found.");

            _context.Plans.Remove(plan);
            await _context.SaveChangesAsync();
            return Ok($"Plan with ID {id} deleted.");
        }
    }
}
