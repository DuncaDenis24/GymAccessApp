using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AuthAPI.Models.DTOs;

[Route("api/auth")]
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
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return BadRequest(new { message = "User not found. Please check your email." });
            }

            bool isPasswordValid;
            try
            {
                var parts = user.Password.Split(':');
                var storedHash = Convert.FromBase64String(parts[1]);
                using (var hmac = new HMACSHA512(Convert.FromBase64String(parts[0])))
                {
                    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
                    if (!computedHash.SequenceEqual(storedHash)) return Unauthorized("Invalid password");
                }
                isPasswordValid = true;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Password verification error", error = ex.Message });
            }

            if (!isPasswordValid)
            {
                return BadRequest(new { message = "Invalid password. Please try again." });
            }
           

            return Ok(new { message = "Login successful!", token = "your_generated_jwt_token" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
        }
    }
}
  
/*
using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AuthAPI.Models.DTOs;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly DataContext _context;
    private const string AdminSecretCode = "SECRET_ADMIN_CODE"; // Replace with actual secure method

    public AuthController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            // Admin validation
            if (registerDto.IsAdmin && registerDto.AdminCode != AdminSecretCode)
            {
                return Unauthorized(new { message = "Invalid admin code" });
            }

            using (var hmac = new HMACSHA512())
            {
                var user = new User
                {
                    Name = registerDto.Name,
                    Surname = registerDto.Surname,
                    Email = registerDto.Email,
                    Phone = registerDto.Phone,
                    Password = Convert.ToBase64String(hmac.Key) + ":" + Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password))),
                    IsAdmin = registerDto.IsAdmin
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "User created successfully" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found. Please check your email." });
            }

            var parts = user.Password.Split(':');
            var storedHash = Convert.FromBase64String(parts[1]);
            using (var hmac = new HMACSHA512(Convert.FromBase64String(parts[0])))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
                if (!computedHash.SequenceEqual(storedHash)) return Unauthorized(new { message = "Invalid password." });
            }

            // Ensure admin login requires the admin code
            if (user.IsAdmin && loginDto.AdminCode != AdminSecretCode)
            {
                return Unauthorized(new { message = "Invalid admin code" });
            }

            return Ok(new { message = "Login successful!", token = "your_generated_jwt_token", isAdmin = user.IsAdmin });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
        }
    }
}

*/



