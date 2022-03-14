const viewItemForm = document.querySelector('.form-body').addEventListener('submit', e => {
  e.preventDefault();
  window.history.go(-1);
});
