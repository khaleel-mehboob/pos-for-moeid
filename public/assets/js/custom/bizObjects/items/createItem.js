const createItem = async (name, barcode, unit, price, categoryId, departmentId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/items`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        name, barcode, unit, price, categoryId, departmentId
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        window.history.go(-1);
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const createItemForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('itemName').value;
  const barcode = document.getElementById('barcode').value;
  const unit = document.getElementById('unit').value;
  const price = document.getElementById('price').value;
  const categoryId = document.getElementById('category').value;
  const departmentId = document.getElementById('department').value;
  
  createItem(name, barcode, unit, price, categoryId, departmentId);
});


const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});