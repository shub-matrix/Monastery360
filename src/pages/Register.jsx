import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./Register.css"
export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [user,setUser]=useState({})
    const [error,setError]=useState()
    const [showPassword, setShowPassword] = useState(false)
    const [googleLoaded, setGoogleLoaded] = useState(false)
    
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    // Initialize Google Sign-In
    useEffect(() => {
        if (!googleClientId) {
            console.log("Google Client ID not configured");
            return;
        }

        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (window.google) {
                    window.google.accounts.id.initialize({
                        client_id: googleClientId,
                        callback: handleGoogleResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });
                    
                    // Get the container width for responsive button
                    const container = document.getElementById("google-signin-button-register");
                    const containerWidth = container?.offsetWidth;
                    
                    window.google.accounts.id.renderButton(
                        container,
                        { 
                            theme: "outline", 
                            size: "large",
                            text: "signup_with",
                            width: containerWidth || 400,
                            logo_alignment: "left"
                        }
                    );
                    setGoogleLoaded(true);
                }
            };
            document.body.appendChild(script);
        };

        loadGoogleScript();

        return () => {
            // Cleanup Google Sign-In
            const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [googleClientId]);

    const handleGoogleResponse = async (response) => {
        try {
            setError("");
            
            // Send the Google token to backend for verification
            const url = "https://form-backend-gold.vercel.app/api/users/google-login";
            const result = await axios.post(url, {
                credential: response.credential
            });
            
            console.log("Google signup response:", result.data);
            
            setError("Successfully registered with Google! Redirecting...");
            
            if (result.data.token) {
                localStorage.setItem('token', result.data.token);
            }
            
            // Backend returns user data at root level: { id, firstName, email, role, token }
            const userData = {
                id: result.data.id,
                firstName: result.data.firstName,
                email: result.data.email,
                role: result.data.role || 'user'
            };
            
            console.log("Google user data to save:", userData);
            
            login(userData);
            
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            console.error("Google signup error:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Google sign up failed. Please try again.";
            setError(errorMessage);
        }
    };
    
    const handleSubmit=async()=>{
        setError("")
        
        if (!user.firstName || !user.firstName.trim()) {
            setError("First Name is required")
            return
        }
        if (!user.lastName || !user.lastName.trim()) {
            setError("Last Name is required")
            return
        }
        if (!user.email || !user.email.trim()) {
            setError("Email Address is required")
            return
        }
        if (!user.password || !user.password.trim()) {
            setError("Password is required")
            return
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(user.email)) {
            setError("Please enter a valid email address")
            return
        }
        
        if (user.password.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }
        
        const alphabetCount = (user.password.match(/[a-zA-Z]/g) || []).length
        if (alphabetCount < 2) {
            setError("Password must contain at least 2 alphabetic characters")
            return
        }
        
        try{
            const url="https://form-backend-gold.vercel.app/api/users/register"
            console.log("Sending registration data:", user)
            const result= await axios.post(url,user)
            console.log("Registration successful:", result.data)
            setError("Successfully Registered")
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
        catch(err){
            console.log("Full error object:", err)
            console.log("Error response:", err.response)
            console.log("Error response data:", err.response?.data)
            console.log("Error response status:", err.response?.status)
            
            if (err.response && err.response.data) {
                const errorMsg = err.response.data.message 
                    || err.response.data.error 
                    || err.response.data.msg
                    || JSON.stringify(err.response.data)
                setError(errorMsg)
            } else if (err.response && err.response.status === 400) {
                setError("Invalid registration data. Please check all fields.")
            } else if (err.response && err.response.status === 409) {
                setError("Email already exists. Please use a different email.")
            } else {
                setError("Registration failed. Please try again.")
            }
        }
    }
  return (
    <div className="register-wrapper">
      <div className="form-container">
        <h2>Create Your Account</h2>
        {error && <div className={error.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>{error}</div>}
        
        {googleClientId && (
          <>
            <div className="google-login-container">
              <div id="google-signin-button-register"></div>
            </div>
            <div className="divider">
              <span>or sign up with email</span>
            </div>
          </>
        )}
        
        <p>
          <input 
            type="text" 
            placeholder="First Name"
            value={user.firstName || ""}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })} 
            required
          />
        </p>
        <p>
          <input 
            type="text" 
            placeholder="Last Name"
            value={user.lastName || ""}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })} 
            required
          />
        </p>
        <p>
          <input 
            type="email" 
            placeholder="Email Address"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })} 
            required
          />
        </p>
        <p className="password-input-container">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={user.password || ""}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            minLength="6"
            required
          />
          <button 
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </p>
        <p>
          <button onClick={handleSubmit}>Create Account</button>
        </p>
        <div className="auth-link">
          <p>Already have an account? <Link to="/login">Click here to login</Link></p>
        </div>
      </div>
    </div>
  );
}