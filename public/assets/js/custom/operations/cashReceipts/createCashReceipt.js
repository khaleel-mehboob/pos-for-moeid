let cashReceiptEntries = [];

const addEntryToArray = (type, id, obj) => {

  let entry;
  if(type === 'sales') {
    
    entry = {
      type,
      saleId: parseInt(id),
      amount: obj.amount
    };
  }

  if(type === 'orders') {
    
    entry = {
      type,
      orderId: parseInt(id),
      amount: obj.remainingAmount
    };
  }

  cashReceiptEntries.push(entry);
  updateFigures();
};

const removeEntryFromArray = (type, id) => {
  
  for (let i = 0; i < cashReceiptEntries.length; i++) {
    
    // type = 'sales'
    if(type === 'sales' && cashReceiptEntries[i].type === 'sales') {
      if(cashReceiptEntries[i].saleId === id * 1) {
        cashReceiptEntries.splice(i, 1);
        break;
      }
    }

    // type = 'orders'
    if(type === 'orders' && cashReceiptEntries[i].type === 'orders') {
      if(cashReceiptEntries[i].orderId === id * 1) {
        cashReceiptEntries.splice(i, 1);
        break;
      }
    }
  }

  updateFigures();
}

const updateFigures = () => {

  let totalAmount = 0;

  cashReceiptEntries.forEach(e => {
    totalAmount += e.amount * 1;
  });

  let discount = parseFloat(document.getElementById('discount').value).toFixed(2);
  let netTotal = totalAmount - discount;

  document.getElementById('totalAmount').innerText = parseFloat(totalAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
  document.getElementById('netTotal').value = parseFloat(netTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;

  let paidAmount = parseFloat(document.getElementById('paidAmount').value).toFixed(2);
  if(paidAmount > netTotal) {
    let balancePaid = paidAmount - netTotal;
    document.getElementById('balancePaid').value = parseFloat(balancePaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    document.getElementById('balancePaid').value = '0.00';
  }
};

const cancelSaleClass = document.querySelectorAll('.cancelSale');
cancelSaleClass.forEach(e => {
  e.addEventListener('click', element => {
    cancelSale(e.id);
  });
});

const cancelSale = async (saleId) => {
  const res = confirm(`Are you sure you want to cancel Sale Id: ${saleId} ?`);
  if(res === true) {
    try {
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/sales/${saleId}`,
        // credentials: 'include',
        mode: 'cors',
        withCredentials: true,
        data: {
          status: 'Cancelled'
        }
      });
  
      if(res.data.status === 'success') {
        const el = document.getElementById(`S-${saleId}`);
        if(el) el.parentElement.removeChild(el);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  }
}

const addSaleClass = document.querySelectorAll('.addSale');
addSaleClass.forEach(e => {
  e.addEventListener('click', element => {
    addEntry('sales', e.id);
  });
});

const getObject = async (type, id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/${type}/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      const obj = res.data.data.doc;
      return obj;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

const removeObjectVisually = (type, id) => {
    // Visually Remove selected Object
  let el;
  if(type === 'sales') el = document.getElementById(`S-${id}`);
  if(type === 'orders') el = document.getElementById(`O-${id}`);
  if(el) el.parentElement.removeChild(el);
}

const catchStatusIssues = (obj, type, id) => {
  // Catch any status issues
  if(type === 'sales' && obj.status !== 'Un-paid')
  {
    return showAlert('error', `Cannot process Sale.... It has already been ${obj.status}`);
  }

  if(type === 'orders' && (obj.status === 'Cancelled' || obj.status === 'Delivered'))
  {
    return showAlert('error', `Cannot process Order.... It has already been ${obj.status}`);
  }
}

const visuallyAddCashReceiptEntry = (obj, type, id) => {

  // Get a reference to the table
  let tableRef = document.getElementById('cashReceiptEntries');
  // Insert a row at the end of the table
  const row = document.createElement('tr');
  
  if(type === 'sales') {
    row.setAttribute('id', `S-${obj.id}`);
    row.innerHTML = `
    <td>
    S-${obj.id}
    </td>
    <td class='text-end'>
    ${parseFloat(obj.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
    </td>
    <td>
    <a class='removeSale' href='javascript:;' onclick='removeEntry("sales", "${obj.id}")' title='Remove Sale'>
    <i class='bx bx-sm bx-right-arrow-circle text-primary'> </i>
    </a>
    </td>
    `;
  } else {
    // type = 'orders'
    row.setAttribute('id', `O-${obj.id}`);
    row.innerHTML = `
    <td>
    O-${obj.id}
    </td>
    <td class='text-end'>
    ${parseFloat(obj.remainingAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
    </td>
      <td>
        <a class='removeOrder' href='javascript:;' onclick='removeEntry("orders", "${obj.id}")' title='Remove Order'>
          <i class='bx bx-sm bx-right-arrow-circle text-primary'> </i>
        </a>
      </td>
    `;
  }
  tableRef.appendChild(row);
}

const addEntry = async (type, id) => {

  const obj = await getObject(type, id);
  if(obj) {
    // Sale to local array for calculation purposes
    addEntryToArray(type, id, obj);      
    // Remove visual element (Sale / Order)
    removeObjectVisually(type, id);
    // Catch any status issues
    catchStatusIssues(obj, type, id);
    // Add entry as Cash Receipt Entry
    visuallyAddCashReceiptEntry(obj, type, id);
  }
}

const visuallyAddObject = (type, obj) => {
  if(type === 'sales') {
      
    // Get a reference to the table
    let tableRef = document.getElementById('pendingSales');
    // Insert a row at the end of the table
    const row = document.createElement('tr');
    tableRef.appendChild(row);
    row.setAttribute('id', `S-${obj.id}`);
    
    let dateString = moment(obj.createdAt).format('DD-MM-YYYY');
    let timeString = moment(obj.createdAt).format('hh:mm:ss A');
    let col1 = document.createElement('td');
    row.appendChild(col1);
    col1.innerHTML = `
      <div class='d-flex align-items-center'>
        <div class='ms-2'>
          <h6 class='mb-1 font-14'> 
            ${dateString}
          </h6>
          <p class='mb-0 font-13 text-secondary'> 
            ${timeString}
          </p>
        </div>
      </div>
    `;

    let col2 = document.createElement('td');
    row.appendChild(col2);
    col2.innerHTML = `
      <div class='d-flex align-items-center text-danger'>
        <i class='bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1'></i>
        <span> ${obj.status}</span>
      </div>
    `;

    let amount = (obj.amount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let col3 = document.createElement('td');
    col3.setAttribute('class', 'text-end');
    row.appendChild(col3);
    col3.innerText = `${amount}`;

    let col4 = document.createElement('td');
    row.appendChild(col4);
    col4.innerHTML = `
      <div class='d-flex'>
        <a href='/sales/${obj.id}/show' title='View Sale'>
          <i class='bx bx-sm bx-show-alt text-primary'></i>
        </a>
        <a href='/sales/${obj.id}/edit?src=cr' title='Edit Sale'>
          <i class='bx bx-sm bx-pencil text-primary'></i>
        </a>
        <a class='cancelSale' id='${obj.id}' href='javascript:;' onclick='cancelSale(${obj.id})' title='Cancel Sale'>
          <i class='bx bx-sm bx-minus-circle text-primary'></i>
        </a>
        <a class='addSale' id='${obj.id}' href='javascript:;' onclick='addEntry("sales", ${obj.id})' title='Add to Receipt'>
          <i class='bx bx-sm bx-left-arrow-circle text-primary'></i>
        </a>
      </div>
    `;    
  } 
  else {
    // type = 'orders'
    
    // Get a reference to the table
    let tableRef = document.getElementById('pendingOrders');
    // Insert a row at the end of the table
    const row = document.createElement('tr');
    tableRef.appendChild(row);
    
    row.setAttribute('id', `O-${obj.id}`);
    
    let dateString = moment(obj.createdAt).format('DD-MM-YYYY');
    let timeString = moment(obj.createdAt).format('hh:mm:ss A');

    let col1 = document.createElement('td');
    row.appendChild(col1);
    col1.innerHTML = `
      <div class='d-flex align-items-center'>
        <div class='ms-2'>
          <h6 class='mb-1 font-14'> 
            ${dateString}
          </h6>
          <p class='mb-0 font-13 text-secondary'> 
            ${timeString}
          </p>
        </div>
      </div>
    `;

    let status = '';
    if(obj.status === 'Booked') status = `<div class="d-flex align-items-center text-danger"><i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i><span>Booked</span></div>`;
    if(obj.status === 'In-process') status = `<div class="d-flex align-items-center text-primary"><i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i><span>In-process</span></div>`;
    if(obj.status === 'Ready') status = `<div class="d-flex align-items-center text-success"><i class="bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1"></i><span>Ready</span></div>`;

    let col2 = document.createElement('td');
    row.appendChild(col2);
    col2.innerHTML = `${status}`;

    let delMethod = '';
    if(obj.deliveryMethod === 'Self-collection') delMethod = '<div class="badge rounded-pill bg-primary">Self-collection</div>';
    if(obj.deliveryMethod === 'Delivery Boy') delMethod = '<div class="badge rounded-pill bg-warning">Delivery Boy</div>';
    if(obj.deliveryMethod === 'Food Panda') delMethod = '<div class="badge rounded-pill bg-danger">Food Panda</div>';

    let col3 = document.createElement('td');
    row.appendChild(col3);
    col3.innerHTML = `${delMethod}`;

    let remainingAmount = (obj.remainingAmount * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let col4 = document.createElement('td');
    col4.setAttribute('class', 'text-end');
    row.appendChild(col4);
    col4.innerText = `${remainingAmount}`;

    let col5 = document.createElement('td');
    row.appendChild(col5);
    col5.innerHTML = `
      <h6 class='mb-0 font-14'>${obj.customerName}</h6>
      <p class='mb-0 font-13 text-secondary'>${obj.contactNo}</p>
    `;

    let col6 = document.createElement('td');
    row.appendChild(col6);
    col6.innerHTML = `
      <div class='d-flex text-secondary'>
        <a href='/orders/${obj.id}/show' title='View Order'>
          <i class='bx bx-sm bx-show-alt text-primary'></i>
        </a>
        <a href='/orders/${obj.id}/edit?src=cr' title='Edit Order'>
          <i class='bx bx-sm bx-pencil text-primary'></i>
        </a>
        <a href='/orders/${obj.id}/cancel?src=cr' title='Cancel Order'>
          <i class='bx bx-sm bx-minus-circle text-primary'></i>
        </a>
        <a class='inProcessOrder' id='${obj.id}' href='javascript:;' onclick='changeOrderStatus(${obj.id}, "In-process")' title='Mark as In-process'>
          <i class='bx bx-sm bx-cog text-primary'></i>
        </a>
        <a class='readyOrder' id='${obj.id}' href='javascript:;' onclick='changeOrderStatus(${obj.id}, "Ready");' title='Mark as Ready'>
          <i class='bx bx-sm bx-check-circle text-primary'></i>
        </a>
        <a class='addOrder' id='${obj.id}' href='javascript:;' onclick='addEntry("orders", ${obj.id})' title='Add to Receipt'>
          <i class='bx bx-sm bx-left-arrow-circle text-primary'></i>
        </a>
      </div>
    `;
  }
}

const removeEntry = async (type, id) => {
  
  // Remove from local array for calculation purposes
  const obj = await getObject(type, id);
  
  if(obj) {
    // Remove entry from local array
    removeEntryFromArray(type, id);
    // Remove visual element (Sale / Order)
    removeObjectVisually(type, id);
    // Catch any status issues
    catchStatusIssues(obj, type, id);
    // Add entry as Cash Receipt Entry
    visuallyAddObject(type, obj);
  } 
}

const inProcessOrderClass = document.querySelectorAll('.inProcessOrder');
inProcessOrderClass.forEach(e => {
  e.addEventListener('click', element => {
    changeOrderStatus(e.id, 'In-process');
  });
});

const readyOrderClass = document.querySelectorAll('.readyOrder');
readyOrderClass.forEach(e => {
  e.addEventListener('click', element => {
    changeOrderStatus(e.id, 'Ready');
  });
});

const changeOrderStatus = async (orderId, status) => {
  const res = confirm(`Are you sure you want to mark Order Id: ${orderId} as '${status}' ?`);
  if(res === true) {
    try {
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/orders/${orderId}`,
        // credentials: 'include',
        mode: 'cors',
        withCredentials: true,
        data: {
          status
        }
      });
  
      if(res.data.status === 'success') {
        const el = document.getElementById(`O-${orderId}`).childNodes[1];

        if(status === 'In-process') {
          el.innerHTML = `
            <div class='d-flex align-items-center text-primary'>
              <i class='bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18 me-1'></i>
              <span>In-process</span>
            </div>
          `;
        }

        if(status === 'Ready') {
          el.innerHTML = `
            <div class='d-flex align-items-center text-success'>
              <i class='bx bx-radio-circle-marked bx-burst bx-rotate-90 align-middle font-18.me-1'></i>
              <span>Ready</span>
            </div>
          `;
        }
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  }
}

const addOrderClass = document.querySelectorAll('.addOrder');
addOrderClass.forEach(e => {
  e.addEventListener('click', element => {
    addEntry('orders', e.id);
  });
});

const discount = document.getElementById('discount').addEventListener('input', e => {
  updateFigures();
});

const paidAmount = document.getElementById('paidAmount').addEventListener('input', e => {
  updateFigures();
});

const resetButton = document.getElementById('resetButton').addEventListener('click', e => {
  e.preventDefault = true;
  location.assign('/cashReceipts/create');
});

const createCashReceipt = async (totalAmount, discount, netTotal, paymentMode, paymentData) => {

  let data = {
    totalAmount, discount, netTotal, paymentMode, paymentData, cashReceiptEntries
  };

  if(paymentMode === 'Cash') {
    data.paidAmount = paymentData.paidAmount;
    data.balancePaid = paymentData.balancePaid;
  }

  let customer;
  if(paymentMode === 'Credit') {
    data.customerId = paymentData.customer.id;
    customer = paymentData.customer;
  }

  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/cashReceipts`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        let operation = res.data.data
        operation.customer = customer;
  
        printInvoice('cashReceipts', operation, cashReceiptEntries);
        location.assign('/dashboard');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createCashReceiptForm = document.querySelector('.form-body').addEventListener('submit', async e => {
  e.preventDefault();

  if(cashReceiptEntries.length < 1) {
    alert('Please add cash receipt entries');
    return;
  }

  let totalAmount = 0;

  cashReceiptEntries.forEach(e => {
    totalAmount += e.amount * 1;
  });

  let discount = parseFloat(document.getElementById('discount').value);
  let netTotal = totalAmount - discount;

  let paymentData = {};
  if(paymentMode === 'Cash') {
    paymentData.paidAmount = parseFloat(document.getElementById('paidAmount').value);
    paymentData.balancePaid = parseFloat(0);
  }
  
  if(paymentMode === 'Cash' && paymentData.paidAmount < netTotal) {
    alert('Paid Amount is less than Net Total');
    document.getElementById('paidAmount').select();
    return;
  }
  
  if(paymentMode === 'Cash' && paymentData.paidAmount > netTotal) {
    paymentData.balancePaid = parseFloat(paymentData.paidAmount - netTotal);
  } 
  
  if(paymentMode === 'Credit') {
    paymentData.customer = customer;
  }

  if(paymentMode === 'Credit' && (!customer)) {
    alert('Invalid Customer');
    document.getElementById('customerName').select();
    return;
  }

  // validateStockAvailability(cashReceiptEntries);

  createCashReceipt(totalAmount, discount, netTotal, paymentMode, paymentData);
});


//   // Validate stock availability
// const validateStockAvailability = (cashReceiptEntries) => {
//   let entry;
//   let entries;
//   let res;

//   let qty = 0;
//   let availableQty = 0;

//   for(let i = 0; i < cashReceiptEntries.length; i++) {
//     if(cashReceiptEntries[i].type === 'sales') {
//       try {
//         res = await axios({
//           method: 'GET',
//           url: `/api/v1/sales/${cashReceiptEntries[i].saleId}`,
//           // credentials: 'include',
//           mode: 'cors',
//           withCredentials: true
//         });
    
//         if(res.data.status === 'success') {
//           entry = res.data.data.doc;
//         }
//       } catch (err) {
//         showAlert('error', err.response.data.message);
//       }
//       entries = entry.saleEntries;
//     }
    
//     if(cashReceiptEntries[i].type === 'orders') {
//       try {
//         res = await axios({
//           method: 'GET',
//           url: `/api/v1/orders/${cashReceiptEntries[i].orderId}`,
//           // credentials: 'include',
//           mode: 'cors',
//           withCredentials: true
//         });
    
//         if(res.data.status === 'success') {
//           entry = res.data.data.doc;
//         }
//       } catch (err) {
//         showAlert('error', err.response.data.message);
//       }
//       entries = entry.orderEntries;
//     }

//     for(let j = 0; j < entries.length; j++) {
//       qty = parseFloat(entries[j].qty);
//       availableQty = parseFloat(entries[j].item.stockLedger.currentQty);
//       if(availableQty < qty) {
//         showAlert('error', `Item Name: ${entries[j].item.name} in ${cashReceiptEntries[i].type} Id: ${entry.id} has insufficient quantity in stock.`);
//         return;
//       }
//     }
//   }
// };

// Cash Option, default = 'Cash'
let paymentMode = 'Cash';

const cashOptionElement = document.getElementById('cashOption').addEventListener('change', e => {

  e.preventDefault = true;
  if(document.forms.cashDetails[0].checked) {
    paymentMode = 'Cash';
    togglePaymentModeDisplay();
  }
  
});

const creditOptionElement = document.getElementById('creditOption').addEventListener('change', e => {
  
  e.preventDefault = true;
  if(document.forms.cashDetails[1].checked) {
    paymentMode = 'Credit';
    togglePaymentModeDisplay();
  }

});

const togglePaymentModeDisplay = () => {
  const cashPanel = document.getElementById('cashPanel');
  const creditPanel = document.getElementById('creditPanel');

  if (paymentMode === 'Cash') {
    cashPanel.classList.remove('visually-hidden');
    creditPanel.classList.add('visually-hidden');
    document.getElementById('customerName').required = false;
    document.getElementById('paidAmount').required = true;
  } 
  
  if (paymentMode === 'Credit') {
    cashPanel.classList.add('visually-hidden');
    creditPanel.classList.remove('visually-hidden');
    document.getElementById('customerName').required = true;
    document.getElementById('paidAmount').required = false;
  }
}

let customerId = '';
let customer = null;

const customerNameElement = document.getElementById('customerName').addEventListener('input', e => {
  e.preventDefault();

  customerName = document.getElementById('customerName').value;
  const opts = document.getElementById('customerListOptions').childNodes;
  let optionSelected = false;
  document.getElementById('balance').innerText = 'Customer Name';
  customer = null;
  
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
    customer = null;
  }
};