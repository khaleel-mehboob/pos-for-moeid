const createJournalEntry = async (entryType, narration, amount) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/journal`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        entryType, narration, amount, ledgerEntries
      }
    });

    // console.log(ledgerEntries);

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/journal');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

let ledgerEntries = [];

const addLedgerEntryToArray = (entryType, accountId, accountTitle, amount) => {
  const ledgerEntry = {
    entryType,
    accountId,
    accountTitle,
    amount
  };

  ledgerEntries.push(ledgerEntry);

  displayLedgerEntries();
};

const displayLedgerEntries = () => {
  const element = document.getElementById('ledgerEntries');
  
  if(element) {
    element.innerHTML = '';

    let debitAmount = 0;
    let creditAmount = 0;

    ledgerEntries.forEach(e => {

      
      if(e.entryType === 'Dr') debitAmount = e.amount;
      if(e.entryType === 'Cr') creditAmount = e.amount;

      debitAmount = (debitAmount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      creditAmount = (creditAmount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

      element.innerHTML += `
        <tr id='entry-${ledgerEntries.indexOf(e)}'>
          <td>${e.entryType}</td>
          <td>${e.accountTitle}</td>
          <td class='text-end'>${debitAmount}</td>
          <td class='text-end'>${creditAmount}</td>
          <td>
            <a class='ledgerEntry' id='ledgerEntry-${ledgerEntries.indexOf(e)}' href='#'>
              <i class='fa fa-lg fa-trash'></i>
            </a>
          </td>
        </tr>
      `;

      debitAmount = 0;
      creditAmount = 0;

      const ledgerEntry = document.querySelectorAll('.ledgerEntry');
      ledgerEntry.forEach(e => {
        e.addEventListener('click', element => {
          removeLedgerEntry(e.id.split('-')[1]);
        });
      });
    })


    document.getElementById('accountLabel').textContent = 'A/c';
    document.getElementById('ledgerEntryForm').reset();
  }  
};

function removeLedgerEntry(rowId) {
  if(ledgerEntries.length > rowId) {
    ledgerEntries.splice(rowId, 1);
    displayLedgerEntries();
  }
}
  
const createLedgerEntryForm = document.querySelector('.form-body-child').addEventListener('submit', e => {
  e.preventDefault();
  const entryType = document.getElementById('ledgerEntryType').value;
  
  const element = document.getElementById('ledgerEntryAccount');
  const accountId = element.value;
  const accountTitle = element.options[element.selectedIndex].text;
  
  const amount = document.getElementById('ledgerEntryAmount').value;

  addLedgerEntryToArray(entryType, accountId, accountTitle, parseFloat(amount));
});

const createJournalEntryForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  const entryType = document.getElementById('journalEntryType').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const narration = document.getElementById('narration').value;

  if(ledgerEntries.length < 1) {
    alert('Please add ledger entries');
    return document.getElementById('ledgerEntryType').focus();
  }

  if(!ledgerEntriesBalanceEqual(amount)) {
    alert('Ledger entrie amount not equal to Journal Entry amount.');
    return document.getElementById('ledgerEntryType').focus();
  }

  createJournalEntry(entryType, narration, amount);
});

const ledgerEntriesBalanceEqual = (amount) => {
  let debitAmount = 0;
  let creditAmount = 0;

  ledgerEntries.forEach(e => {
    if(e.entryType === 'Dr') {
      debitAmount += e.amount;
    }

    if(e.entryType === 'Cr') {
      creditAmount += e.amount;
    }
  });

  if(debitAmount !== creditAmount) return false;
  if(debitAmount !== creditAmount || creditAmount !== amount) return false;

  return true;
}

const resetButton = document.getElementById('resetButton').addEventListener('click', e => {
  e.preventDefault = true;
  location.assign('/journal/create');
});



const ledgerEntryAccount = document.getElementById('ledgerEntryAccount').addEventListener('change', e => {
  e.preventDefault = true;
  
  accountId = document.getElementById('ledgerEntryAccount').value;
  getAccountBalance(accountId)
});

const getAccountBalance = async (accountId) => {

  try {
      const res = await axios({
      method: 'GET',
      url: `/api/v1/accounts/${accountId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      // set global variable later to be used to form journalEntryObj;
      let account = res.data.data.doc;

      let balance = account.balance;
      balance = (balance * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      balance += ' ' + account.balanceType.substring(0, 1);
      document.getElementById('accountLabel').innerText = 'A/c (' + balance + ')';
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
