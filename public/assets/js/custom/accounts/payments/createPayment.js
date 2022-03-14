let supplierId = '';
let supplier = {};

const supplierNameElement = document.getElementById('supplierName').addEventListener('input', e => {
  e.preventDefault();
  
  supplierName = document.getElementById('supplierName').value;
  const opts = document.getElementById('supplierListOptions').childNodes;
  let optionSelected = false;
  document.getElementById('balance').innerText = 'Supplier Name';
  
  for (let i = 0; i < opts.length; i++) {
    if(opts[i].value === supplierName) {
      // An item was selected from the list!
      optionSelected = true;
      supplierId = parseInt(opts[i].id);
      getSupplierAccountBalance(supplierId)
      
      break;
    }
  }
});

const getSupplierAccountBalance = async (supplierId) => {
  try {
      const res = await axios({
      method: 'GET',
      url: `/api/v1/suppliers/${supplierId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      // set global variable later to be used to form journalEntryObj;
      supplier = res.data.data.doc;

      let balance = res.data.data.doc.account.balance;
      balance = (balance * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      balance += ' ' + res.data.data.doc.account.balanceType.substring(0, 1);
      document.getElementById('balance').innerText = 'Supplier Name (Bal: ' + balance + ')';
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createPayment = async (amount, memo) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/payments`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        supplier,
        amount,
        memo
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/payments');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createPaymentForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const memo = document.getElementById('memo').value;

  if(!supplierId)
  {
    alert('Invalid supplier.');
    return document.getElementById('supplierName').focus();
  }

  createPayment(amount, memo);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});
