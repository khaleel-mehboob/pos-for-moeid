const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/app/errorController')
const db = require("./models");
const catchAsync = require('./utils/catchAsync');

const app = express();
app.enable('trust proxy');

app.use(express.json({limit:'20kb'}));
app.use(cookieParser());
const compression = require('compression');

app.use(cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(xss())
//app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval' 'unsafe-inline' printjs-4de6.kxcdn.com cdnjs.cloudflare.com");
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,set-cookie');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Cache-Control', 'no-cache');
  next();
});;

const limiter = rateLimit({
  max: 20000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(compression());
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});


const viewsRouter = require('./routes/viewRoutes');
const authRouter = require('./routes/auth/authRoutes');
const saRouter = require('./routes/roles/saRoutes');
const userRouter = require('./routes/auth/userRoutes');
const departmentRouter = require('./routes/bizObjects/departmentRoutes');
const categoryRouter = require('./routes/bizObjects/categoryRoutes');
const itemRouter = require('./routes/bizObjects/itemRoutes');
const customerRouter = require('./routes/crm/customerRoutes');
const supplierRouter = require('./routes/supplyChain/supplierRoutes');
const accountGroupRouter = require('./routes/accounts/accountGroupRoutes');
const accountHeadRouter = require('./routes/accounts/accountHeadRoutes');
const accountSubHeadRouter = require('./routes/accounts/accountSubHeadRoutes');
const accountRouter = require('./routes/accounts/accountRoutes');
const accountStatRouter = require('./routes/accounts/accountStatRoutes');
const receiptRouter = require('./routes/accounts/receiptRoutes');
const paymentRouter = require('./routes/accounts/paymentRoutes');
const journalRouter = require('./routes/accounts/journalRoutes');
const stockLedgerRouter = require('./routes/inventory/stockLedgerRoutes');
const cashReceiptRouter = require('./routes/operations/cashReceiptRoutes');
const orderRouter = require('./routes/operations/orderRoutes');
const saleRouter = require('./routes/operations/saleRoutes');
const saleReturnRouter = require('./routes/operations/saleReturnRoutes');
const purchaseRouter = require('./routes/operations/purchaseRoutes');
const purchaseReturnRouter = require('./routes/operations/purchaseReturnRoutes');

// More to go here

app.use('/', viewsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sa', saRouter);
app.use('/api/v1/sa/users', userRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/suppliers', supplierRouter);
app.use('/api/v1/accountGroups', accountGroupRouter);
app.use('/api/v1/accountHeads', accountHeadRouter);
app.use('/api/v1/accountSubHeads', accountSubHeadRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/accountStats', accountStatRouter);
app.use('/api/v1/receipts', receiptRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/journal', journalRouter);
app.use('/api/v1/stockLedgers', stockLedgerRouter);
app.use('/api/v1/cashReceipts', cashReceiptRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/sales', saleRouter);
app.use('/api/v1/saleReturns', saleReturnRouter);
app.use('/api/v1/purchases', purchaseRouter);
app.use('/api/v1/purchaseReturns', purchaseReturnRouter);

// More to go here

try{

  (async () => {
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ 
        // force: true 
      }); 
    } else {
      await db.sequelize.sync({
        // force: true
      });
    }
    
    console.log(`DB synched (${db.length}) tables successfully...`);
  })();
} catch (err) {
  console.log(err.message);
}

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
  
module.exports = app;