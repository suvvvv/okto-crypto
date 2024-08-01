import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './LoginPage.css'; 

function LoginPage() {
  console.log("LoginPage component rendered");
  const navigate = useNavigate();
  const { authenticate } = useOkto();
  const [authToken, setAuthToken] = useState(null);
  const BASE_URL = "https://sandbox-api.okto.tech";
  const OKTO_CLIENT_API = process.env.REACT_APP_OKTO_CLIENT_API_KEY;

  const apiService = axios.create({
    baseURL: BASE_URL,
    headers: {
      "x-api-key": OKTO_CLIENT_API,
      "Content-Type": "application/json",
    },
  });

  const setPin = (idToken, token, reloginPin) => {
    return apiService.post("/api/v1/set_pin", {
      id_token: idToken,
      token: token,
      relogin_pin: reloginPin,
      purpose: "set_pin",
    });
  };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);
    const idToken = credentialResponse.credential;
    console.log("google idtoken: ", idToken);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log("Authentication check: ", authResponse);
        setAuthToken(authResponse.auth_token);

        if (!authResponse.auth_token && authResponse.action === "signup") {
          console.log("User Signup");
          const pinToken = authResponse.token;
          await setPin(idToken, pinToken, "0000");
          await authenticate(idToken, async (res, err) => {
            if (res) {
              setAuthToken(res.auth_token);
              console.log("auth token after signup", res.auth_token);
              navigate("/home");
            }
            if (err) {
              console.error("Error during re-authentication:", err);
            }
          });
        } else {
          navigate("/home");
        }
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  const handleError = (error) => {
    console.error("Login Failed", error);
    alert("Login Failed: " + error.details);
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="image-container"></div>
        <h1>All-in-One Crypto Investment Platform</h1>
<p>
  This project uses the Okto SDK with React for building a Crypto Investment Tracker. This app integrates the Okto Embedded Wallet SDK to provide users with seamless wallet management, portfolio tracking, and transaction capabilities. Users can view their cryptocurrency holdings, perform token transfers, and monitor their transaction history, all within a single platform.
</p>


      </div>
      <div className="right-section">
        <h2>Sign in</h2>
        {!authToken ? (
          <>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleError}
              useOneTap
              promptMomentNotification={(notification) =>
                console.log("Prompt moment notification:", notification)
              }
            />
            <p className="or-separator">OR</p>
            <form>
              <input type="text" placeholder="User name or email address" />
              <input type="password" placeholder="Your password" />
              <button type="submit">Sign in</button>
              <a href="/">Forget your password</a>
            </form>
          </>
        ) : (
          <>
            <p>Authenticated</p>
            <button onClick={() => navigate("/home")}>Go to Dashboard</button>

          </>
        )}
        <p>
          Don't have an account? <a href="/">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
