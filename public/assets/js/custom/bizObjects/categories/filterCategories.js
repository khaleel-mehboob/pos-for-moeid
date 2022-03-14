const getCategoriesByDepartmentId = async (departmentId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/departments/${departmentId}/categories`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
    });

    if(res.data.status === 'success') {
      return res.data.data.data;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

document.getElementById('department').addEventListener('change', async e => {
  e.preventDefault();
  const categories = await getCategoriesByDepartmentId(document.getElementById('department').value);
  
  const category = document.getElementById('category');
  category.innerHTML = `<option value='' selected disabled hidden>Select Category ...</option>`

  categories.forEach(element => {
    category.innerHTML += `<option value='${element.id}'> ${element.name} </option>`;
  });
});