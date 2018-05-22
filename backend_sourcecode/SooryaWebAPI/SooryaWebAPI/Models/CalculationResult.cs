using System;
using System.Collections.Generic;

namespace SooryaWebAPI.Models
{
    public class CalculationResult
    {
        public DateTime TrxDate { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string BuildingType { get; set; }
        public decimal MonthlyElectricityBill { get; set; }
        public decimal Power { get; set; }
        public decimal Coverage { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Address { get; set; }
        public string Formatted { get; set; }
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string Notes { get; set; }
        public int RoofPitch { get; set; }
        public int RoofOrientationValue { get; set; }
        public string RoofOrientationText { get; set; }
        public decimal FirstYearSavings { get; set; }
        public decimal AnnualSavings { get; set; }
        public decimal PaybackPeriod { get; set; }
        public decimal SolarSystemCost { get; set; }
        public decimal ReturnOnInvestment { get; set; }
        public decimal SystemSize { get; set; }
        public decimal MonthlyElectricityUse { get; set; }
        public decimal MonthlySolarProduction { get; set; }
        public decimal LifetimeCO2Reduction { get; set; }
        public decimal NumberOfPanels { get; set; }
        public decimal AreaRequired { get; set; }
        public decimal CostOfSolarPerWatt { get; set; }
        public decimal LifetimeCostOfElectricity { get; set; }
        public decimal LifetimeSavings { get; set; }
        public List<Savings> ElectricityBillComparison { get; set; }
    }
}
