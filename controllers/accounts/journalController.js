const db = require("../../models");
const catchAsync = require('../../utils/catchAsync');
const { sequelize } = require("../../models");
const factory = require('../handlerFactory');

exports.checkId = factory.checkId(db.journalEntries);

// General Journal
// Get Journal Entries by Date
exports.getJournal = factory.getAll(db.journalEntries);
// createJournalEntry
// For creating journal entry in isolation
exports.createJournalEntry = catchAsync(async (req, res) => {

  const journalEntryObj = {...req.body};
  
  const ledgerEntries = [...journalEntryObj.ledgerEntries];
  journalEntryObj.ledgerEntries = undefined;

  const result = await sequelize.transaction( async (t) => {

    const inserted_journalEntry = await db.journalEntries.create(journalEntryObj, { transaction: t, user: req.user });
    
    let doc;

    for(let i = 0; i < ledgerEntries.length; i++) {

      doc = await db.accounts.findByPk(ledgerEntries[i].accountId, { transaction: t, user: req.user });

      calculateAccountBalance(doc, ledgerEntries[i].amount, ledgerEntries[i].entryType);
      await doc.save({transaction: t, user: req.user });
      
      ledgerEntries[i].journalEntryId = inserted_journalEntry.id;
      ledgerEntries[i].balance = doc.balance;
      ledgerEntries[i].balanceType = doc.balanceType;

      await db.ledgerEntries.create(ledgerEntries[i], {transaction: t, user: req.user });
    }

    return inserted_journalEntry;
  });

  res.status(200).json(
    {
      status: 'success',
      message: 'Journal entry posted succussfuly...',
      journalEntry: result
    }
  );  
});

const calculateAccountBalance = (doc, amount, entryType) => {
  if((doc.accountGroup === 'Asset' || doc.accountGroup === 'Expense')) {
    // Primary Nature of the Account is 'Dr'

    if(doc.balanceType === 'Dr') {
      // Existing Balance type is 'Dr'
      if(entryType === 'Dr') {
        doc.balance *= 1; // Convert to number if zero
        doc.balance += amount; // Aaa amount/
      }

      if(entryType === 'Cr') {
        doc.balance *= 1; // Convert to number if zero
        // Existing Balance Type is 'Dr', So we need to subtract the amount
        doc.balance -= amount;
        if(doc.balance < 0) {
          // If after substraction amount is < 0
          doc.balance *= -1;  // Change to positive value
          doc.balanceType = 'Cr'  // Change the Balacne type to 'Cr'
        }
      }
    }
    else if(doc.balanceType === 'Cr')  {
      // Existing Balance type is 'Cr'
      if(entryType === 'Cr') {
        doc.balance *= 1; // Convert to number if zero
        doc.balance += amount; // Add amount

      }
      
      if(entryType === 'Dr') {
        doc.balance *= 1; // Convert to number if zero
        // Existing Balance Type is 'Cr', So we need to subtract the amount
        doc.balance -= amount;
        if(doc.balance <= 0) {
          // If after substraction amount is < 0
          doc.balance *= -1;  // Change to positive value
          doc.balanceType = 'Dr'  // Change the Balacne type to 'Dr' which is primary nature of an 'Asset' / 'Expense' account.
        }
      }
    }
  } else if((doc.accountGroup === 'Liability' || doc.accountGroup === 'Revenue')) {
    // Primary Nature of the Account is 'Cr'
    if(doc.balanceType === 'Cr') {
      // Existing Balance type is 'Cr'
      if(entryType === 'Cr') {
        doc.balance *= 1; // Convert to number if zero
        doc.balance += amount; // Add amount
      }
      
      if(entryType === 'Dr') {
        doc.balance *= 1; // Convert to number if zero
        // Existing Balance Type is 'Cr', So we need to subtract the amount
        doc.balance -= amount;
        if(doc.balance < 0) {
          // If after substraction amount is < 0
          doc.balance *= -1;  // Change to positive value
          doc.balanceType = 'Dr'  // Change the Balacne type to 'Dr'
        }
      }
    }
    else if(doc.balanceType === 'Dr')  {
      // Existing Balance type is 'Dr'
      if(entryType === 'Dr') {
        doc.balance *= 1; // Convert to number if zero
        doc.balance += amount; // Add amount
      } 
      
      if(entryType === 'Cr') {
        doc.balance *= 1; // Convert to number if zero
        // Existing Balance Type is 'Dr', So we need to subtract the amount
        doc.balance -= amount;
        
        if(doc.balance <= 0) {
          // If after substraction amount is < 0
          doc.balance *= -1;  // Change to positive value
          doc.balanceType = 'Cr'  // Change the Balacne type to 'Cr' which is primary nature of an 'Asset' / 'Expense' account.
        }
      }
    }
  }
}

exports.getJournalEntry = factory.getOne(db.journalEntries);