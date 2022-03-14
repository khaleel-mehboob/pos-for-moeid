let purchaseEntries = [];
let itemName = '';
let itemId = '';

let supplierId = '';

const addPurchaseEntryToArray = (qty, rate) => {
  const purchaseEntry = {
    itemId: parseInt(itemId),
    itemName,
    qty,
    rate,
    subTotal: parseFloat(qty * rate)
  };

  purchaseEntries.push(purchaseEntry);

  displayPurchaseEntries();
};

const displayPurchaseEntries = () => {
  const element = document.getElementById('purchaseEntries');
  
  if(element) {
    element.innerHTML = '';

    let i = 0;
    purchaseEntries.forEach(e => {

      element.innerHTML += `
        <tr id='entry-${purchaseEntries.indexOf(e)}'>
          <td>${++i}</td>
          <td>${e.itemName}</td>
          <td>${parseFloat(e.rate).toFixed(2)}</td>
          <td>${parseFloat(e.qty).toFixed(3)}</td>
          <td>${parseFloat(e.subTotal).toFixed(2)}</td>
          <td>
            <a class='purchaseEntry' id='purchaseEntry-${purchaseEntries.indexOf(e)}' href='#'>
              <i class='fa fa-lg fa-trash'></i>
            </a>
          </td>
        </tr>
      `;

      const purchaseEntry = document.querySelectorAll('.purchaseEntry');
      purchaseEntry.forEach(e => {
        e.addEventListener('click', element => {
          removePurchaseEntry(e.id.split('-')[1]);
        });
      });
    })

    document.getElementById('purchaseEntryForm').reset();

    updatePurchaseFigures();
  }  
};

const updatePurchaseFigures = () => {
  let totalAmount = 0;

  purchaseEntries.forEach(e => {
    totalAmount += e.subTotal;
  });

  document.getElementById('totalAmount').value = parseFloat(totalAmount).toFixed(2);
};

function removePurchaseEntry(rowId) {
  if(purchaseEntries.length > rowId) {
    purchaseEntries.splice(rowId, 1);
    displayPurchaseEntries();
  }
}
  
const createPurchaseEntryForm = document.querySelector('.form-body-child').addEventListener('submit', e => {
  e.preventDefault();
  const qty = parseFloat(document.getElementById('qty').value).toFixed(2);
  const rate = parseFloat(document.getElementById('rate').value).toFixed(2);

  if(!(parseFloat(rate).toFixed(2) > 0)) {
    alert('Invalid Rate value');
    document.getElementById('rate').focus();
    return;
  }

  if(!(parseFloat(qty).toFixed(2) > 0)) {
    alert('Invalid Qty value');
    document.getElementById('qty').focus();
    return;
  }
  
  addPurchaseEntryToArray(parseFloat(qty), parseFloat(rate));
});

const itemNameElement = document.getElementById('itemName').addEventListener('input', e => {
  e.preventDefault();

  itemName = document.getElementById('itemName').value;
  const opts = document.getElementById('itemListOptions').childNodes;
  let optionSelected = false;
  let rate = '';
  
  for (let i = 0; i < opts.length; i++) {
    if(opts[i].value === itemName) {
      // An item was selected from the list!
      optionSelected = true;
      itemId = parseInt(opts[i].id.split('-')[0]);
      rate = parseFloat(opts[i].id.split('-')[1]).toFixed(2);
      break;
    }
  }

  if(optionSelected) {
    document.getElementById('rate').value = rate;
    document.getElementById('qty').focus();
  } else {
    itemName = '';
    itemId = '';
    rate = '';
    document.getElementById('rate').value = rate;
  }
});

const supplierNameElement = document.getElementById('supplierName').addEventListener('input', e => {
  e.preventDefault();

  supplierName = document.getElementById('supplierName').value;
  const opts = document.getElementById('supplierListOptions').childNodes;
  let optionSelected = false;
  
  for (let i = 0; i < opts.length; i++) {
    if(opts[i].value === supplierName) {
      // An item was selected from the list!
      optionSelected = true;
      supplierId = parseInt(opts[i].id);
      getSupplierAccountBalance(supplierId);
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
      document.getElementById('supplierNameLabel').innerText = 'Supplier Name (Bal: ' + balance + ')';
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createPurchase = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/purchases`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        supplierId,
        purchaseEntries
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/purchases');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createPurchaseForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  if(purchaseEntries.length < 1) {
    alert('Please add sale entries');
    return document.getElementById('itemName').focus();
  }

  if(!supplierId)
  {
    alert('Invalid supplier.');
    return document.getElementById('supplierName').focus();
  }

  createPurchase();
});

const resetButton = document.getElementById('resetButton').addEventListener('click', e => {
  e.preventDefault = true;
  location.assign('/purchases/create');
});