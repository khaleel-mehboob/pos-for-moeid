const fs = require('fs');
const faker = require('faker');

const db = require("../../models");
const catchAsync = require('../../utils/catchAsync');
const { sequelize } = require('../../models');
const AppError = require('../../utils/appError');

exports.setup = catchAsync(async (req, res, next) => {

  // SETUP - AUTHENTICATION 
  const users = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/default-users.json`));
  const inserted_users = await db.users.bulkCreate(users);
  
  // SETUP - BUSINESS OBJECTS
  const departments = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/default-departments.json`));
  const inserted_departments = await db.departments.bulkCreate(departments);
  // INCREASE value of "noOfBizObjects" with the number of BizObjects created above. 
  const noOfBizObjects = 1;
  
  // SETUP - ACCOUNTS MODULE DEFAULT SETTING
  const accountHeads = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/accounts/default-heads.json`));
  const accountSubHeads = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/accounts/default-subHeads.json`));
  const accounts = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/accounts/default-accounts.json`));

  const inserted_heads = await db.accountHeads.bulkCreate(accountHeads);
  const inserted_subHeads = await db.accountSubHeads.bulkCreate(accountSubHeads);
  const inserted_accounts = await db.accounts.bulkCreate(accounts);

  const data = {
    defaultUsers: {
      results: inserted_users.length,
      data: inserted_users
    },
    defaultBizObjects: {
      noOfBizObjects: noOfBizObjects,
      data: {
        // Add below data for each BizObject
        departments: {
          results: inserted_departments.length,
          data: inserted_departments
        },
        // MORE Biz Objects go here
      } 
    },
    defaultAccounts: {
      results: inserted_accounts.length,
      data: inserted_accounts
    }
  }

  res.status(200).json(
    {
      status: 'success',
      message: 'Succussfuly created setup. System Ready to be used Instantly.',
      data
    }
  );
});


exports.setupCategories = catchAsync(async (req, res, next) => {

  const categories = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/default-categories.json`));
  const inserted_categories = await db.categories.bulkCreate(categories);

  res.status(200).json(
    {
      status: 'success',
      message: 'Succussfuly created Categories...',
      data: {
        results: inserted_categories.length,
        categories: inserted_categories
      }
    }
  );
});

exports.setupItems = catchAsync(async (req, res, next) => {
  const result = await sequelize.transaction( async (t) => {
    const items = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/default-items.json`));
    const inserted_items = await db.items.bulkCreate(items);
  
    let stockLedgers = [];
    let item;
    for(let i = 0; i < inserted_items.length; i++)
    {
      item = inserted_items[i];
      item.stockLedger = { itemId: item.id, currentQty: item.currentQty, movingAverage: item.movingAverage, categoryId: item.categoryId, departmentId: item.departmentId };
      stockLedgers.push(item.stockLedger);
    }
    const inserted_stockLedgers = await db.stockLedgers.bulkCreate(stockLedgers, { transaction: t });
    return items;
  });

  res.status(200).json(
    {
      status: 'success',
      message: 'Succussfuly created items...',
      data: {
        results: result.length,
        items: result
      }
    }
  );
});