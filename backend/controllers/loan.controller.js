import Loan from "../models/loan.model.js";
import User from "../models/user.model.js";
import axios from "axios";

export const applyForLoan = async (req, res) => {
  try {
    const { userId, amount, purpose } = req.body;

    // Call AI Credit Scoring Microservice
    const aiResponse = await axios.post("http://localhost:8000/credit-score", {
      userId,
      income: 20000,
      loanHistory: 3,
      repaymentHistory: "good"
    })

    if (!aiResponse.data.approved) {
      return res.status(400).json({ message: "Loan application rejected" });
    }

    const loan = new Loan({
      userId,
      amount,
      purpose,
      status: "approved",
      approvedAmount: amount,
      repaymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // due in 7 days
    })

    // Call Blockchain API
    await axios.post("http://localhost:5000/api/blockchain/recordLoan", {
      loanId: loan._id, 
      userId, 
      amount
    })

    res.status(201).json({
      loanId: loan._id,
      status: loan.status,
      approvedAmount: loan.approvedAmount,
      creditScore: aiResponse.data.creditScore,
      message: "Loan approved and disbursed"
    });
  } catch (error) {
    console.error("Error applying for loan:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.params.userId });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const repayLoan = async (req, res) => {
  try {
    const { loanId, amount, upiId } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Simulate UPI transaction
    const transactionId = `txn_${Date.now()}`;

    loan.repaymentStatus = "paid";
    loan.status = "repaid";
    loan.transactionId = transactionId;
    await loan.save();

    res.json({
      status: "success",
      transactionId,
      message: "Repayment successful"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}