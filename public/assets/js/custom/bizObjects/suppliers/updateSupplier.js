const updateSupplier = async (id, name, contactNo, address, balance) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/suppliers/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        name, contactNo, address
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
  
const updateSupplierForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('supplierId').value;
  const name = document.getElementById('supplierName').value;
  const contactNo = document.getElementById('contactNo').value;
  const address = document.getElementById('address').value;
  
  updateSupplier(id, name, contactNo, address);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});