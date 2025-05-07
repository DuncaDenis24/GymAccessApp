using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthAPI.Models;
using AuthAPI.Models.DTOs;

[ApiController]
[Route("api/facilities")]
public class FacilitiesController : ControllerBase
{
    private readonly DataContext _context;

    public FacilitiesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("get")]
    public async Task<IActionResult> GetFacilities()
    {
        var facilities = await _context.Facilities.ToListAsync();
        return Ok(facilities);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddFacility([FromBody] FacilityDto dto)
    {
        var facility = new Facility
        {
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl
        };

        _context.Facilities.Add(facility);
        await _context.SaveChangesAsync();
        return Ok(facility);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateFacility(int id, [FromBody] FacilityDto dto)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null)
            return NotFound("Facility not found");

        facility.Title = dto.Title;
        facility.Description = dto.Description;
        facility.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();
        return Ok(facility);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteFacility(int id)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null)
            return NotFound("Facility not found");

        _context.Facilities.Remove(facility);
        await _context.SaveChangesAsync();
        return Ok("Facility deleted");
    }
}
