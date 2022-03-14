let saleReturnEntries = [];
let itemName = '';
let itemId = '';

const addSaleReturnEntryToArray = (qty, rate) => {
  const saleReturnEntry = {
    itemId: parseInt(itemId),
    itemName,
    qty,
    rate,
    subTotal: qty * rate
  };

  saleReturnEntries.push(saleReturnEntry);

  displaySaleReturnEntries();
};

const displaySaleReturnEntries = () => {
  const element = document.getElementById('saleReturnEntries');
  
  if(element) {
    element.innerHTML = '';

    let i = 0;
    saleReturnEntries.forEach(e => {

      element.innerHTML += `
        <tr id='entry-${saleReturnEntries.indexOf(e)}'>
          <td>${++i}</td>
          <td>${e.itemName}</td>
          <td>${e.rate}</td>
          <td>${e.qty}</td>
          <td>${e.subTotal}</td>
          <td>
            <a class='saleReturnEntry' id='saleReturnEntry-${saleReturnEntries.indexOf(e)}' href='#'>
              <i class='fa fa-lg fa-trash'></i>
            </a>
          </td>
        </tr>
      `;

      const saleReturnEntry = document.querySelectorAll('.saleReturnEntry');
      saleReturnEntry.forEach(e => {
        e.addEventListener('click', element => {
          removeSaleReturnEntry(e.id.split('-')[1]);
        });
      });
    })

    document.getElementById('saleReturnEntryForm').reset();

    updateSaleReturnFigures();
  }  
};

const updateSaleReturnFigures = () => {
  let totalAmount = 0;

  saleReturnEntries.forEach(e => {
    totalAmount += e.subTotal;
  });

  document.getElementById('totalAmount').value = totalAmount;
};

function removeSaleReturnEntry(rowId) {
  if(saleReturnEntries.length > rowId) {
    saleReturnEntries.splice(rowId, 1);
    displaySaleReturnEntries();
  }
}
  
const saleReturnEntryForm = document.querySelector('.form-body-child').addEventListener('submit', e => {
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
  
  addSaleReturnEntryToArray(parseFloat(qty).toFixed(2), parseFloat(rate).toFixed(2));
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

const createSaleReturn = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/saleReturns`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        saleReturnEntries
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/saleReturns');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createSaleReturnForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  if(saleReturnEntries.length < 1) {
    alert('Please add sale return entries');
    return document.getElementById('itemName').focus();
  }

  createSaleReturn();
});

const resetButton = document.getElementById('resetButton').addEventListener('click', e => {
  e.preventDefault = true;
  location.assign('/saleReturns/create');
});