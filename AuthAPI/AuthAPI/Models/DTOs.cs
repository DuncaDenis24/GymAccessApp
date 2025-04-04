namespace AuthAPI.Models.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AdminCode { get; set; } = string.Empty;
    }
/*
    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
        public string AdminCode { get; set; } = string.Empty;
    }
    */
}