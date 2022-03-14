
let printDocData = {

  docHeader: {
    clientName: 'AL-FATEH SWEETS & BAKERS',
    clientContactNos: ['0321-1234567', '0300-0987654', '0333-9876543'],
  },
  docContent: {
    operationHeader: {},
    operationEntries: [],
    operationFooter: {}
  },
  docFooter: {
    author: 'vAlients Technologies',
    contactNos: ['0331-4910778', '0334-4144284']
  }
}

const buildDocumentHeader = () => {
  return `
  <html>
    <head>
      <style type='text/css'>
        @media screen, print {

          body, table {
            font-family: serif;
            font-size: 8pt;
          }

          table {
            border-collapse: collapse;
          }

          .tableHead {
            border-top: 1px solid;
            border-bottom: 1px solid;
            margin-top: 4px;
            margin-bottom: 4px;
            padding: 4px;
          }
          
          .docHeader {
            text-align: center;
            margin-bottom: 5px;
            margin-top: 12px;
            padding: 5px;
            border-bottom: 1px solid;
          }

          .clientName {
            margin-top: 3pt;
            margin-bottom: 3pt;
          }

          .clientContacts {
            margin-top: 3pt;
            margin-bottom: 3pt;
          }

          .itemName {
            text-transform: uppercase;
          }

          .rightText {
            text-align: right;
          }

          .operationHeader {
            margin-top: 3pt;
            margin-bottom: 3pt;
          }

          .header-row-1 {
            padding: 3px;
          }

          .header-row-2 {
            padding: 3px;
          }

          .operationFooter {
            margin-top: 5px;
            margin-bottom: 5px;
            text-align: right;
          }

          .operationContent {
            margin-top: 3pt;
            margin-bottom: 3pt;
          }

          .docFooter {
            text-align: center;
            margin-bottom: 5px;
            margin-top: 8px;
            border-top: 1px solid;
          }
          
          .thanksNote {
            padding: 0;
          }

          .author {
            border-top: 1px dotted;
            padding-top: 4px;
            margin-top: 3pt;
          }

          .authorContacts {
            margin-bottom: 3pt;
          }


          .totalAmount {
            border-top: 1px solid;
            margin-top: 4px;
            padding-top: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class='docHeader'>
        <h4 class='clientName'>${printDocData.docHeader.clientName}</h4>
        <p class='clientContacts'>${printDocData.docHeader.clientContactNos}</p>
      </div>
  `
}

const buildDocumentFooter = () => {
  return `
        <div class='docFooter'>
          <h4 class='thanksNote'>THANK YOU FOR SHOPPING!</h4>
          <div>
            <span class='author'>A product of: ${printDocData.docFooter.author}</span>
          </div>
          <div>
            <span class='authorContacts'>${printDocData.docFooter.contactNos.toString().replace(',', ' ')}</span>
          </div>
        </div>
      </body>
    </html>
  `
}

const docBuilder = (operationType, operation, operationEntries) => {
  let html = '';
  html += buildDocumentHeader();
  html += buildDocumentContent(operationType, operation, operationEntries);
  html += buildDocumentFooter();
  return html;
}

