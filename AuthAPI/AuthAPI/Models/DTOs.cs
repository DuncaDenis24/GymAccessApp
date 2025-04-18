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
   }

    public class InstructorDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Photo { get; set; } // URL or path to profile picture
    }
    public class UserWithDetailsDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Photo { get; set; }

        public string MembershipType { get; set; } // For Membership
        public string InstructorPhone { get; set; }

        public string InstructorName { get; set; } // For Instructor
        public string InstructorEmail { get; set; }
    }

    public class CreateMembershipDto
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Price { get; set; }
        public string MembershipType { get; set; }

        public int UserId { get; set; }
        public int InstructorId { get; set; }
    }
    public class MembershipRequest
    {
        public string MembershipType { get; set; }
        public int Price { get; set; }
        public int Duration { get; set; }  // Duration in months
        public int? InstructorId { get; set; }  // Optional Instructor Id
    }
}