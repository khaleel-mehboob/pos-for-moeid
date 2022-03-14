const db = require("../../models");
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');
const commonHandler = require('../commonHandlers');

exports.getLedger = catchAsync(async (req, res) => {

  let features = new APIFeatures({}, req.query)
  .filter().sort().limitFields().paginate();

  // Set the where clause in apiFeatures
  if(req.params.accountId) {
    // Account Ledger
    const accountId = req.params.accountId * 1;
    features.query.where = { accountId };
  } else if( req.params.id * 1) {
    // Journal Entry Ledger
    const journalEntryId = req.params.id * 1;
    features.query.where = { journalEntryId };
  }
  
  const includeOptions = commonHandler.getOptions(db.ledgerEntries);
  features.query.include = includeOptions.include;

  const ledgerEntries = await db.ledgerEntries.findAll(features.query);

  res.status(200).json(
    {
      status: 'success',
      results: ledgerEntries.length,
      ledgerEntries
    }
  );
});