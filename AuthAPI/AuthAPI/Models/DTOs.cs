namespace AuthAPI.Models.DTOs { 
public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string? AdminCode { get; set; }
    public bool IsAdmin { get; set; }
}

public class RegisterDto
        {
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Password { get; set; }
            public bool IsAdmin { get; set; } // trebuie să existe
            public string? AdminCode { get; set; } // poate fi null
        }
    }