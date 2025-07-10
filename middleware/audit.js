import mongoose from 'mongoose';

// Audit log schema
const auditLogSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    role: String
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT']
  },
  resource: {
    type: String,
    required: true,
    enum: ['EMPLOYEE', 'USER', 'AUTH', 'SYSTEM']
  },
  resourceId: mongoose.Schema.Types.ObjectId,
  details: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    changes: [String]
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: String
}, {
  timestamps: true
});

// Create indexes for better query performance
auditLogSchema.index({ 'user.id': 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Audit middleware factory
export const createAuditMiddleware = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const startTime = Date.now();
    
    // Override res.send to capture response
    res.send = function(data) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Parse response data
      let responseData;
      try {
        responseData = JSON.parse(data);
      } catch (e) {
        responseData = { raw: data };
      }
      
      // Create audit log entry
      const auditEntry = {
        user: {
          id: req.user?._id,
          username: req.user?.username,
          role: req.user?.role
        },
        action,
        resource,
        resourceId: req.params.id || req.body.id,
        details: {
          before: req.originalBody,
          after: req.body,
          changes: getChanges(req.originalBody, req.body)
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date(),
        success: responseData.success !== false,
        errorMessage: responseData.success === false ? responseData.message : null,
        duration
      };
      
      // Save audit log asynchronously (don't block response)
      AuditLog.create(auditEntry).catch(err => {
        console.error('Audit log creation failed:', err);
      });
      
      // Call original send method
      return originalSend.call(this, data);
    };
    
    // Store original body for comparison
    req.originalBody = req.body;
    
    next();
  };
};

// Helper function to detect changes
const getChanges = (before, after) => {
  if (!before || !after) return [];
  
  const changes = [];
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  
  // Check for new fields
  afterKeys.forEach(key => {
    if (!beforeKeys.includes(key)) {
      changes.push(`Added: ${key}`);
    } else if (before[key] !== after[key]) {
      changes.push(`Modified: ${key}`);
    }
  });
  
  // Check for removed fields
  beforeKeys.forEach(key => {
    if (!afterKeys.includes(key)) {
      changes.push(`Removed: ${key}`);
    }
  });
  
  return changes;
};

// Get audit logs (admin only)
export const getAuditLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      resource, 
      userId,
      startDate,
      endDate,
      success
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (userId) filter['user.id'] = userId;
    if (success !== undefined) filter.success = success === 'true';
    
    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get audit logs
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user.id', 'username role');
    
    // Get total count
    const total = await AuditLog.countDocuments(filter);
    
    res.json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: logs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalLogs: total,
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Export audit logs to CSV
export const exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, action, resource } = req.query;
    
    // Build filter
    const filter = {};
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    // Get logs
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .populate('user.id', 'username role');
    
    // Convert to CSV
    const csvHeaders = [
      'Timestamp',
      'User',
      'Role',
      'Action',
      'Resource',
      'Resource ID',
      'IP Address',
      'Success',
      'Duration (ms)',
      'Changes'
    ];
    
    const csvData = logs.map(log => [
      log.timestamp.toISOString(),
      log.user.username || 'Unknown',
      log.user.role || 'Unknown',
      log.action,
      log.resource,
      log.resourceId || '',
      log.ipAddress || '',
      log.success ? 'Yes' : 'No',
      log.duration || '',
      log.details.changes.join('; ')
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
    
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export default AuditLog; 