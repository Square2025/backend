const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   POST api/courses
// @desc    Create a new course
// @access  Admin only
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { 
      title, 
      subtitle,
      description, 
      longDescription,
      category, 
      status,
      features,
      badge,
      rating,
      students,
      price, 
      discountPrice,
      isFree, 
      thumbnailUrl,
      image,
      instructor,
      whatYouWillLearn,
      courseContent,
      requirements,
      targetAudience
    } = req.body;

    // Validate required fields
    if (!title || (price === undefined && isFree === undefined)) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const courseData = {
      title,
      subtitle,
      description,
      longDescription,
      category,
      status,
      features,
      badge,
      rating,
      students,
      price: isFree ? 0 : price,
      discountPrice,
      isFree: !!isFree,
      thumbnailUrl,
      image,
      instructor,
      whatYouWillLearn,
      courseContent,
      requirements,
      targetAudience,
      createdBy: req.user.id
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/courses/:id
// @desc    Update course
// @access  Admin only
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { 
      title, 
      subtitle,
      description, 
      longDescription,
      category, 
      status,
      features,
      badge,
      rating,
      students,
      price, 
      discountPrice,
      isFree, 
      thumbnailUrl,
      image,
      instructor,
      whatYouWillLearn,
      courseContent,
      requirements,
      targetAudience
    } = req.body;
    
    const courseFields = {};
    if (title) courseFields.title = title;
    if (subtitle) courseFields.subtitle = subtitle;
    if (description) courseFields.description = description;
    if (longDescription) courseFields.longDescription = longDescription;
    if (category) courseFields.category = category;
    if (status) courseFields.status = status;
    if (features) courseFields.features = features;
    if (badge) courseFields.badge = badge;
    if (rating !== undefined) courseFields.rating = rating;
    if (students !== undefined) courseFields.students = students;
    if (isFree !== undefined) {
      courseFields.isFree = isFree;
      courseFields.price = isFree ? 0 : (price || 0);
    } else if (price !== undefined) {
      courseFields.price = price;
    }
    if (discountPrice !== undefined) courseFields.discountPrice = discountPrice;
    if (thumbnailUrl) courseFields.thumbnailUrl = thumbnailUrl;
    if (image) courseFields.image = image;
    if (instructor) courseFields.instructor = instructor;
    if (whatYouWillLearn) courseFields.whatYouWillLearn = whatYouWillLearn;
    if (courseContent) courseFields.courseContent = courseContent;
    if (requirements) courseFields.requirements = requirements;
    if (targetAudience) courseFields.targetAudience = targetAudience;

    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: courseFields },
      { new: true }
    );

    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/courses/:id
// @desc    Delete course
// @access  Admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;