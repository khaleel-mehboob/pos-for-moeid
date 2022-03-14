const updateStockLedger = async (stockLedgerId, currentQty, movingAverage, stockValue) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/stockLedgers/${stockLedgerId}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        currentQty, movingAverage, stockValue
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/stockLedgers');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const updateItemForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const stockLedgerId = parseInt(document.getElementById('stockLedgerId').value);
  const currentQty = document.getElementById('currentQty').value;
  const movingAverage = document.getElementById('movingAverage').value;
  const stockValue = parseFloat(currentQty) * parseFloat(movingAverage);
 
  updateStockLedger(stockLedgerId, currentQty, movingAverage, stockValue);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});