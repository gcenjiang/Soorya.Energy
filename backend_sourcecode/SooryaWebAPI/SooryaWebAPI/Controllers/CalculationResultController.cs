using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SooryaWebAPI.DataLayer;
using SooryaWebAPI.Models;
using System.Collections.Generic;

namespace SooryaWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/CalculationResult")]
    public class CalculationResultController : Controller
    {
        DBConnection _db;
        public CalculationResultController(IOptions<DBConnection> dbAccessor) => _db = dbAccessor.Value;

        // GET: api/CalculationResult
        [HttpGet]
        public IEnumerable<CalculationResult> Get([FromQuery]string startDate, [FromQuery]string endDate, [FromQuery]string address = null)
        {
            CalculationResultDAL dal = new CalculationResultDAL(_db.ConnectionString);
            List<CalculationResult> list = dal.GetCalculationResult(startDate, endDate, address);
            return list;
        }
    }
}
