let itemId;
let availableQty = 0;

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

  addNewOrderEntry(parseFloat(qty).toFixed(2), parseFloat(rate).toFixed(2));
  document.getElementById('itemName').focus();;
});

const addNewOrderEntry = async(qty, rate) => {
  const orderEntry = {
    itemId: parseInt(itemId),
    qty,
    rate
  };

  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/orders/${orderId}/orderEntries`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: orderEntry
    });

    if(res.data.status === 'success') {
      document.getElementById('orderEntryForm').reset();
      document.getElementById('qtyLabel').innerText = 'Qty';
      document.getElementById('qty').value = '0.00';
      getOrder();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

let order;
let orderId;
const getOrder = async () => {
  orderId = location.pathname.split('/')[2]
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/orders/${orderId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      order = res.data.data.doc;
      displayOrder();
      displayOrderEntries();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

getOrder();

const displayOrder = () => {
  document.getElementById('deliveryMethod').value = order.deliveryMethod;
  document.getElementById('customerName').value = order.customerName;
  document.getElementById('contactNo').value = order.contactNo;
  const amount = (order.amount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('totalAmount').innerHTML = amount;
  const advancePayment = (order.advancePayment * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('advancePayment').value = advancePayment;
  const remainingAmount = (order.remainingAmount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('remainingAmount').value = remainingAmount;
  document.getElementById('remarks').innerText = order.remarks;
};

const displayOrderEntries = () => {
  const element = document.getElementById('orderEntries');
  
  if(element) {
    element.innerHTML = '';

    let i = 0;
    order.orderEntries.forEach(e => {

      element.innerHTML += `
        <tr id='entry-${e.id}'>
          <td>${++i}</td>
          <td>${e.item.name}</td>
          <td class='text-end'>${(e.rate * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td class='text-end'>${(e.qty * 1).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td class='text-end'>${(e.rate * 1 * e.qty).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
          <td>
            <a class='orderEntry' id='orderEntry-${e.id}' href='#'>
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
  }  
};

const removeOrderEntry = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/orders/${orderId}/orderEntries/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
    });

    getOrder();

  } catch (err) {
    showAlert('error', err.response.data.message);
  } 
}

const updateOrderForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  if(order.orderEntries.length < 1) {
    alert('Please add order entries');
    return document.getElementById('itemName').focus();
  }

  const customerName = document.getElementById('customerName').value;
  const contactNo = document.getElementById('contactNo').value;
  const deliveryMethodElement = document.getElementById('deliveryMethod');
  const deliveryMethod= deliveryMethodElement.options[deliveryMethodElement.selectedIndex].text;
  const remarks = document.getElementById('remarks').value;  

  if(order.orderEntries.length < 1) {
    alert('Please add order entries');
    return document.getElementById('itemName').focus();
  }

  updateOrder(customerName, contactNo, deliveryMethod, remarks);
});

const updateOrder = async (customerName, contactNo, deliveryMethod, remarks) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/orders/${orderId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        customerName, contactNo, deliveryMethod, remarks
      }
    });

    if(res.data.status === 'success') {
      const params = new URLSearchParams(window.location.search);
      const src = params.get('src');
      if(src === 'cr') return location.assign('/cashReceipts/create');
      return location.assign('/orders');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});