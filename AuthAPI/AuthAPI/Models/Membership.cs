using System.ComponentModel.DataAnnotations;

namespace AuthAPI.Models
{
    public class Membership
    {
        [Key]
        public int Membership_Id { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public int Price { get; set; }  
        public string Membership_Type { get; set; }
    }
    
}