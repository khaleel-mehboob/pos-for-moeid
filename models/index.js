const { Sequelize, DOUBLE, DataTypes } = require("sequelize");

let sequelize;

if(process.env.NODE_ENV === 'development') {
  // DB configuration for DEVELOPEMENT
  sequelize = new Sequelize(process.env.DB_DEV_DB, process.env.DB_DEV_USER, process.env.DB_DEV_PASSWORD, {
    
    host: process.env.DB_DEV_HOST,
    dialect: process.env.DB_DEV_dialect,
    define: {
      hooks: {
        beforeCreate (instance, options) {
          if(options.user) {
            instance.createdBy = options.user.id;
          }
        },
        beforeUpdate (instance, options) {
          if(options.user) {
            instance.updatedBy = options.user.id;
          }
        }
      }
    }
  });
} else {
    // DB configuration for PRODUCTION
    sequelize = new Sequelize(process.env.DB_PROD_DB, process.env.DB_PROD_USER, process.env.DB_PROD_PASSWORD, {
    host: process.env.DB_PROD_HOST,
    port: process.env.DB_PROD_PORT,
    dialect: process.env.DB_PROD_dialect,
    define: {
      hooks: {
        beforeCreate (instance, options) {
          instance.createdBy = options.user.id
        },
        beforeUpdate (instance, options) {
          instance.updatedBy = options.user.id
        }
      }
    }
  });
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 1. ACCOUNTS ===============================================================================
// 1.1 Initiate Accounts Models
db.accountHeads = (require('./accounts/accountHead.model'))(sequelize, Sequelize);
db.accountSubHeads = (require('./accounts/accountSubHead.model'))(sequelize, Sequelize);
db.accounts = (require('./accounts/account.model'))(sequelize, Sequelize);
db.receipts = (require('./accounts/receipt.model'))(sequelize, Sequelize);
db.payments = (require('./accounts/payment.model'))(sequelize, Sequelize);
db.journalEntries = (require('./accounts/journalEntry.model'))(sequelize, Sequelize);
db.ledgerEntries = (require('./accounts/ledgerEntry.model'))(sequelize, Sequelize);
// 1.2 db.length must be initialized with number of models created above
db.length = 7;

// 1.3 Define Assosications
db.accountHeads.hasMany(db.accountSubHeads);
db.accountSubHeads.accountHead = db.accountSubHeads.belongsTo(db.accountHeads);

db.accountHeads.accounts = db.accountHeads.hasMany(db.accounts);
db.accounts.accountHead = db.accounts.belongsTo(db.accountHeads);

db.accountSubHeads.accounts = db.accountSubHeads.hasMany(db.accounts);
db.accounts.accountSubHead = db.accounts.belongsTo(db.accountSubHeads);

// db.journalEntries.debitEntries = db.journalEntries.hasMany(db.ledgerEntries);
db.journalEntries.ledgerEntries = db.journalEntries.hasMany(db.ledgerEntries);
db.ledgerEntries.journalEntry = db.ledgerEntries.belongsTo(db.journalEntries);
db.ledgerEntries.account = db.ledgerEntries.belongsTo(db.accounts);

db.accounts.ledgerEntries = db.accounts.hasMany(db.ledgerEntries);
db.ledgerEntries.belongsTo(db.accounts);

// 2. AUTH ===============================================================================================
// 2.1 Initiate Models
db.users = (require('./auth/user.model'))(sequelize, Sequelize);
// 2.2 db.length must be INITIALIZED with 1
db.length += 1;

// 2.3 Define Association
db.users.account = db.users.hasMany(db.accounts);
db.accounts.belongsTo(db.users);


// 3. SUPPLY CHAIN =============================================================================================
// 3.1 Initiate Models
db.suppliers = (require('./supplyChain/supplier.model'))(sequelize, Sequelize);
db.customers = (require('./crm/customer.model'))(sequelize, Sequelize);
// 3.2 db.length must be incremented with number of models created above
db.length += 2;

// 3.3 Define Assosications
db.suppliers.account = db.suppliers.hasOne(db.accounts);
db.accounts.belongsTo(db.suppliers);

db.suppliers.hasMany(db.payments);
db.payments.supplier = db.payments.belongsTo(db.suppliers);

db.customers.account = db.customers.hasOne(db.accounts);
db.accounts.belongsTo(db.customers);

db.customers.hasMany(db.receipts);
db.receipts.customer = db.receipts.belongsTo(db.customers);

// 4. BIZ OBJECTS =============================================================================================
// 4.1 Initiate Models
db.departments = (require('./bizObjects/department.model'))(sequelize, Sequelize);
db.categories = (require('./bizObjects/category.model'))(sequelize, Sequelize);
db.items = (require('./bizObjects/item.model'))(sequelize, Sequelize);
// 4.2 db.length must be incremented with number of models created above
db.length += 3;

// 4.3 Define Assosications
db.departments.categories = db.departments.hasMany(db.categories)
db.categories.department = db.categories.belongsTo(db.departments);

db.departments.items = db.departments.hasMany(db.items);
db.items.department = db.items.belongsTo(db.departments);

db.categories.items = db.categories.hasMany(db.items);
db.items.category = db.items.belongsTo(db.categories);

// 5. INVENTORY ============================================================================================
// 5.1 Initiate Models
db.stockLedgers = (require('./inventory/stockLedger.model'))(sequelize, Sequelize);
db.stockEntries = (require('./inventory/stockEntry.model'))(sequelize, Sequelize);
// 5.2 db.length must be incremented with number of models created above
db.length += 2;

// 5.3.1 Define Assosications
db.stockLedgers.stockEntries = db.stockLedgers.hasMany(db.stockEntries);
db.stockEntries.stockLedger = db.stockEntries.belongsTo(db.stockLedgers);

// 5.3.2 Association with DOMAIN OBJECTS
db.items.stockLedger = db.items.hasOne(db.stockLedgers);
db.stockLedgers.item = db.stockLedgers.belongsTo(db.items);
db.stockLedgers.category = db.stockLedgers.belongsTo(db.categories);
db.stockLedgers.department = db.stockLedgers.belongsTo(db.departments);

// 6. BIZ OPERATIONS ============================================================================================
// 6.1 Initiate Models
db.purchases = (require('./operations/purchase.model'))(sequelize, Sequelize);
db.purchaseEntries = (require('./operations/purchaseEntry.model'))(sequelize, Sequelize);
db.purchaseReturns = (require('./operations/purchaseReturn.model'))(sequelize, Sequelize);
db.purchaseReturnEntries = (require('./operations/purchaseReturnEntry.model'))(sequelize, Sequelize);
db.sales = (require('./operations/sale.model'))(sequelize, Sequelize);
db.saleEntries = (require('./operations/saleEntry.model'))(sequelize, Sequelize);
db.saleReturns = (require('./operations/saleReturn.model'))(sequelize, Sequelize);
db.saleReturnEntries = (require('./operations/saleReturnEntry.model'))(sequelize, Sequelize);
db.cashReceipts = (require('./operations/cashReceipt.model'))(sequelize, Sequelize);
db.cashReceiptEntries = (require('./operations/cashReceiptEntry.model'))(sequelize, Sequelize);
db.orders = (require('./operations/order.model'))(sequelize, Sequelize);
db.orderEntries = (require('./operations/orderEntry.model'))(sequelize, Sequelize);

// 6.2 db.length must be incremented with number of models created above
db.length += 12;

// 6.3 Define Assosications
db.purchases.purchaseEntries = db.purchases.hasMany(db.purchaseEntries);
db.purchaseEntries.belongsTo(db.purchases);

db.suppliers.purchaseHistory = db.suppliers.hasMany(db.purchases);
db.purchases.supplier = db.purchases.belongsTo(db.suppliers);

db.items.hasMany(db.purchaseEntries);
db.purchaseEntries.item = db.purchaseEntries.belongsTo(db.items);

db.purchaseReturns.purchaseReturnEntries = db.purchaseReturns.hasMany(db.purchaseReturnEntries);
db.purchaseReturnEntries.belongsTo(db.purchaseReturns);

db.suppliers.purchasesReturned = db.suppliers.hasMany(db.purchaseReturns);
db.purchaseReturns.supplier = db.purchaseReturns.belongsTo(db.suppliers);

db.items.hasMany(db.purchaseReturnEntries);
db.purchaseReturnEntries.item = db.purchaseReturnEntries.belongsTo(db.items);

db.sales.saleEntries = db.sales.hasMany(db.saleEntries);
db.saleEntries.belongsTo(db.sales);

db.items.hasMany(db.saleEntries);
db.saleEntries.item = db.saleEntries.belongsTo(db.items);

db.saleReturns.saleReturnEntries = db.saleReturns.hasMany(db.saleReturnEntries);
db.saleReturnEntries.belongsTo(db.saleReturns);

db.items.hasMany(db.saleReturnEntries);
db.saleReturnEntries.item = db.saleReturnEntries.belongsTo(db.items);

db.cashReceipts.cashReceiptEntries = db.cashReceipts.hasMany(db.cashReceiptEntries);
db.cashReceiptEntries.belongsTo(db.cashReceipts);

// db.customers.salesHistory = db.customers.hasMany(db.cashReceipts);
// db.cashReceipts.customer = db.cashReceipts.belongsTo(db.customers);

db.suppliers.purchasesReturned = db.suppliers.hasMany(db.purchaseReturns);
db.purchaseReturns.supplier = db.purchaseReturns.belongsTo(db.suppliers);

db.sales.hasMany(db.cashReceiptEntries);
db.cashReceiptEntries.sales = db.cashReceiptEntries.belongsTo(db.sales);

db.orders.orderEntries = db.orders.hasMany(db.orderEntries);
db.orderEntries.belongsTo(db.orders);

db.items.hasMany(db.orderEntries);
db.orderEntries.item = db.orderEntries.belongsTo(db.items);

db.orders.hasMany(db.cashReceiptEntries);
db.cashReceiptEntries.orders = db.cashReceiptEntries.belongsTo(db.orders);

// --------------------------------------------------------------------
module.exports = db;