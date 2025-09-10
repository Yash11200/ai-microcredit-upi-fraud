import FraudLog from "../models/FraudLog.model.js";
import { predictFraud } from "../config/ai_Services.js"

export const checkFraud = async (req, res) => {
  try {
    // Destructure all fields from the request body for clarity
    const {
      userId,
      loanId,
      transactionId,
      upiId,
      deviceId,
      location,
      ...transactionDataForAI
    } = req.body;

    // Call AI Fraud Detection Microservice
    const aiResponse = await predictFraud(transactionDataForAI);
        
    // The AI model returns 0 or 1, which serves as both the fraud flag and the risk score
    const isFraud = aiResponse.isFraud;
    const riskScore = isFraud;

    let message = "Transaction is not flagged as fraudulent.";
    if (isFraud === 1) {
      message = "WARNING: This transaction is flagged as potentially fraudulent.";
    }

    const fraudLog = new FraudLog({
      userId,
      loanId,
      transactionId,
      upiId,
      deviceId,
      location,
      riskScore: riskScore, // Fixed: Using the AI's prediction as the risk score
      isFraud: isFraud === 1,
      message: message 
    });

    await fraudLog.save();

    res.status(200).json({
      isFraud: isFraud === 1,
      riskScore: riskScore,
      message: message,
      logId: fraudLog._id
    });

  } catch (error) {
    console.error("Error checking for fraud:", error);
    res.status(500).json({ message: "Server error" });
  }
};
