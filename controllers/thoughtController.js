import Thought from '../models/Thought.js';

// @desc    Get all thoughts for logged-in user
// @route   GET /api/thoughts?search=keyword&category=Learning&tag=coding&isFavorite=true
// @access  Private
export const getThoughts = async (req, res) => {
  try {
    // Build query - only user's thoughts
    let query = { user: req.user.id };

    // Search by keyword (in title or content)
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by favorite status
    if (req.query.isFavorite) {
      query.isFavorite = req.query.isFavorite === 'true';
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Execute query
    const thoughts = await Thought.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: thoughts.length,
      filters: req.query,
      data: thoughts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single thought by ID
// @route   GET /api/thoughts/:id
// @access  Private
export const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    // Check if thought belongs to user
    if (thought.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this thought'
      });
    }

    res.status(200).json({
      success: true,
      data: thought
    });
  } catch (error) {
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new thought
// @route   POST /api/thoughts
// @access  Private
export const createThought = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content'
      });
    }

    const thought = await Thought.create({
      user: req.user.id, // Add authenticated user's ID
      title,
      content,
      category,
      tags
    });

    res.status(201).json({
      success: true,
      data: thought
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update thought
// @route   PUT /api/thoughts/:id
// @access  Private
export const updateThought = async (req, res) => {
  try {
    const { title, content, category, tags, isFavorite } = req.body;

    // Find thought first
    let thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    // Check ownership - only owner can update
    if (thought.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this thought'
      });
    }

    // Update fields
    thought = await Thought.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        tags,
        isFavorite
      },
      {
        new: true,           // Return updated document
        runValidators: true  // Run schema validations
      }
    );

    res.status(200).json({
      success: true,
      data: thought
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete thought
// @route   DELETE /api/thoughts/:id
// @access  Private
export const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    // Check ownership - only owner can delete
    if (thought.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this thought'
      });
    }

    await thought.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Thought deleted successfully',
      data: {}
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/thoughts/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    // Check ownership
    if (thought.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this thought'
      });
    }

    // Toggle the favorite status
    thought.isFavorite = !thought.isFavorite;
    await thought.save();

    res.status(200).json({
      success: true,
      data: thought
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Thought not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all favorite thoughts
// @route   GET /api/thoughts/favorites/all
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const thoughts = await Thought.find({ 
      user: req.user.id,      // Only user's thoughts
      isFavorite: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: thoughts.length,
      data: thoughts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get thought statistics
// @route   GET /api/thoughts/stats/summary
// @access  Private
export const getStats = async (req, res) => {
  try {
    // Total thoughts for this user
    const totalThoughts = await Thought.countDocuments({ user: req.user.id });
    
    // Favorite count for this user
    const favoriteCount = await Thought.countDocuments({ 
      user: req.user.id,
      isFavorite: true 
    });
    
    // Count by category for this user
    const categoryStats = await Thought.aggregate([
      {
        $match: { user: req.user._id } // Filter by user
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get all unique tags for this user
    const allTags = await Thought.distinct('tags', { user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        totalThoughts,
        favoriteCount,
        categoryBreakdown: categoryStats,
        totalCategories: categoryStats.length,
        allTags: allTags,
        totalTags: allTags.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};