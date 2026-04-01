function toggleCreate() {
  document.querySelector('.auth-box').classList.toggle('hidden');
  document.querySelector('.create-box').classList.toggle('hidden');
}

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) return alert('Enter username and password.');
  window.location.href = './dashboard.html';
}

function createAccount() {
  const u = document.getElementById('newUsername').value.trim();
  const p = document.getElementById('newPassword').value.trim();
  const c = document.getElementById('confirmPassword').value.trim();
  const e = document.getElementById('email').value.trim();
  if (!u || !p || !c) return alert('Fill in all fields.');
  if (p !== c) return alert('Passwords must match.');
  alert(`Welcome ${u}!`);
  window.location.href = './dashboard.html';
}
