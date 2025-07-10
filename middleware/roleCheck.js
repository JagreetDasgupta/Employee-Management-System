// Role-based access control middleware

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to check if user is HR or admin
export const requireHR = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'HR' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'HR or Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('HR check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to check if user has any valid role
export const requireValidRole = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const validRoles = ['admin', 'HR'];
    if (!validRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid user role'
      });
    }

    next();
  } catch (error) {
    console.error('Role validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 