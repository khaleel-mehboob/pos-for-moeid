const { DataTypes } = require("sequelize");

module.exports = ((sequelize, Sequelize) => {
  const JournalEntry = sequelize.define("journalEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entryType: {
      type: DataTypes.ENUM(['General Entry', 'Adjustment Entry', 'Rectification Entry', 'Reversal Entry', 'Closing Entry']),
      required: [true, 'Entry Type must be Defined'],
      defaultValue: 'General Entry'
    },
    narration: {
      type: DataTypes.STRING,
      required: [true, 'Journal Entry needs a Narration']
    },
    amount: {
      type: DataTypes.BIGINT,
      required: [true, 'Please enter the Amount']
    },
    createdBy: {
      type: DataTypes.INTEGER,
      defaultValue: -1
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      defaultValue: -1
    }
  }, {
    // Other options to go here
    underscored: true
  });

  return JournalEntry;
});