const buildOperationHeader = (operationType, operation) => {
  // console.log(operationType, operation);

  let createdAt = new Date(operation.createdAt);
  let dateString = createdAt.toLocaleDateString('en-GB', {
    day : 'numeric',
    month : 'numeric',
    year : 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
}).split(' ').join('-').split(',-').join(' ');
  
  let html = '';

  if(operationType === 'orders') { 
    html = `
      <div class='operationHeader'>
        <div class='header-row-1'>
          <table width='100%'>
            <thead>
              <tr>
                  <td width='33%'>Order Id:</td>
                  <td width='33%'>Status:</td>
                  <td width='33%'>Date / Time:</td>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>${operation.id}</td>
                <td>${operation.status.toUpperCase()}</td>
                <td>${dateString}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='header-row-2'>
          <table width='100%'>
            <thead>
              <tr>
                  <td width='33%'>Delivery Method:</td>
                  <td width='33%'>Customer Name:</td>
                  <td width='33%'>Contact No:</td>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>${operation.deliveryMethod.toUpperCase()}</td>
                <td>${operation.customerName.toUpperCase()}</td>
                <td>${operation.contactNo.toUpperCase()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;  
  }
  
  if(operationType === 'sales') {
    html = `
      <div class='operationHeader'>
        <div class='header-row-1'>
          <table width='100%'>
            <thead>
            <tr>
                <td width='33%'>Sale Id:</td>
                <td width='33%'>Status:</td>
                <td width='33%'>Date / Time</td>
              </tr>
              </thead>
            <tbody>
              <tr>
                <td>${operation.id}</td>
                <td>${operation.status.toUpperCase()}</td>
                <td>${dateString}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if(operationType === 'cashReceipts') { 
    
    let customerId = '';
    let customerName = '';
    
    if(operation.paymentMode === 'Credit') {
      customerId = operation.customer.id;
      customerName = operation.customer.name;
    }
    const customer = `${customerId} - ${customerName}`;

    html = `
      <div class='operationHeader'>
        <div class='header-row-1'>
          <table width='100%'>
            <thead>
              <tr>
                  <td width='33%'>Amount:</td>
                  <td width='33%'>Mode Of Payment:</td>
                  <td width='33%'>Date/Time</td>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>${parseFloat(operation.netTotal).toFixed(2)}</td>
                <td>${operation.paymentMode.toUpperCase()}</td>
                <td>${dateString}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='header-row-2'>
          <table width='100%'>
            <thead>
              <tr>
                  <td width='33%'>Customer Id & Name:</td>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>${customer.toUpperCase()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }


  return html;
}

const buildOperationFooter = (operationType, operation, operationEntries) => {
  let html = '';

  if(operationType === 'orders') {
    html = `
      <div class='operationFooter'>
        <table width='100%'>
          <tr>
            <td width='100%' align='right'>
              <span class=' totalAmount'>Total Amount: ${parseFloat(operation.amount).toFixed(2)}</span>
            </td>
          </tr>
          <tr>
            <td width='100%' align='right'>
              Advance Paid: ${parseFloat(operation.advancePayment).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td width='100%' align='right'>
              Remaining Amount: ${parseFloat(operation.remainingAmount).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  if(operationType === 'sales') {
    html = `
      <div class='operationFooter'>
        <span class=' totalAmount'>Total Amount: ${parseFloat(operation.amount).toFixed(2)}</span>
      </div>
    `;
  }

  if(operationType === 'cashReceipts') {
    html = `
      <div class='operationFooter'>
        <table width='100%'>
          <tr>
            <td width='100%' align='right'>
              <span class=' totalAmount'>Total Amount: ${parseFloat(operation.totalAmount).toFixed(2)}</span>
            </td>
          </tr>
          <tr>
            <td align='right'>
              Discount: ${parseFloat(operation.discount).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td align='right'>
              Net Total: ${parseFloat(operation.netTotal).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>
    `;
  }
  
  return html;
}

const buildDocumentContent = (operationType, operation, operationEntries) => {
  let html = '<div class="operationContent">'
  html += buildOperationHeader(operationType, operation);
  html += buildOperationEntries(operationType, operationEntries);
  html += buildOperationFooter(operationType, operation, operationEntries);
  html += '</div>';
  return html;
}

const buildOperationEntries = (operationType, operationEntries) => {
  let tableHead = '';
  const tableBodyStart = `<tbody>`;
  let tableBody = ``;
  const tableBodyEnd = `</tbody></table>`;

  if(operationType === 'orders' || operationType === 'sales') {
    tableHead = `
      <table width='100%'>
        <thead class='tableHead'>
          <tr>
            <td width='10%'>Ser</td>
            <td width='45%'>Item Name</td>
            <td width='15%' class='rightText'>Qty</td>
            <td width='15%' class='rightText'>Rate</td>
            <td width='15%' class='rightText'>Amount</td>
          </tr>
        </thead>
    `;

    let i = 0;
    let itemName = '';
    operationEntries.forEach(e => {
      
      if(e.item) {
        itemName = e.item.name;
      } else if (e.itemName) {
        itemName = e.itemName;
      }

      tableBody += `
        <tr>
          <td>${++i}</td>
          <td class='itemName'>${itemName}</td>
          <td class='rightText'>${e.qty}</td>
          <td class='rightText'>${parseFloat(e.rate).toFixed(2)}</td>
          <td class='rightText'>${parseFloat(e.qty * e.rate).toFixed(2)}</td>
        </tr>
      `;
    });
  }

  if(operationType === 'cashReceipts') {
    tableHead = `
      <table width='100%'>
        <thead class='tableHead'>
          <tr>
            <td width='25%'>Ser.#</td>
            <td width='25%'>Ref.#</td>
            <td width='25%' align='center'>Status</td>
            <td width='25%' class='rightText'>Amount</td>
          </tr>
        </thead>
    `;

    let i = 0;
    let refNo = '';
    let status = '';
    operationEntries.forEach(e => {
      
      if(e.orderId) {
        refNo = `O-${e.orderId}`;
        status = 'Delivered';
      }
      
      if(e.saleId) {
        refNo = `S-${e.saleId}`;
        status = 'Paid';
      }

      tableBody += `
        <tr>
          <td>${++i}</td>
          <td class='refNo'>${refNo}</td>
          <td align='center'>${status}</td>
          <td class='rightText'>${e.amount}</td>
        </tr>
      `;
    });
  }

  const table = `
    <div>
      ${tableHead + tableBodyStart + tableBody + tableBodyEnd}    
    </div>
  `;

  return table;
}

const printInvoice = (operationType, operation, operationEntries) => {
  
  const docToPrint = docBuilder(operationType, operation, operationEntries);  
  var win = window.open();
  self.focus();
  win.document.open();
  win.document.write(docToPrint);
  win.document.close();
  win.print();
  win.close();
} 


const prepareDocumentForPrinting = (docType, doc) => {
  if(doc) {
    
    let operation = doc.doc
    let operationEntries;

    if(docType === 'orders') {
      operationEntries = operation.orderEntries;
      operation.orderEntries = undefined;
      printInvoice('orders', operation, operationEntries)
    }
    
    if(docType === 'sales') {
      operationEntries = operation.saleEntries;
      operation.saleEntries = undefined;
      printInvoice('sales', operation, operationEntries)
    }
    
    if(docType === 'cashReceipts') {
      operationEntries = operation.cashReceiptEntries;
      operation.cashReceiptEntries = undefined;
      
      if(doc.customer) operation.customer = doc.customer;

      printInvoice('cashReceipts', operation, operationEntries)
    }
  }
}

const printOrderClass = document.querySelectorAll('.printOrder');
printOrderClass.forEach(e => {
  e.addEventListener('click', async element => {
    const doc = await getDocument('orders', e.id);
    prepareDocumentForPrinting('orders', doc);
  });
});

const printSaleClass = document.querySelectorAll('.printSale');
printSaleClass.forEach(e => {
  e.addEventListener('click', async element => {
    const doc = await getDocument('sales', e.id);
    prepareDocumentForPrinting('sales', doc);
  });
});

const printCashReceiptClass = document.querySelectorAll('.printCashReceipt');
printCashReceiptClass.forEach(e => {
  e.addEventListener('click', async element => {
    const doc = await getDocument('cashReceipts', e.id);
    prepareDocumentForPrinting('cashReceipts', doc);

  });
});

const getDocument = async (docType, docId) => {

  try {
      const res = await axios({
      method: 'GET',
      url: `/api/v1/${docType}/${docId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      return res.data.data;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};