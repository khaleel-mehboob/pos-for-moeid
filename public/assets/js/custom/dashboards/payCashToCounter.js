let accountId = '';
let accountTitle = '';

const accountTitleElement = document.getElementById('accountTitle').addEventListener('input', e => {
  e.preventDefault();

  let title = document.getElementById('accountTitle').value;
  const opts = document.getElementById('cashAccountsListOptions').childNodes;
  let optionSelected = false;
  document.getElementById('balance').innerText = 'Select Account';
  
  for (let i = 0; i < opts.length; i++) {
    if(opts[i].value === title) {
      // An item was selected from the list!
      optionSelected = true;
      accountId = parseInt(opts[i].id);
      accountTitle = opts[i].value;
      getAccountBalance(accountId)
      break;
    }
  }
});


const getAccountBalance = async (accountId) => {
  
  const account = await getAccountById(accountId);
  if(account) {
    let balance = account.balance;
    balance = (balance * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    balance += ' ' + account.balanceType.substring(0, 1);
    document.getElementById('balance').innerText = 'Salect Account (Bal: ' + balance + ')';
  }
};

const getAccountById = async (accountId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/accounts/${accountId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      return res.data.data.doc;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

const getAccountByTitle = async (title) => {

  let url = '';
  if(title === 'Main Cash') {
    url = '/api/v1/accountStats/mainCashAccount'
  }

  try {
    const res = await axios({
      method: 'GET',
      url,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      return res.data.data.doc;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

const transferCash = async (accountId, accountTitle, amount, mainCashId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/journal`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        entryType: 'General Entry',
        narration: `Paid cash to ${accountTitle}`,
        amount, 
        ledgerEntries: [
          {
            entryType: "Dr",
            amount,
            accountId 
          }, 
          {
            entryType: "Cr",
            amount,
            accountId: mainCashId 
          }
        ]
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/dashboard');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createTransferForm = document.querySelector('.form-body').addEventListener('submit', async e => {
  e.preventDefault();

  if(!accountId)
  {
    alert('Invalid Account selected.');
    return document.getElementById('accountTitle').focus();
  }

  const amount = parseFloat(document.getElementById('amount').value);
  if(amount < 1)
  {
    alert('Invalid Amount...');
    return document.getElementById('amount').focus();
  }

  // GET Main Account and check available cash balance
  const mainCashAccount = await getAccountByTitle('Main Cash');
  if(!(mainCashAccount.balance >= amount && mainCashAccount.balanceType === 'Dr')) {
    return showAlert('error', `Insufficient balance in account: ${mainCashAccount.title}`);
  }
  
  if(mainCashAccount) transferCash(accountId, accountTitle, amount, mainCashAccount.id);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});

