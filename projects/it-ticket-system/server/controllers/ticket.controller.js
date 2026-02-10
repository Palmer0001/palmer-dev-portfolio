const Ticket = require('../models/Ticket.model');
const User = require('../models/User.model');
const { logger } = require('../utils/logger');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      createdBy: req.user.id
    });

    logger.info(`Ticket created: ${ticket._id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      ticket
    });
  } catch (error) {
    logger.error(`Create ticket error: ${error.message}`);
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Ticket.find(JSON.parse(queryStr))
      .populate('createdBy', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email role');

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Ticket.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const tickets = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      pagination,
      data: tickets
    });
  } catch (error) {
    logger.error(`Get tickets error: ${error.message}`);
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email department phone')
      .populate('assignedTo', 'firstName lastName email role department')
      .populate('comments.user', 'firstName lastName email role')
      .populate('resolution.resolvedBy', 'firstName lastName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has access
    if (ticket.createdBy._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    logger.error(`Get ticket error: ${error.message}`);
    next(error);
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions
    if (ticket.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ticket'
      });
    }

    // Update ticket
    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    logger.info(`Ticket updated: ${ticket._id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    logger.error(`Update ticket error: ${error.message}`);
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Only admin or creator can delete
    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this ticket'
      });
    }

    await ticket.deleteOne();

    logger.info(`Ticket deleted: ${req.params.id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    logger.error(`Delete ticket error: ${error.message}`);
    next(error);
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text, isInternal } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const comment = {
      user: req.user.id,
      text,
      isInternal: isInternal || false
    };

    ticket.comments.push(comment);
    await ticket.save();

    // Populate user details in the response
    await ticket.populate('comments.user', 'firstName lastName email role');

    logger.info(`Comment added to ticket: ${ticket._id} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      comment: ticket.comments[ticket.comments.length - 1]
    });
  } catch (error) {
    logger.error(`Add comment error: ${error.message}`);
    next(error);
  }
};

// @desc    Assign ticket to agent
// @route   PUT /api/tickets/:id/assign
// @access  Private (Admin/Agent)
exports.assignTicket = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if agent exists and is agent/admin
    const agent = await User.findById(agentId);
    if (!agent || (agent.role !== 'agent' && agent.role !== 'admin')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent'
      });
    }

    ticket.assignedTo = agentId;
    ticket.assignedAt = new Date();
    ticket.status = 'in-progress';

    await ticket.save();

    logger.info(`Ticket ${ticket._id} assigned to agent: ${agentId} by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    logger.error(`Assign ticket error: ${error.message}`);
    next(error);
  }
};

// @desc    Resolve ticket
// @route   PUT /api/tickets/:id/resolve
// @access  Private (Admin/Agent)
exports.resolveTicket = async (req, res, next) => {
  try {
    const { resolutionDescription } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user is assigned agent or admin
    if (ticket.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to resolve this ticket'
      });
    }

    ticket.status = 'resolved';
    ticket.resolution = {
      description: resolutionDescription,
      resolvedAt: new Date(),
      resolvedBy: req.user.id
    };

    await ticket.save();

    logger.info(`Ticket ${ticket._id} resolved by user: ${req.user.id}`);

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    logger.error(`Resolve ticket error: ${error.message}`);
    next(error);
  }
};

// @desc    Get ticket statistics
// @route   GET /api/tickets/stats
// @access  Private (Admin)
exports.getTicketStats = async (req, res, next) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });

    res.status(200).json({
      success: true,
      stats: {
        status: stats,
        category: categoryStats,
        priority: priorityStats,
        summary: {
          total: totalTickets,
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: totalTickets - openTickets - inProgressTickets
        }
      }
    });
  } catch (error) {
    logger.error(`Get ticket stats error: ${error.message}`);
    next(error);
  }
};