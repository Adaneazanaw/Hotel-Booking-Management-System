const models = require("../models");

async function listAuditLogs(req, res) {
  try {
    const logs = await models.AuditLog.findAll({ order: [["event_timestamp", "DESC"]], limit: 200 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { listAuditLogs };