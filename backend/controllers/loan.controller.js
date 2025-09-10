import Loan from "../models/loan.model.js";
import User from "../models/user.model.js";
import { predictCreditRisk } from "../config/ai_Services.js"

export const applyForLoan = async (req, res) => {
  try {
    // Now getting all required data directly from the request body
    const { 
      userId,
      amount, 
      purpose,
      person_age, 
      person_income, 
      loan_grade, 
      person_emp_length 
    } = req.body;

    // The AI data is now dynamic and comes from the client's request
    const loanDataForAI = {
      person_age: person_age,
      person_income: person_income,
      loan_amnt: amount, // loan_amnt is the loan amount from the request
      loan_grade: loan_grade,
      person_emp_length: person_emp_length
    };

    // Call AI Credit Scoring Microservice with the dynamic data
    const aiResponse = await predictCreditRisk(loanDataForAI);
    const riskScore = aiResponse.loan_status;

    let loanStatus = "approved";
    if (riskScore === 1) {
      loanStatus = "rejected";
    }

    // Create a new loan document using your Mongoose model
    const loan = new Loan({
      userId,
      amount,
      purpose,
      status: loanStatus,
      riskScore: riskScore,
      approvedAmount: (loanStatus === "approved") ? amount : 0,
      repaymentDue: (loanStatus === "approved") ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
    });

    // Save the loan to the database
    await loan.save();

    const user = await User.findById(userId);
    if (user) {
      user.loanHistory.push(loan._id);
      await user.save();
    }

    if (loanStatus === "rejected") {
      return res.status(400).json({ 
        message: "Loan application rejected based on credit risk assessment",
        loanId: loan._id,
        riskScore: loan.riskScore
      });
    }

    // Call Blockchain API to record the transaction
    // const blockchainResponse = await axios.post("http://localhost:5000/api/blockchain/recordLoan", {
    //     loanId: loan._id,
    //     userId,
    //     amount
    // });

    // Update the loan document with the blockchain hash
    // loan.blockchainHash = blockchainResponse.data.hash;
    await loan.save();

    res.status(201).json({
      loanId: loan._id,
      status: loan.status,
      approvedAmount: loan.approvedAmount,
      riskScore: loan.riskScore,
      message: "Loan approved and disbursed",
      // blockchainHash: loan.blockchainHash
    });

  } catch (error) {
    console.error("Error applying for loan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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