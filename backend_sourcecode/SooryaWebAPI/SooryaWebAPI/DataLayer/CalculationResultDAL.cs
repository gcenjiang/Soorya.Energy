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
    public class CalculationResultDAL
    {
        private IDbConnection conn = null;

        public CalculationResultDAL(string connectionString)
        {
            conn = new SqlConnection(connectionString);
        }

        public List<CalculationResult> GetCalculationResult(string startDate, string endDate, string address)
        {
            try
            {
                conn.Open();

                var param = new DynamicParameters();
                param.Add("@StartDate", startDate, DbType.String);
                param.Add("@EndDate", endDate, DbType.String);
                if (address == null) address = "";
                param.Add("@Address", address, DbType.String);

                List<CalculationResult> list = conn.Query<CalculationResult>("usp_CalculationResultGet", param, commandType: CommandType.StoredProcedure).AsList<CalculationResult>();

                conn.Close();
                conn.Dispose();

                return list;

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

        public void InsertCalculationResult(CalculationResult obj)
        {
            try
            {
                conn.Open();

                var param = new DynamicParameters();
                
                param.Add("@Name", obj.Name, DbType.String);
                param.Add("@Email", obj.Email, DbType.String);
                param.Add("@Phone", obj.Phone, DbType.String);
                param.Add("@BuildingType", obj.BuildingType, DbType.String);
                param.Add("@MonthlyElectricityBill", obj.MonthlyElectricityBill, DbType.Decimal);
                param.Add("@Power", obj.Power, DbType.Decimal);
                param.Add("@Address", obj.Address, DbType.String);
                param.Add("@FormattedAddress", obj.Formatted, DbType.String);
                param.Add("@Notes", obj.Notes, DbType.String);
                param.Add("@ZipCode", obj.ZipCode, DbType.String);
                param.Add("@City", obj.City, DbType.String);
                param.Add("@Latitude", obj.Latitude, DbType.String);
                param.Add("@Longitude", obj.Longitude, DbType.String);
                param.Add("@RoofPitch", obj.RoofPitch, DbType.Int32);
                param.Add("@RoofOrientationValue", obj.RoofOrientationValue, DbType.Int32);
                param.Add("@RoofOrientationText", obj.RoofOrientationText, DbType.String);

                param.Add("@FirstYearSavings", obj.FirstYearSavings, DbType.Decimal);
                param.Add("@AnnualSavings", obj.AnnualSavings, DbType.Decimal);
                param.Add("@PaybackPeriod", obj.PaybackPeriod, DbType.Decimal);
                param.Add("@SolarSystemCost", obj.SolarSystemCost, DbType.Decimal);
                param.Add("@ReturnOnInvestment", obj.ReturnOnInvestment, DbType.Decimal);
                param.Add("@SystemSize", obj.SystemSize, DbType.Decimal);
                param.Add("@MonthlyElectricityUse", obj.MonthlyElectricityUse, DbType.Decimal);
                param.Add("@MonthlySolarProduction", obj.MonthlySolarProduction, DbType.Decimal);
                param.Add("@LifetimeCO2reduction", obj.LifetimeCO2Reduction, DbType.Decimal);
                param.Add("@NumberOfPanels", obj.NumberOfPanels, DbType.Decimal);
                param.Add("@AreaRequired", obj.AreaRequired, DbType.Decimal);
                param.Add("@CostOfSolarPerWatt", obj.CostOfSolarPerWatt, DbType.Decimal);
                param.Add("@LifetimeCostOfElectricity", obj.LifetimeCostOfElectricity, DbType.Decimal);
                param.Add("@LifetimeSavings", obj.LifetimeSavings, DbType.Decimal);

                conn.Execute("usp_CalculationResultInsert", param, commandType: CommandType.StoredProcedure);

                conn.Close();
                conn.Dispose();

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
