import mongoose from "mongoose";

const FraudLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },

  transactionId: { type: String },
  upiId: { type: String },
  deviceId: { type: String },
  location: { type: String },

  riskScore: { type: Number, required: true }, // 0.0 - 1.0
  isFraud: { type: Boolean, default: false },

  blockchainHash: { type: String }, // fraud event logged
  status: { type: String, enum: ["pending_review", "reviewed"], default: "pending_review" }
}, { timestamps: true });

const FraudLog = mongoose.model("FraudLog", FraudLogSchema);
export default FraudLog;