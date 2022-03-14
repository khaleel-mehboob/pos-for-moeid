const getAccountHeadsByAccountGroupId = async (accountGroup) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/accountGroups/${accountGroup}/accountHeads`,
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

document.getElementById('accountGroup').addEventListener('change', async e => {
  e.preventDefault();
  const accountHeads = await getAccountHeadsByAccountGroupId(document.getElementById('accountGroup').value);
  
  const accountHead = document.getElementById('accountHead');
  accountHead.innerHTML = `<option value='' selected disabled hidden>Select Account Head ...</option>`

  accountHeads.forEach(element => {
    accountHead.innerHTML += `<option value='${element.id}'> ${element.title} </option>`;
  });
});


const getAccountSubHeadsByAccountHeadId = async (accountHeadId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/accountHeads/${accountHeadId}/accountSubHeads`,
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


document.getElementById('accountHead').addEventListener('change', async e => {
  e.preventDefault();
  const accountSubHeads = await getAccountSubHeadsByAccountHeadId(document.getElementById('accountHead').value);
  
  const accountSubHead = document.getElementById('accountSubHead');
  accountSubHead.innerHTML = `<option value='' selected disabled hidden>Select Account Sub-Head ...</option>`

  accountSubHeads.forEach(element => {
    accountSubHead.innerHTML += `<option value='${element.id}'> ${element.title} </option>`;
  });
});