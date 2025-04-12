namespace AuthAPI.Models.DTOs { 
public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string? InstructorCode { get; set; }
}

public class RegisterDto
        {
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Password { get; set; }
            public string? InstructorCode { get; set; } 
        }
        public class UserDto
        {
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Photo { get; set; }
            public string MembershipType { get; set; } // e.g. "Basic"
        }
}