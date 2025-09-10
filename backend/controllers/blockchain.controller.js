export const recordLoan = async (req, res) => {
  try {
    const { loanId, userId, amount } = req.body;
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}`;
    res.json({ transactionHash: txHash, status: "recorded" });
  } catch (error) {
    console.error("Error recording loan on blockchain:", error);
    res.status(500).json({ message: error.message });
  }
}

export const logFraud = async (req, res) => {
  try {
    const { fraudId, userId, transactionId } = req.body;
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}`;
    res.json({ transactionHash: txHash, status: "fraud_logged" });
  } catch (error) {
    console.error("Error logging fraud on blockchain:", error);
    res.status(500).json({ message: error.message });
  }
}
