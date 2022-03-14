let customerId = '';
let customer = {};

const customerNameElement = document.getElementById('customerName').addEventListener('input', e => {
  e.preventDefault();

  customerName = document.getElementById('customerName').value;
  const opts = document.getElementById('customerListOptions').childNodes;
  let optionSelected = false;
  document.getElementById('balance').innerText = 'Customer Name';
  
  for (let i = 0; i < opts.length; i++) {
    if(opts[i].value === customerName) {
      // An item was selected from the list!
      optionSelected = true;
      customerId = parseInt(opts[i].id);
      getCustomerAccountBalance(customerId)
      break;
    }
  }
});

const getCustomerAccountBalance = async (custmerId) => {
  try {
      const res = await axios({
      method: 'GET',
      url: `/api/v1/customers/${customerId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      // set global variable later to be used to form journalEntryObj;
      customer = res.data.data.doc;

      let balance = res.data.data.doc.account.balance;
      balance = (balance * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      balance += ' ' + res.data.data.doc.account.balanceType.substring(0, 1);
      document.getElementById('balance').innerText = 'Customer Name (Bal: ' + balance + ')';
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createReceipt = async (amount, memo) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/receipts`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        customer,
        amount,
        memo
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/receipts');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createReceiptForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  const amount = document.getElementById('amount').value;
  const memo = document.getElementById('memo').value;

  if(!customerId)
  {
    alert('Invalid customer.');
    return document.getElementById('customerName').focus();
  }

  createReceipt(amount, memo);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});

