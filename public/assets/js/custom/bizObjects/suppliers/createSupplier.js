const createSupplier = async (name, contactNo, address, balance) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/suppliers`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        name, contactNo, address, balance
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/suppliers');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const createSupplierForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('supplierName').value;
  const contactNo = document.getElementById('contactNo').value;
  const address = document.getElementById('address').value;
  const balance = document.getElementById('openingBalance').value;

  createSupplier(name, contactNo, address, balance);
});


const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});