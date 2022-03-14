const goHomeButton = document.getElementById('goHome').addEventListener('click', e => {
  e.preventDefault();
  location.assign('/');
});

const backButton = document.getElementById('back').addEventListener('click', e => {
  e.preventDefault();
  window.history.go(-1);
});