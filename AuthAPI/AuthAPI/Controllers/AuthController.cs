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
    private const string InstructorSecretCode = "1234"; // Înlocuiește cu ceva mai sigur în producție

    public AuthController(DataContext context)
    {
        _context = context;
    }

    // REGISTER INSTRUCTOR
    [HttpPost("register-instructor")]
    public async Task<IActionResult> RegisterInstructor([FromBody] RegisterDto dto)
    {
        if (await _context.Instructors.AnyAsync(i => i.Email == dto.Email))
            return BadRequest(new { message = "Email deja folosit de un instructor." });

        if (dto.InstructorCode != InstructorSecretCode)
            return Unauthorized(new { message = "Cod instructor incorect." });

        using (var hmac = new HMACSHA512())
        {
            var instructor = new Instructor
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = Convert.ToBase64String(hmac.Key) + ":" + Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password))),
                Photo = null
            };

            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Instructor înregistrat cu succes!" });
        }
    }

    // LOGIN INSTRUCTOR
    [HttpPost("login-instructor")]
    public async Task<IActionResult> LoginInstructor([FromBody] LoginDto loginDto)
    {
        var instructor = await _context.Instructors.FirstOrDefaultAsync(i => i.Email == loginDto.Email);
        if (instructor == null)
            return Unauthorized(new { message = "Instructorul nu a fost găsit." });

        if (loginDto.InstructorCode != InstructorSecretCode)
            return Unauthorized(new { message = "Cod instructor incorect." });

        var parts = instructor.Password.Split(':');
        using (var hmac = new HMACSHA512(Convert.FromBase64String(parts[0])))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            if (!computedHash.SequenceEqual(Convert.FromBase64String(parts[1])))
                return Unauthorized(new { message = "Parolă incorectă." });
        }

        return Ok(new
        {
            message = "Autentificare instructor reușită!",
            token = "instructor_jwt_token",
            role = "instructor",
            name = instructor.Name,
            email = instructor.Email,
            photo = instructor.Photo,
            id = instructor.Instructor_Id
        });
    }

    // REGISTER USER
    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            return BadRequest(new { message = "Email deja folosit." });

        using (var hmac = new HMACSHA512())
        {
            var user = new User
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                Phone = registerDto.Phone,
                Password = Convert.ToBase64String(hmac.Key) + ":" + Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password))),
                JoinDate = DateTime.Now,
                Photo = null
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Utilizator înregistrat cu succes!" });
        }
    }

    // LOGIN USER
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        if (user == null)
            return Unauthorized(new { message = "Emailul nu a fost găsit." });

        var parts = user.Password.Split(':');
        using (var hmac = new HMACSHA512(Convert.FromBase64String(parts[0])))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            if (!computedHash.SequenceEqual(Convert.FromBase64String(parts[1])))
                return Unauthorized(new { message = "Parola este incorectă." });
        }

        return Ok(new
        {
            message = "Autentificare utilizator reușită!",
            token = "user_jwt_token",
            role = "user",
            name = user.Name,
            email = user.Email,
            photo = user.Photo,
            id = user.User_Id
        });
    }
}
