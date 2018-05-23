using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;
using SooryaWebAPI.Models;

namespace SooryaWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Contact")]
    public class ContactController : Controller
    {
        // POST: api/Contact
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Email email)
        {
            if (email == null)
            {
                return BadRequest();
            }

            //Using SendGrid to send an Email
            await SendEmail(email);

            return Ok();
        }

        private async Task SendEmail(Email email)
        {
            var apiKey = "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";
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(email.EmailAddress, email.Name);
            var subject = email.Subject;
            var to = new EmailAddress("info@soorya.energy", "Soorya Energy");
            var plainTextContent = email.Message;
            var htmlContent = email.Message;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
