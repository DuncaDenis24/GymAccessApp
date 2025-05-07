using System.ComponentModel.DataAnnotations;

namespace AuthAPI.Models
{
    public class Facility
    {
        [Key]
        public int FacilityId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; } // Store image path or URL
    }

}