const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({ 
  title: { type: String, required: true }, 
  subtitle: String,
  description: String, 
  longDescription: String,
  category: String, 
  status: { type: String, default: 'active' },
  features: [{ 
    icon: String, 
    text: String 
  }],
  badge: String,
  rating: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  price: { type: Number, required: true }, 
  discountPrice: Number,
  isFree: { type: Boolean, default: false }, 
  thumbnailUrl: String, 
  image: String,
  instructor: {
    name: String,
    title: String,
    bio: String,
    image: String
  },
  whatYouWillLearn: [String],
  courseContent: [{
    title: String,
    lessons: [{
      title: String,
      duration: String,
      preview: { type: Boolean, default: false }
    }]
  }],
  requirements: [String],
  targetAudience: [String],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  enrolledCount: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now } 
}); 

module.exports = mongoose.model('Course', CourseSchema);