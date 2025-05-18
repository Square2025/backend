const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  email: { type: String, unique: true, required: true }, 
  passwordHash: { type: String, required: true }, 
  role: { type: String, enum: ["student", "admin"], default: "student" }, 
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], 
  createdAt: { type: Date, default: Date.now } 
}); 

module.exports = mongoose.model('User', UserSchema);