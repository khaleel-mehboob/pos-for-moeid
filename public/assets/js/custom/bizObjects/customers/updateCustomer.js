const updateCustomer = async (id, name, contactNo, address, balance) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/customers/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        name, contactNo, address
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
  
const updateCustomerForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('customerId').value;
  const name = document.getElementById('customerName').value;
  const contactNo = document.getElementById('contactNo').value;
  const address = document.getElementById('address').value;
  
  updateCustomer(id, name, contactNo, address);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});