const router = require('express').Router();
const ctrl = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { isStaff, isAdmin } = require('../middleware/roleMiddleware');

router.get('/', protect, isStaff, ctrl.getAllInventory);
router.get('/low-stock', protect, isStaff, ctrl.getLowStockAlerts);
router.get('/report', protect, isAdmin, ctrl.getInventoryReport);
router.post('/', protect, isAdmin, ctrl.createInventoryItem);
router.patch('/:id/stock', protect, isStaff, ctrl.updateStock);

module.exports = router;
