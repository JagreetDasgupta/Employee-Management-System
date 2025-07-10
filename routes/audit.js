import express from 'express';
import { getAuditLogs, exportAuditLogs } from '../middleware/audit.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/audit/logs - Get audit logs (admin only)
router.get('/logs', getAuditLogs);

// GET /api/audit/export - Export audit logs to CSV (admin only)
router.get('/export', exportAuditLogs);

export default router; 