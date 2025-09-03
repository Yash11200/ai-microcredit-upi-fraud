import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  purpose: { type: String },

  status: { type: String, enum: ["pending", "approved", "rejected", "active", "repaid"], default: "pending" },
  approvedAmount: { type: Number },
  repaymentDue: { type: Date },
  repaymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

  transactionId: { type: String }, // UPI transaction reference
  blockchainHash: { type: String }, // Polygon tx hash

  riskScore: { type: Number }, // from fraud detection AI
}, { timestamps: true });

const Loan = mongoose.model("Loan", LoanSchema);

export default Loan;