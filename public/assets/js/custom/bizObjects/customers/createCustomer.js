const createCustomer = async (name, contactNo, address, balance) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/customers`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        name, contactNo, address, balance
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/customers');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const createCustomerForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const contactNo = document.getElementById('contactNo').value;
  const address = document.getElementById('address').value;
  const balance = document.getElementById('openingBalance').value;

  createCustomer(name, contactNo, address, balance);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});
