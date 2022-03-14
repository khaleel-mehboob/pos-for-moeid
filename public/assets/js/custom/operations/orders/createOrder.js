let orderEntries = [];
let itemName = '';
let itemId = '';

let availableQty = 0;

const addOrderEntryToArray = (qty, rate) => {
  const orderEntry = {
    itemId: parseInt(itemId),
    itemName,
    qty,
    rate,
    subTotal: qty * rate
  };

  orderEntries.push(orderEntry);

  displayOrderEntries();
};

const displayOrderEntries = () => {
  const element = document.getElementById('orderEntries');
  
  if(element) {
    element.innerHTML = '';

    let i = 0;
    orderEntries.forEach(e => {

      element.innerHTML += `
        <tr id='entry-${orderEntries.indexOf(e)}'>
          <td>${++i}</td>
          <td>${e.itemName}</td>
          <td class='text-end'>${(e.rate * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td class='text-end'>${(e.qty * 1).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td class='text-end'>${(e.subTotal * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td>
            <a class='orderEntry' id='orderEntry-${orderEntries.indexOf(e)}' href='#'>
              <i class='fa fa-lg fa-trash'></i>
            </a>
          </td>
        </tr>
      `;

      const orderEntry = document.querySelectorAll('.orderEntry');
      orderEntry.forEach(e => {
        e.addEventListener('click', element => {
          removeOrderEntry(e.id.split('-')[1]);
        });
      });
    })

    document.getElementById('orderEntryForm').reset();
    document.getElementById('qtyLabel').innerText = 'Qty';
    document.getElementById('qty').value = '0.00';

    updateOrderFigures();
  }  
};

const updateOrderFigures = () => {
  let totalAmount = 0;

  orderEntries.forEach(e => {
    totalAmount += e.subTotal;
  });

  let advancePayment = parseFloat(document.getElementById('advancePayment').value).toFixed(2);
  let remainingAmount = totalAmount - advancePayment * 1;
  
  totalAmount = totalAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('totalAmount').innerHTML = totalAmount;

  remainingAmount = remainingAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('remainingAmount').value = remainingAmount
};

function removeOrderEntry(rowId) {
  if(orderEntries.length > rowId) {
    orderEntries.splice(rowId, 1);
    displayOrderEntries();
  }
}
  
const createOrderEntryForm = document.querySelector('.form-body-child').addEventListener('submit', e => {
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
  
  addOrderEntryToArray(parseFloat(qty).toFixed(2), parseFloat(rate).toFixed(2));
  document.getElementById('itemName').focus();
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
    document.getElementById('qty').value = '1.00';
    document.getElementById('qty').select();

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

const advancePaymentField = document.getElementById('advancePayment').addEventListener('input', e => {
  updateOrderFigures();
});

const createOrder = async (customerName, contactNo, advancePayment, status, deliveryMethod, remarks) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/orders`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        customerName, contactNo, advancePayment, status, deliveryMethod, remarks, orderEntries
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        printInvoice('orders', res.data.data, orderEntries);
        location.assign('/dashboard');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createOrderForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  const customerName = document.getElementById('customerName').value;
  const contactNo = document.getElementById('contactNo').value;
  const advancePayment= document.getElementById('advancePayment').value;
  const status = 'Booked';
  const deliveryMethodElement = document.getElementById('deliveryMethod');
  const deliveryMethod= deliveryMethodElement.options[deliveryMethodElement.selectedIndex].text;
  const remarks = document.getElementById('remarks').value;

  if(orderEntries.length < 1) {
    alert('Please add order entries');
    return document.getElementById('itemName').focus();
  }

  let totalAmount = 0;
  orderEntries.forEach(e => {
    totalAmount += e.subTotal;
  });

  let advance = parseFloat(document.getElementById('advancePayment').value).toFixed(2);

  if((advance * 1) > totalAmount) {
    alert('Advance payment cannot be greate than Total Amount');
    return document.getElementById('advancePayment').select();
  }

  createOrder(customerName, contactNo, advancePayment, status, deliveryMethod, remarks);
});

const resetButton = document.getElementById('resetButton').addEventListener('click', e => {
  e.preventDefault = true;
  location.assign('/orders/create');
});