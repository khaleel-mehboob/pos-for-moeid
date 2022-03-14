const login = async (username, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/auth/login',
      credentials: 'include',
      mode: 'cors',
      data: {
        username,
        password
      }
    }
    // , { withCredentials: true, credentials: 'include' }
    );

    if(res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/dashboard');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const loginForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('inputUsername').value;
  const password = document.getElementById('inputChoosePassword').value;
  login(username, password);
});