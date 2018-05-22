using Dapper;
using System.Data.SqlClient;
using SooryaWebAPI.Models;
using System;
using System.Data;
using System.Collections.Generic;
using SooryaWebAPI.Middleware;
using Microsoft.AspNetCore.Http;

namespace SooryaWebAPI.DataLayer
{
    public class AccountDAL
    {
        private IDbConnection conn = null;

        public AccountDAL(string connectionString)
        {
            conn = new SqlConnection(connectionString);
        }

        public bool Login(UserCredential credential)
        {
            try
            {
                conn.Open();

                var param = new DynamicParameters();
                param.Add("@UserID", credential.UserID, DbType.String);
                param.Add("@Password", credential.Password, DbType.String);
                param.Add("@LoginStatus", dbType: DbType.Boolean, direction: ParameterDirection.Output);

                List<CalculationResult> list = conn.Query<CalculationResult>("usp_Login", param, commandType: CommandType.StoredProcedure).AsList<CalculationResult>();

                conn.Close();
                conn.Dispose();

                return param.Get<bool>("LoginStatus");
            }
            catch (Exception ex)
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }

                throw new HttpStatusCodeException(StatusCodes.Status400BadRequest, ex.Message);
            }
        }
    }
}
