using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using SooryaWebAPI.DataLayer;
using SooryaWebAPI.Models;
using System.Threading.Tasks;

namespace SooryaWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Contact")]
    public class ContactController : Controller
    {
        DBConnection _db;
        public ContactController(IOptions<DBConnection> dbAccessor) => _db = dbAccessor.Value;

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
            UtilitiesDAL dal = new UtilitiesDAL(_db.ConnectionString);
            var apiKey = dal.GetSendGridAPIKey();
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
