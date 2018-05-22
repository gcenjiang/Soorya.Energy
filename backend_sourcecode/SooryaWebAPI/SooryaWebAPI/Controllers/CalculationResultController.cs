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

        // GET: api/CalculationResult/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/CalculationResult
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }
        
        // PUT: api/CalculationResult/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
