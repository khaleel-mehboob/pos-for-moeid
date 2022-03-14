const createCategory = async (name, departmentId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/departments/${departmentId}/categories`,
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
  
const createCategoryForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('categoryName').value;
  const departmentId = document.getElementById('department').value;
  createCategory(name, departmentId);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});