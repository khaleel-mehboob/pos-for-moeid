let itemId;

let availableQty = 0;

const getItem = async e => {
  
  itemName = document.getElementById('itemName').value;
  const opts = document.getElementById('itemListOptions').childNodes;
  let optionSelected = false;
  let rate = '';
  
  for (let i = 0; i < opts.length; i++) {
    if(opts[i].value === itemName) {
      // An item was selected from the list!
      optionSelected = true;
      itemId = parseInt(opts[i].id.split('-')[0]);
      barcode = parseInt(opts[i].id.split('-')[1]);
      rate = parseFloat(opts[i].id.split('-')[2]).toFixed(2);
      break;
    }
  }
  
  if(optionSelected) {
    document.getElementById('rate').value = rate;

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
          if(res.data.data.doc.unit === 'KGs') {
            document.getElementById('qtyBlock').innerHTML = `
              <div class='row'>
                <div class='col-sm-6 form-group'>
                  <label class='form-label' id='amountLabel' for='amount'>Amount</label>
                  <input class='form-control' id='amount' type='number' value='${parseFloat(rate).toFixed(2)}' step="0.01" required="">
                </div>
                <div class='col-sm-6 form-group'>
                  <label class='form-label' id='qtyLabel' for='qty'>Qty</label>
                  <input class='form-control' id='qty' type='number' value='1.000' step="0.001" required="">
                </div>
              </div>
            `;
            document.getElementById('amount').select();
            document.getElementById('amount').addEventListener('input', async e => {
              e.preventDefault();
              
              let amount = parseFloat(document.getElementById('amount').value);
              let rate = parseFloat(document.getElementById('rate').value);
            
              if(amount > 0 && rate > 0) {
                document.getElementById('qty').value = parseFloat(amount / rate).toFixed(3);
              }
            });
          } else {
            document.getElementById('qtyBlock').innerHTML = `
              <div class='row'>
                <div class='col-sm-12 form-group'>
                  <label class='form-label' id='qtyLabel' for='qty'>Qty</label>
                  <input class='form-control' id='qty' type='number' value='1' step="1" required="">
                </div>
              </div>
            `;
            document.getElementById('qty').select();
          }
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
}

const itemNameElement = document.getElementById('itemName');
itemNameElement.addEventListener('change', async e => {
  e.preventDefault();
  await getItem();
});
itemNameElement.addEventListener('input', async e => {
  e.preventDefault();
  await getItem();
});

const createSaleEntryForm = document.querySelector('.form-body-child').addEventListener('submit', async e => {
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

  // // Use below code to enable stock Availability
  // if(qty > availableQty) {
  //   alert('Insufficient quantity in Stock');
  //   document.getElementById('qty').focus();
  //   return;
  // }
  
  await addNewSaleEntry(parseFloat(qty).toFixed(2), parseFloat(rate).toFixed(2));
  resetQtyBlock();
});

const resetQtyBlock = () => {
  document.getElementById('qtyBlock').innerHTML = `
    <div class='row'>
      <div class='col-sm-12 form-group'>
        <label class='form-label' id='qtyLabel' for='qty'>Qty</label>
        <input class='form-control' id='qty' type='number' value='0' step="" required="">
      </div>
    </div>
  `;
  document.getElementById('barcode').select();
};

const addNewSaleEntry = async(qty, rate) => {
  const saleEntry = {
    itemId: parseInt(itemId),
    qty,
    rate
  };

  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/sales/${saleId}/saleEntries`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: saleEntry
    });

    if(res.data.status === 'success') {
      document.getElementById('saleEntryForm').reset();
      getSale();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

let sale;
let saleId;
const getSale = async () => {
  saleId = location.pathname.split('/')[2]
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/sales/${saleId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      sale = res.data.data.doc;
      const amount = (sale.amount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      document.getElementById('totalAmount').value = amount;
      displaySaleEntries();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

getSale();

const displaySaleEntries = () => {
  const element = document.getElementById('saleEntries');
  
  if(element) {
    element.innerHTML = '';

    let i = 0;
    sale.saleEntries.forEach(e => {

      element.innerHTML += `
        <tr id='entry-${e.id}'>
          <td>${++i}</td>
          <td>${e.item.name}</td>
          <td class='text-end'>${(e.rate * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td class='text-end'>${(e.qty * 1).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td class='text-end'>${(e.rate * 1 * e.qty).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td>
            <a class='saleEntry' id='saleEntry-${e.id}' href='#'>
              <i class='fa fa-lg fa-trash'></i>
            </a>
          </td>
        </tr>
      `;

      const saleEntry = document.querySelectorAll('.saleEntry');
      saleEntry.forEach(e => {
        e.addEventListener('click', element => {
          removeSaleEntry(e.id.split('-')[1]);
        });
      });
    })
  }  
};

const removeSaleEntry = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/sales/${saleId}/saleEntries/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
    });

    getSale();

  } catch (err) {
    showAlert('error', err.response.data.message);
  } 
}

const updateSaleForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  if(sale.saleEntries.length < 1) {
    alert('Please add sale entries');
    return document.getElementById('itemName').focus();
  }

  const params = new URLSearchParams(window.location.search);
  const src = params.get('src');
  if(src === 'cr') return location.assign('/cashReceipts/create');
  return location.assign('/sales');
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});

const barcodeElement = document.getElementById('barcode').addEventListener('input', async e => {
  e.preventDefault();

  let val = document.getElementById('barcode').value;

  if(parseInt(val.length) >= 4) {
    const opts = document.getElementById('itemListOptions').childNodes;
    
    for (let i = 0; i < opts.length; i++) {
      if(opts[i].id.split('-')[1] === val) {
        // An item was selected from the list!
        document.getElementById('itemName').value = opts[i].value;
        await getItem();        
        break;
      }
    }
  }
});