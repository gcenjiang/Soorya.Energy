namespace SooryaWebAPI.Models
{
    public class Savings
    {
        public int Year { get; set; }
        public decimal EnergyConsumedYearly { get; set; }
        public decimal CostOfGridElectricity { get; set; }
        public decimal YearlyElectricityCostWithoutSolar { get; set; }
        public decimal YearlyMinimumFromPLN { get; set; }
        public decimal ElectricityCanBeCoveredBySolar { get; set; }
        public decimal YearlyElectricityCostWithSolar { get; set; }
        public decimal SavingsValue { get; set; }
        public decimal AccumulatedSavings { get; set; }
    }
}
