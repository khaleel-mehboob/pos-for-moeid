const createAccount = async (title, accountGroup, accountHeadId, accountSubHeadId, balance) => {
  try {
    const res = await axios({
      method: 'POST',
      
      url: `/api/v1/accounts`,
      // credentials: 'include',
      mode: 'cors',
      withCredentials: true,
      data: {
        title, accountGroup, accountHeadId, accountSubHeadId, balance
      }
    });

    if(res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/coa');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
  
const createAccountForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('accountTitle').value;
  const accountGroup = document.getElementById('accountGroup').value;
  const accountHeadId = document.getElementById('accountHead').value;
  const accountSubHeadId = document.getElementById('accountSubHead').value;
  const balance = document.getElementById('openingBalance').value;

  createAccount(title, accountGroup, accountHeadId, accountSubHeadId, balance);
});

const backButton = document.getElementById('backButton').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});