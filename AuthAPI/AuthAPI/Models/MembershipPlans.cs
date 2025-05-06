using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace AuthAPI.Models
{
	public class MembershipPlans
	{
		[Key]
		public int MembershipId { get; set; }
		public string Name {  get; set; }
		public string Description { get; set; }
		public int Price { get; set; }
		public string Access {  get; set; }
		public bool HasInstructor { get; set; }
	}
}

