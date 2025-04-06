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
    private const string AdminSecretCode = "1234"; // Replace with actual secure method

    public AuthController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("register-admin")]
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
                    IsAdmin = true
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

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
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
                    IsAdmin = false // utilizator obișnuit
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "User created successfully" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error: " + ex.Message });
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
                return BadRequest(new { message = "Emailul nu a fost găsit." });
            }

            var parts = user.Password.Split(':');
            var storedHash = Convert.FromBase64String(parts[1]);
            using (var hmac = new HMACSHA512(Convert.FromBase64String(parts[0])))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
                if (!computedHash.SequenceEqual(storedHash))
                {
                    return Unauthorized(new { message = "Parola este incorectă." });
                }
            }

            // Dacă userul nu este admin, dar încearcă să se logheze ca admin
            if (!user.IsAdmin && loginDto.IsAdmin == true)
            {
                return Unauthorized(new { message = "Acest utilizator nu este administrator." });
            }

            // Dacă e admin, dar codul e greșit
            if (user.IsAdmin && loginDto.IsAdmin == true && loginDto.AdminCode != AdminSecretCode)
            {
                return Unauthorized(new { message = "Codul de administrator este incorect." });
            }

            return Ok(new
            {
                message = "Autentificare reușită!",
                token = "your_generated_jwt_token", // You should generate a real JWT token here
                isAdmin = user.IsAdmin
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "A apărut o eroare neașteptată.", error = ex.Message });
        }
    }

}




