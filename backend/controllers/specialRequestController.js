const SpecialRequest = require('../models/SpecialRequest');

// Create a special request
exports.createSpecialRequest = async (req, res) => {
  try {
    const newRequest = new SpecialRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all special requests
exports.getAllSpecialRequests = async (req, res) => {
  try {
    const requests = await SpecialRequest.find()
      .populate('user', 'firstName lastName email userId location');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get past special requests (date is earlier than today)
exports.getPastSpecialRequests = async (req, res) => {
  try {
    const today = new Date();
    const pastRequests = await SpecialRequest.find({ date: { $lt: today } })
      .populate('user', 'firstName lastName email userId location');
      
    if (pastRequests.length === 0) {
      return res.status(404).json({ message: 'No past special requests found' });
    }
    
    res.status(200).json(pastRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get special requests by user ID
exports.getSpecialRequestsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await SpecialRequest.find({ user: userId })
      .populate('user', 'firstName lastName email');
    
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No special requests found for this user' });
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update special request by ID
exports.updateSpecialRequest = async (req, res) => {
  try {
    const updatedRequest = await SpecialRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) return res.status(404).json({ message: 'Special request not found' });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete special request by ID
exports.deleteSpecialRequest = async (req, res) => {
  try {
    const deletedRequest = await SpecialRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ message: 'Special request not found' });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate the amount for a special request
exports.calculateAmount = async (req, res) => {
  try {
    const request = await SpecialRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Special request not found' });

    const rate = 5; // Example rate per unit of waste
    request.amount = request.quantity * rate;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update special request status by ID
exports.updateSpecialRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // Get the new status from the request body
    const updatedRequest = await SpecialRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) return res.status(404).json({ message: 'Special request not found' });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Count all special requests
exports.countAllSpecialRequests = async (req, res) => {
  try {
    const count = await SpecialRequest.countDocuments();
    res.status(200).json({ totalRequests: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete completed special requests
exports.deleteCompletedSpecialRequests = async (req, res) => {
  try {
    const result = await SpecialRequest.deleteMany({ collectStatus: 'Complete' });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No completed special requests found to delete' });
    }

    res.status(200).json({ message: `${result.deletedCount} completed special requests deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};