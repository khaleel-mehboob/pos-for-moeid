const getAccountByTitle = async (title) => {

  let url = '';
  if(title === 'Main Cash') {
    url = '/api/v1/accountStats/mainCashAccount'
  }
  
  if(title === 'Drawings Account') {
    url = '/api/v1/accountStats/drawingsAccount'
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

const withdrawCash = async (amount, mainCashId, drawingsId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/journal`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        entryType: 'General Entry',
        narration: `Cash withdrawal`,
        amount, 
        ledgerEntries: [
          {
            entryType: "Dr",
            amount,
            drawingsId
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

  const amount = parseFloat(document.getElementById('amount').value);
  if(amount < 1)
  {
    alert('Invalid Amount...');
    return document.getElementById('amount').focus();
  }
  
  // GET Main Account
  const mainCashAccount = await getAccountByTitle('Main Cash');
  const drawingsAccount = await getAccountByTitle('Drawings Account');
  // Check available cash balance
  if(!(mainCashAccount.balance >= 0 && mainCashAccount.balanceType === 'Dr')) {
    return showAlert('error', `Insufficient balance in ${mainCashAccount.title}`);
  }
  
  if(mainCashAccount && drawingsAccount) withdrawCash(amount, mainCashAccount.id, drawingsAccount.id);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});