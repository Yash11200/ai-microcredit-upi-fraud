import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed with bcrypt
  phone: { type: String },
  upiId: { type: String }, 
  creditScore: { type: Number, default: 600 }, // AI model updates this
  loanHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loan" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;