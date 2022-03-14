const cancelOrder = async (orderId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/orders/${orderId}/cancel`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/cashReceipts/create');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const cancelOrderForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();

  const orderId = location.pathname.split('/')[2];
  const advancePayment = document.getElementById('advancePayment').value;

  if(orderId) {

    const res = confirm(`Are you sure you want to cancel Order Id: ${orderId} and return cash Rs. ${advancePayment} ?`);
    if(res === true) {
      cancelOrder(orderId);
    }
  }
  
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});