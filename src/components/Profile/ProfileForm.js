
import { useRef, useContext } from 'react';
import {useHistory} from 'react-router-dom' 
import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-context';

const ProfileForm = () => {
  const history = useHistory()
  const authCtx = useContext(AuthContext)
  const newPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCa-s-H9KlCAOkAGHYvoOgG01XWx_UHd_w', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: true
      }),
       headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      history.replace('/')
    })
   }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
