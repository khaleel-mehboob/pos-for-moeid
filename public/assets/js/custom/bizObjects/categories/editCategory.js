const editCategory = async (id, name, departmentId) => {
  try {
    let res = await axios({
      method: 'PATCH',
      url: `/api/v1/categories/${id}`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        name, departmentId
      }
    });
    
    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/categories');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const editCategoryForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('categoryId').value;
  const name = document.getElementById('categoryName').value;
  const departmentId = document.getElementById('department').value;
  editCategory(id, name, departmentId);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});