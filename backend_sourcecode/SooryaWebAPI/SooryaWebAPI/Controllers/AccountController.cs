using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using SooryaWebAPI.DataLayer;
using SooryaWebAPI.Models;

namespace SooryaWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    public class AccountController : Controller
    {
        DBConnection _db;
        public AccountController(IOptions<DBConnection> dbAccessor) => _db = dbAccessor.Value;

        // GET: api/Account
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET: api/Account/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        [HttpPost("Login")]
        public string Login([FromBody] UserCredential credential)
        {
            AccountDAL dal = new AccountDAL(_db.ConnectionString);
            //Tuple<string, bool> result = dal.Login(credential);
            bool success = dal.Login(credential);

            var response = new HttpResponseMessage(HttpStatusCode.OK);
            dynamic json = new JObject();

            if (success)
            {
                //var provider = new TokenServices();
                //var token = provider.GenerateToken(userID);
                //response.Headers.Add("Token", token);
                //response.Headers.Add("TokenExpiry", ConfigurationManager.AppSettings["AuthTokenExpiry"]);
                //response.Headers.Add("Access-Control-Expose-Headers", "Token,TokenExpiry");

                //json.Token = token;
                //json.UserName = result.Item1;
                json.LoginStatus = 1;
                response.Content = new StringContent(json.ToString());
                return "1";
            }
            else
            {
                //json.Token = "";
                //json.UserName = "";
                json.LoginStatus = 0;
                response.Content = new StringContent(json.ToString());
                return "0";
            }
        }

        // POST: api/Account
        //[HttpPost]
        //public void Post([FromBody]string value)
        //{
        //}
        
        // PUT: api/Account/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}
        
        // DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
