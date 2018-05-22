using Dapper;
using Microsoft.AspNetCore.Http;
using SooryaWebAPI.Middleware;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace SooryaWebAPI.DataLayer
{
    public class UtilitiesDAL
    {
        private IDbConnection conn = null;

        public UtilitiesDAL(string connectionString)
        {
            conn = new SqlConnection(connectionString);
        }

        public decimal GetElectricityRate(string buildingType)
        {
            try
            {
                conn.Open();

                var param = new DynamicParameters();

                param.Add("@BuildingType", buildingType, DbType.String);

                decimal electricityRate = conn.Query<decimal>("SELECT ElectricityRate FROM TblElectricityRate WHERE BuildingType = @BuildingType", param, commandType: CommandType.Text).FirstOrDefault();

                conn.Close();
                conn.Dispose();

                return electricityRate;
            }
            catch (Exception ex)
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }

                throw ex;
            }
        }

        public decimal GetPVOutput(string city)
        {
            try
            {
                conn.Open();

                var param = new DynamicParameters();

                param.Add("@City", city, DbType.String);

                decimal pvOutput = conn.Query<decimal>("SELECT PVOutputDaily FROM TblPVOutput WHERE City = @City", param, commandType: CommandType.Text).FirstOrDefault();

                conn.Close();
                conn.Dispose();

                return pvOutput;
            }
            catch (Exception ex)
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }

                throw ex;
            }
        }
    }
}
