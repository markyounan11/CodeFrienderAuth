const router = require('express').Router();
const { sendMessage, getAllMessages } = require('../../../controllers/messageController');
const { requireAuth } = require('../../../middlewares/authMiddlewares');


// 'api/messages' prepended
router.route('/:eventId')
  .get(requireAuth, getAllMessages)
  .post(requireAuth, sendMessage);
// router.route('/')

module.exports = router;
