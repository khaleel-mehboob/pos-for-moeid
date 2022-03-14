const db = require("../../models");
const factory = require('../handlerFactory');
const AppError = require('../../utils/appError');
const axios = require('axios');

exports.checkId = factory.checkId(db.orders);
exports.createOrder = factory.createOperation(db.orders, db.orderEntries);
// By default getAll() returns pending orders
exports.getOrders = factory.getAll(db.orders);
// We will pass a flag to get today's delivered orders
exports.getTodaysDeliveredOrders = factory.getAll(db.orders, true);

exports.getOrder = factory.getOne(db.orders);
exports.updateOrder = factory.updateOne(db.orders);

exports.cancelOrder = catchAsync(async (req, res, next) => {
  
  const id = req.params.orderId;
  const document = await db.orders.findByPk(id);
  
  // Throw error if document not found
  if(!document) {
    return next(new AppError('No document found with that ID.'));
  }

  // Reject change if order is already cancelled or delivered
  if(document.status === 'Cancelled' || document.status === 'Delivered') {
    return next(new AppError(`Cannot process request! Order has already been ${document.status}`));
  }
  
  // TO DO 1 // Post Account Entries

  // Update fields
  document.status = 'Cancelled';

  let amount = parseFloat(document.advancePayment);
  
  const result = await db.sequelize.transaction(async t => {

    if(amount > 0) {
      
      const counterCashAccount = await db.accounts.findOne({ where: { userId: req.user.id }});
      const liabilityAccount = await db.accounts.findOne({ where: { title: 'Advance Received against Orders' } });

      const journalEntryObj = {
        entryType: "General Entry",
        narration: `Returned cash on cancellation of Order Id: ${document.id}`,
        amount,
        ledgerEntries: [
            {
                entryType: "Dr",
                amount,
                accountId: liabilityAccount.id
            },
            {
                entryType: "Cr",
                amount,
                accountId: counterCashAccount.id
            }
        ]
      }

      let axiosOptions = {
        baseURL: process.env.AXIOS_BASE_URL,
        headers: { Authorization: `Bearer ${req.cookies.jwt}` }
      }

      await axios.post('/api/v1/journal', journalEntryObj, axiosOptions);
    }

    return await document.save({ transaction: t, user: req.user });
  });

  // Send result
  res.status(203).json(
    {
      status: 'success',
      data: {
        result
      }
    }
  );
});

exports.getOrderSum = factory.getSum(db.orders);
exports.getOrderCount = factory.getCount(db.orders);