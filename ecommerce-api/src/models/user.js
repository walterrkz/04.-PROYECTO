import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
    trim: true,
  },
  hashPassword: { required: true, trim: true, type:String },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "guest"],
  },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

export default User;
