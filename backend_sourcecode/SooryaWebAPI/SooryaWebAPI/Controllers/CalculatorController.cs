using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SooryaWebAPI.DataLayer;
using SooryaWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SooryaWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Calculator")]
    public class CalculatorController : Controller
    {
        DBConnection _db;
        public CalculatorController(IOptions<DBConnection> dbAccessor) => _db = dbAccessor.Value;

        List<PowerGeneration> powerList = new List<PowerGeneration>();
        List<Savings> savingList = new List<Savings>();

        private decimal electrictyConsumptionPerMonth;
        private decimal electrictyRate;
        private decimal power;
        private decimal pvOutput;
        private decimal coveragePercentage;
        private decimal systemSize;
        private decimal costOfSystem;
        private decimal LCOE;
        private decimal averageCostperKWp;

        private decimal totalSavings = 0;
        private decimal averageSavings = 0;

        private decimal totalEnergyOutput = 0;
        private decimal averageEnergyOutput = 0;

        // POST: api/Calculator
        [HttpPost]
        public IActionResult Post([FromBody]HouseHold obj)
        {
            // Get From DB
            if (obj == null)
            {
                return BadRequest();
            }

            UtilitiesDAL utilDAL = new UtilitiesDAL(_db.ConnectionString);
            electrictyRate = utilDAL.GetElectricityRate(obj.Building);
            utilDAL = new UtilitiesDAL(_db.ConnectionString);
            pvOutput = utilDAL.GetPVOutput(obj.City);

            electrictyConsumptionPerMonth = Math.Round(obj.Bill / electrictyRate, 2);
            decimal electrictyConsumptionPerDay = Math.Round(electrictyConsumptionPerMonth / 30, 2);
            power = obj.Power;
            coveragePercentage = obj.Coverage / 100;

            decimal co2Reduction = 0.934M;
            averageCostperKWp = 15500000M;
            int yearInvestment = 25;

            CalculateSavings(yearInvestment);

            CalculationResult result = new CalculationResult();

            result.Name = obj.Name;
            result.Phone = obj.Phone;
            result.Email = obj.Email;
            result.BuildingType = obj.Building;
            result.MonthlyElectricityBill = obj.Bill;
            result.Power = obj.Power;
            result.Coverage = obj.Coverage;
            result.Latitude = obj.Latitude;
            result.Longitude = obj.Longitude;
            result.Address = obj.Address;
            result.Formatted = obj.Formatted;
            result.Notes = obj.Notes;
            result.ZipCode = obj.ZipCode;
            result.City = obj.City;
            result.RoofPitch = obj.rpit;
            result.RoofOrientationValue = obj.rori;
            result.RoofOrientationText = obj.rori_text;
            result.FirstYearSavings = savingList[0].SavingsValue;
            result.AnnualSavings = averageSavings;
            if (savingList.Exists(x => x.AccumulatedSavings >= 0))
            {
                result.PaybackPeriod = savingList.FirstOrDefault(x => x.AccumulatedSavings >= 0).Year;
            }
            else
            {
                result.PaybackPeriod = 0;
            }
            result.SolarSystemCost = costOfSystem;
            result.ReturnOnInvestment = Math.Round((totalSavings - costOfSystem) / costOfSystem * 100, 2);
            result.SystemSize = systemSize;
            result.MonthlyElectricityUse = electrictyConsumptionPerMonth;
            result.MonthlySolarProduction = Math.Round(powerList[0].EnergyOutput / 12, 0);
            result.LifetimeCO2Reduction = Math.Round(totalEnergyOutput * co2Reduction, 2);
            result.NumberOfPanels = Math.Round(systemSize / 0.3M, 0);
            result.AreaRequired = Math.Round(result.NumberOfPanels * 1.5M, 0);
            result.CostOfSolarPerWatt = Math.Round(costOfSystem / systemSize / 1000, 2);
            result.LifetimeCostOfElectricity = LCOE;
            result.LifetimeSavings = totalSavings;
            result.ElectricityBillComparison = savingList;

            // Insert to DB
            CalculationResultDAL calcDAL = new CalculationResultDAL(_db.ConnectionString);
            calcDAL.InsertCalculationResult(result);

            return new ObjectResult(result);
        }

        [HttpPost("Recalculate")]
        public IActionResult Recalculate([FromBody]Recalculate obj)
        {
            // Get From DB
            if (obj == null)
            {
                return BadRequest();
            }

            UtilitiesDAL utilDAL = new UtilitiesDAL(_db.ConnectionString);
            electrictyRate = utilDAL.GetElectricityRate(obj.Building);
            utilDAL = new UtilitiesDAL(_db.ConnectionString);
            pvOutput = utilDAL.GetPVOutput(obj.City);

            electrictyConsumptionPerMonth = Math.Round(obj.Bill / electrictyRate, 2);
            decimal electrictyConsumptionPerDay = Math.Round(electrictyConsumptionPerMonth / 30, 2);
            power = obj.Power;
            coveragePercentage = obj.Coverage / 100;

            decimal co2Reduction = 0.934M;
            averageCostperKWp = 15500000M;
            int yearInvestment = 25;

            CalculateSavings(yearInvestment);

            CalculationResult result = new CalculationResult();

            result.BuildingType = obj.Building;
            result.MonthlyElectricityBill = obj.Bill;
            result.Power = obj.Power;
            result.Coverage = obj.Coverage;
            result.City = obj.City;
            result.FirstYearSavings = savingList[0].SavingsValue;
            result.AnnualSavings = averageSavings;
            if (savingList.Exists(x => x.AccumulatedSavings >= 0))
            {
                result.PaybackPeriod = savingList.FirstOrDefault(x => x.AccumulatedSavings >= 0).Year;
            }
            else
            {
                result.PaybackPeriod = 0;
            }
            result.SolarSystemCost = costOfSystem;
            result.ReturnOnInvestment = Math.Round((totalSavings - costOfSystem) / costOfSystem * 100, 2);
            result.SystemSize = systemSize;
            result.MonthlyElectricityUse = electrictyConsumptionPerMonth;
            result.MonthlySolarProduction = Math.Round(powerList[0].EnergyOutput / 12, 0);
            result.LifetimeCO2Reduction = Math.Round(totalEnergyOutput * co2Reduction, 2);
            result.NumberOfPanels = Math.Round(systemSize / 0.3M, 0);
            result.AreaRequired = Math.Round(result.NumberOfPanels * 1.5M, 0);
            result.CostOfSolarPerWatt = Math.Round(costOfSystem / systemSize / 1000, 2);
            result.LifetimeCostOfElectricity = LCOE;
            result.LifetimeSavings = totalSavings;
            result.ElectricityBillComparison = savingList;

            return new ObjectResult(result);
        }

        private void CalculateSavings(int yearInvestment)
        {
            decimal energyConsumedYearly = 0, costOfGridElectricity = 0, yearlyElectricityCostWithoutSolar = 0, yearlyMinimumFromPLN = 0,
                    electricityCanBeCoveredBySolar = 0, yearlyElectricityCostWithSolar = 0, savingsValue = 0, accumulatedSavings = 0;

            energyConsumedYearly = electrictyConsumptionPerMonth * 12;

            for (int i = 1; i <= yearInvestment; i++)
            {
                if (i == 1)
                {
                    costOfGridElectricity = electrictyRate;
                    yearlyElectricityCostWithoutSolar = Math.Round(energyConsumedYearly * costOfGridElectricity, 2);
                    yearlyMinimumFromPLN = Math.Round((power / 1000) * 40 * costOfGridElectricity * 12, 2);
                    electricityCanBeCoveredBySolar = Math.Round((yearlyElectricityCostWithoutSolar - yearlyMinimumFromPLN) / costOfGridElectricity * coveragePercentage, 2);

                    // Calculate System Size, cost of system and LCOE
                    systemSize = Math.Round(electricityCanBeCoveredBySolar / (365 * pvOutput), 0);
                    costOfSystem = averageCostperKWp * systemSize;

                    CalculatePowerGeneration(yearInvestment);

                    LCOE = Math.Round(costOfSystem / totalEnergyOutput, 0);

                    yearlyElectricityCostWithSolar = Math.Round(((energyConsumedYearly - powerList[i - 1].EnergyOutput) * costOfGridElectricity) + (powerList[i - 1].EnergyOutput * LCOE), 2);
                    savingsValue = Math.Round(powerList[i - 1].EnergyOutput * (costOfGridElectricity - LCOE), 0);
                    accumulatedSavings = costOfSystem * -1 + savingsValue;
                }
                else
                {
                    costOfGridElectricity = Math.Round(costOfGridElectricity * 1.03M, 2);
                    yearlyElectricityCostWithoutSolar = Math.Round(energyConsumedYearly * costOfGridElectricity, 2);
                    yearlyMinimumFromPLN = Math.Round((power / 1000) * 40 * costOfGridElectricity * 12, 2);
                    electricityCanBeCoveredBySolar = Math.Round(electricityCanBeCoveredBySolar * 0.95M, 2);

                    yearlyElectricityCostWithSolar = Math.Round(((energyConsumedYearly - powerList[i - 1].EnergyOutput) * costOfGridElectricity) + (powerList[i - 1].EnergyOutput * LCOE), 2);
                    savingsValue = Math.Round(powerList[i - 1].EnergyOutput * (costOfGridElectricity - LCOE), 0);
                    accumulatedSavings += savingsValue;
                }

                savingList.Add(new Savings
                {
                    Year = i,
                    EnergyConsumedYearly = energyConsumedYearly,
                    CostOfGridElectricity = costOfGridElectricity,
                    YearlyElectricityCostWithoutSolar = yearlyElectricityCostWithoutSolar,
                    YearlyMinimumFromPLN = yearlyMinimumFromPLN,
                    ElectricityCanBeCoveredBySolar = electricityCanBeCoveredBySolar,
                    YearlyElectricityCostWithSolar = yearlyElectricityCostWithSolar,
                    SavingsValue = savingsValue,
                    AccumulatedSavings = accumulatedSavings
                });

                totalSavings += savingsValue;
            }

            averageSavings = Math.Round(totalSavings / yearInvestment, 0);
        }

        private void CalculatePowerGeneration(int yearInvestment)
        {
            decimal energyOutput = 0;

            for (int i = 1; i <= yearInvestment; i++)
            {
                if (i == 1)
                {
                    energyOutput = Math.Round(systemSize * pvOutput * 365, 0);
                }
                else
                {
                    energyOutput = Math.Round(energyOutput - (energyOutput * 0.005M), 0);
                }

                totalEnergyOutput += energyOutput;

                powerList.Add(new PowerGeneration { Year = i, EnergyOutput = energyOutput });
            }

            averageEnergyOutput = Math.Round(totalEnergyOutput / yearInvestment, 0);
        }
    }
}
