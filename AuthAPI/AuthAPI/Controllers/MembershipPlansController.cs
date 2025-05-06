using AuthAPI.Models;
using AuthAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [HttpGet("get")]
        public async Task<IActionResult> GetMembershipPlans()
        {
          var membershipPlans = await _context.Plans.ToListAsync();
                
            if (membershipPlans == null || membershipPlans.Count == 0)
            {
                return NotFound();
            }

            return Ok(membershipPlans);
        }
    }
}