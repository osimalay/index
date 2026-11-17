document.addEventListener("DOMContentLoaded", () => {
    const calculateButton = document.getElementById("calculate-repayment");
    if (!calculateButton) return;

    calculateButton.addEventListener("click", () => {
        const amount = Number(document.getElementById("loan-amount")?.value);
        const annualRate = Number(document.getElementById("interest-rate")?.value);
        const months = Number(document.getElementById("loan-duration")?.value);
        const result = document.getElementById("calculator-result");

        if (!result || !amount || amount <= 0 || annualRate < 0 || !months) {
            if (result) {
                result.textContent = "Enter a loan amount, interest rate and repayment period to continue.";
            }
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        const monthlyPayment = monthlyRate === 0
            ? amount / months
            : amount * monthlyRate * Math.pow(1 + monthlyRate, months)
                / (Math.pow(1 + monthlyRate, months) - 1);
        const totalRepayment = monthlyPayment * months;
        const formatNaira = value => new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 2
        }).format(value);

        result.textContent = `Estimated repayment: ${formatNaira(monthlyPayment)} per month (${formatNaira(totalRepayment)} total over ${months} months).`;
    });
});
