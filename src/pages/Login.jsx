import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
    const [loginData, setLoginData] = useState({});
    const [loginStatus, setLoginStatus] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const Navigate = useNavigate();
    const { login } = useAuth();
    
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
                    const container = document.getElementById("google-signin-button");
                    const containerWidth = container.offsetWidth;
                    
                    window.google.accounts.id.renderButton(
                        container,
                        { 
                            theme: "outline", 
                            size: "large",
                            text: "continue_with",
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
            setLoginStatus("");
            setIsLoading(true);
            
            // Send the Google token to backend for verification
            const url = "https://form-backend-gold.vercel.app/api/users/google-login";
            const result = await axios.post(url, {
                credential: response.credential
            });
            
            console.log("Google login response:", result.data);
            
            setLoginStatus("Login successful! Redirecting...");
            setIsLoading(false);
            
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
                if (userData.role === 'admin') {
                    Navigate("/admin");
                } else {
                    Navigate("/");
                }
            }, 1500);
        } catch (err) {
            console.error("Google login error:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Google login failed. Please try again.";
            setLoginStatus(errorMessage);
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setLoginStatus("");
            setIsLoading(true);
            
            const url = "https://form-backend-gold.vercel.app/api/users/login";
            const result = await axios.post(url, loginData);
            
            console.log("Login response:", result.data);
            
            setLoginStatus("Login successful! Redirecting...");
            setIsLoading(false);
            
            if (result.data.token) {
                localStorage.setItem('token', result.data.token);
            }
            
            // Backend returns user data at root level: { id, firstName, email, role, token }
            const userData = {
                id: result.data.id,
                firstName: result.data.firstName,
                email: result.data.email || loginData.email,
                role: result.data.role || 'user'
            };
            
            console.log("User data to save:", userData);
            
            login(userData);
            
            setTimeout(() => {
                if (userData.role === 'admin') {
                    Navigate("/admin");
                } else {
                    Navigate("/");
                }
            }, 1500);
        } catch (err) {
            console.log(err);
            setLoginStatus("Invalid email or password");
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="form-container">
                <h2>Welcome Back</h2>
                {loginStatus && (
                    <div className={loginStatus.includes("successful") ? "success-message" : "error-message"}>
                        {loginStatus}
                    </div>
                )}
                
                {/* Google Sign-In Button */}
                {googleClientId && (
                    <>
                        <div className="google-login-container">
                            <div id="google-signin-button"></div>
                        </div>
                        <div className="divider">
                            <span>or continue with email</span>
                        </div>
                    </>
                )}
                
                <p>
                    <input
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                </p>
                <p className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
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
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </p>
                
                <div className="auth-link">
                    <p>Don't have an account? <Link to="/register">Click here to register</Link></p>
                </div>
            </div>
        </div>
  );
}