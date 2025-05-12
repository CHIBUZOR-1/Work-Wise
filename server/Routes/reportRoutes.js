const express = require('express');
const { verifyToken, isAdminz } = require('../Utitz/verifyToken');
const { exportTaskReport, exportUsersReport } = require('../Controllers/ReportController');
const reportRouter = express.Router();

reportRouter.get('/admin-reports', verifyToken, isAdminz, exportTaskReport)
reportRouter.get('/users-reports', verifyToken, isAdminz,  exportUsersReport)

module.exports = reportRouter;