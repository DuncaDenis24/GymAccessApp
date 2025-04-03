using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly DataContext _context;

    public AuthController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        try
        {
            // Check if the username already exists
            if (await _context.Users.AnyAsync(u => u.Name == user.Name))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Hash the password
            using (var hmac = new HMACSHA512())
            {
                user.Password = Convert.ToBase64String(hmac.Key) + ":" + Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(user.Password)));
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User  created successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error: " + ex.Message });
        }
    }
    // Login
    [HttpPost("login")]
    public async Task<IActionResult> Login(string email, string password)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user == null) return Unauthorized("Invalid credentials");

        var parts = user.Password.Split(':');
        var storedHash = Convert.FromBase64String(parts[1]);
        using (var hmac = new HMACSHA512(Convert.FromBase64String(parts[0])))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            if (!computedHash.SequenceEqual(storedHash)) return Unauthorized("Invalid credentials");
        }

        return Ok("Login successful");
    }
}