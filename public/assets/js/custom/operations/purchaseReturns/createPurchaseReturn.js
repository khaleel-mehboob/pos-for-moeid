let purchaseReturnEntries = [];
let itemName = '';
let itemId = '';

let availableQty = 0;

let supplierId = '';

const addPurchaseReturnEntryToArray = (qty, rate) => {
  const purchaseReturnEntry = {
    itemId: parseInt(itemId),
    itemName,
    qty,
    rate,
    subTotal: qty * rate
  };

  purchaseReturnEntries.push(purchaseReturnEntry);

  displayPurchaseReturnEntries();
};

const displayPurchaseReturnEntries = () => {
  const element = document.getElementById('purchaseReturnEntries');
  
  if(element) {
    element.innerHTML = '';

    let i = 0;
    purchaseReturnEntries.forEach(e => {

      element.innerHTML += `
        <tr id='entry-${purchaseReturnEntries.indexOf(e)}'>
          <td>${++i}</td>
          <td>${e.itemName}</td>
          <td>${e.rate}</td>
          <td>${e.qty}</td>
          <td>${e.subTotal}</td>
          <td>
            <a class='purchaseReturnEntry' id='purchaseReturnEntry-${purchaseReturnEntries.indexOf(e)}' href='#'>
              <i class='fa fa-lg fa-trash'></i>
            </a>
          </td>
        </tr>
      `;

      const purchaseReturnEntry = document.querySelectorAll('.purchaseReturnEntry');
      purchaseReturnEntry.forEach(e => {
        e.addEventListener('click', element => {
          removePurchaseReturnEntry(e.id.split('-')[1]);
        });
      });
    })

    document.getElementById('purchaseReturnEntryForm').reset();

    updatePurchaseReturnFigures();
  }  
};

const updatePurchaseReturnFigures = () => {
  let totalAmount = 0;

  purchaseReturnEntries.forEach(e => {
    totalAmount += e.subTotal;
  });

  document.getElementById('totalAmount').value = totalAmount;
};

function removePurchaseReturnEntry(rowId) {
  if(purchaseReturnEntries.length > rowId) {
    purchaseReturnEntries.splice(rowId, 1);
    displayPurchaseReturnEntries();
  }
}
  
const createPurchaseReturnEntryForm = document.querySelector('.form-body-child').addEventListener('submit', e => {
  e.preventDefault();
  const qty = parseFloat(document.getElementById('qty').value);
  const rate = parseFloat(document.getElementById('rate').value);

  if(!(rate > 0)) {
    alert('Invalid Rate value');
    document.getElementById('rate').focus();
    return;
  }

  if(!(qty > 0)) {
    alert('Invalid Qty value');
    document.getElementById('qty').focus();
    return;
  }

  if(qty >  availableQty) {
    alert('Insufficient quantity in Stock');
    document.getElementById('qty').focus();
    return;
  }
  
  addPurchaseReturnEntryToArray(parseFloat(qty).toFixed(2), parseFloat(rate).toFixed(2));
});

const itemNameElement = document.getElementById('itemName').addEventListener('input', async e => {
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


    // Get Item ledger
    // and check display available quantity
    // Only proceed if available quantity is greater than or equal to the quatity being returned
    if(itemId) {
      try {
        const res = await axios({
          method: 'GET',
          url: `/api/v1/items/${itemId}`,
          // credentials: 'include',
          mode: 'cors',
          withCredentials: true
        });
    
        if(res.data.status === 'success') {
          availableQty = parseFloat(res.data.data.doc.stockLedger.currentQty);
          document.getElementById('qtyLabel').innerText = `Qty (${availableQty})`;        
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
    }

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

const createPurchaseReturn = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/purchaseReturns`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        supplierId,
        purchaseReturnEntries
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/purchaseReturns');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createPurchaseReturnForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  if(purchaseReturnEntries.length < 1) {
    alert('Please add sale entries');
    return document.getElementById('itemName').focus();
  }

  if(!supplierId)
  {
    alert('Invalid supplier.');
    return document.getElementById('supplierName').focus();
  }

  createPurchaseReturn();
});

const resetButton = document.getElementById('resetButton').addEventListener('click', e => {
  e.preventDefault = true;
  location.assign('/purchaseReturns/create');
});