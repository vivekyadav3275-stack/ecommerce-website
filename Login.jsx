import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-box">

        <h2>Login</h2>

        <form>
          <label>Email or mobile phone number</label>
          <input type="text" placeholder="Enter email or phone" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <button className="login-btn">Log In</button>

          <p className="forgot">Forgot Password?</p>
        </form>

        <hr />

        <button className="google-btn">
          Continue with Google
        </button>

        <p className="new">
          New to ShopKart?
        </p>

        <button className="create-btn">
          Create your ShopKart account
        </button>

      </div>
    </div>
  );
}

export default Login;
