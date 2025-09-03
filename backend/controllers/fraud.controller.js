import FraudLog from "../models/FraudLog.model.js";
import axios from "axios";

export const checkFraud = async (req, res) => {
  try {
    const { userId, transaction } = req.body;

    // Call AI Fraud Microservice
    const aiRes = await axios.post("http://localhost:8000/fraud-check", transaction);

    const fraudLog = await FraudLog.create({
      userId,
      transactionId: transaction.transactionId,
      upiId: transaction.upiId,
      deviceId: transaction.deviceId,
      location: transaction.location,
      riskScore: aiRes.data.riskScore,
      isFraud: aiRes.data.isFraud
    });

    // If fraud, log on blockchain
    if (aiRes.data.isFraud) {
      await axios.post("http://localhost:5000/api/blockchain/logFraud", {
        fraudId: fraudLog._id,
        userId,
        transactionId: transaction.transactionId
      });
    }

    res.json(aiRes.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}