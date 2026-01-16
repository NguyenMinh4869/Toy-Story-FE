import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const imgImage11 = "https://www.figma.com/api/mcp/asset/85994e85-ec79-4a37-8966-0df73005c709";
const imgLine38 = "https://www.figma.com/api/mcp/asset/919bffbb-b4c0-4649-a02e-4e37b30e697f";

const LoginPage = () => {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Navigate to home page
    navigate('/')
  }

  return (
    <div className="login-page" data-name="LoginPage" data-node-id="51:6">
      <div className="login-left-section" data-name="image 11" data-node-id="51:11">
        <img alt="" className="login-background-image" src={imgImage11} />
      </div>
      
      <div className="login-divider" data-node-id="165:820">
        <img alt="" className="divider-line" src={imgLine38} />
      </div>

      <div className="login-right-section">
        <h1 className="login-title" data-node-id="51:13">Welcome Back!</h1>
        <p className="login-subtitle" data-node-id="51:14">Ready for more fun? Log in to your account.</p>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" data-node-id="52:2">Email or UserName</label>
            <input 
              type="text" 
              className="form-input" 
              data-node-id="51:15"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" data-node-id="52:3">Password</label>
              <a href="#" className="forgot-password-link" data-node-id="52:15">forgot password?</a>
            </div>
            <input 
              type="password" 
              className="form-input" 
              data-node-id="52:5"
            />
          </div>

          <div className="form-remember">
            <input 
              type="checkbox" 
              id="remember-me" 
              className="remember-checkbox" 
              data-node-id="52:7"
            />
            <label htmlFor="remember-me" className="remember-label" data-node-id="52:9">
              Remember me for 30 days
            </label>
          </div>

          <button type="submit" className="login-button" data-node-id="52:11">
            <span className="login-button-text" data-node-id="52:13">Login to Account</span>
          </button>

          <p className="signup-link" data-node-id="52:17">
            Don't have an account? <a href="#" className="signup-link-text">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

