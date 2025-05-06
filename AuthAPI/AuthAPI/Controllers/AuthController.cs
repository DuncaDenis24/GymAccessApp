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
    private const string InstructorSecretCode = "1234"; 
    private const string AdminSecretCode= "admin";
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

        if (dto.InstructorCode != InstructorSecretCode && dto.InstructorCode != AdminSecretCode)
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
                Photo = "data:image/jpeg;base64,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"
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

        if (loginDto.InstructorCode != InstructorSecretCode && loginDto.InstructorCode != AdminSecretCode)
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
            role = loginDto.InstructorCode==InstructorSecretCode ? "instructor": "admin",
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
                Photo = "data:image/jpeg;base64,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"
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
