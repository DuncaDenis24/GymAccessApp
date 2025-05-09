﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthAPI.Models
{
    public class User
    {
        [Key]
        public int User_Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string? Photo { get; set; }
        public DateTime JoinDate { get; set; }
        [ForeignKey("Membership")]
        public int? Membership_Id { get; set; }
        public Membership? Membership { get; set; }

        [ForeignKey("Instructor")]
        public int? Instructor_Id { get; set; }
        public Instructor? Instructor { get; set; }

    }
}
