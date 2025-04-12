using System.ComponentModel.DataAnnotations;

namespace AuthAPI.Models
{
    public class Instructor
    {
        [Key]
        public int Instructor_Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Photo { get; set; }
        
    }
}