const updateItem = async (id, name, barcode, unit, price, categoryId, departmentId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/items/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        id, name, barcode, unit, price, categoryId, departmentId
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/items');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const updateItemForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('itemId').value;
  const barcode = document.getElementById('barcode').value;
  const name = document.getElementById('itemName').value;
  const unit = document.getElementById('unit').value;
  const price = document.getElementById('price').value;
  const categoryId = document.getElementById('category').value;
  const departmentId = document.getElementById('department').value;
  
  updateItem(id, name, barcode, unit, price, categoryId, departmentId);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});