function viewPassword(field, status)
{
  var passwordInput = document.getElementById(field);
  var passStatus = document.getElementById(status);
 
  if (passwordInput.type == 'password'){
    passwordInput.type='text';
    passStatus.className='fa fa-eye-slash';
    
  }
  else{
    passwordInput.type='password';
    passStatus.className='fa fa-eye';
  }
}