const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/auth/logout',
      credentials: 'include',
      mode: 'cors'
    });

    if(res.data.status === 'success') location.assign('/');

  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

const logoutBtn = document.getElementById('logout').addEventListener('click', logout);