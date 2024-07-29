import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function LoginPage() {
  console.log("LoginPage component rendered");
  const navigate = useNavigate();
  const { authenticate } = useOkto();
  const [authToken, setAuthToken] = useState(null);
  const BASE_URL = "https://sandbox-api.okto.tech";
  const OKTO_CLIENT_API = process.env.REACT_APP_OKTO_CLIENT_API_KEY;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  };

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

  // const handleGoogleLogin = async (credentialResponse) => {
  //   console.log("Google login response:", credentialResponse);
  //   const idToken = credentialResponse.credential;
  //   console.log("google idtoken: ", idToken);
  //   authenticate(idToken, async (authResponse, error) => {
  //     if (authResponse) {
  //       console.log("Authentication check: ", authResponse);
  //       setAuthToken(authResponse.auth_token);
  //       if (!authToken && authResponse.action === "signup") {
  //         console.log("User Signup");
  //         const pinToken = authResponse.token;
  //         await setPin(idToken, pinToken, "0000");
  //         await authenticate(idToken, async (res, err) => {
  //           if (res) {
  //             setAuthToken(res.auth_token);
  //           }
  //         });
  //       }
  //       console.log("auth token received", authToken);
  //       navigate("/home");
  //     }
  //     if (error) {
  //       console.error("Authentication error:", error);
  //     }
  //   });
  // };
  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);
    const idToken = credentialResponse.credential;
    console.log("google idtoken: ", idToken);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log("Authentication check: ", authResponse);
        setAuthToken(authResponse.auth_token);
        console.log("auth token received", authResponse.auth_token);
  
        // Check if the user is signing up and set the pin
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
          // If no signup, directly navigate
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
    <div style={containerStyle}>
      <h1>Login</h1>
      {!authToken ? (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleError}
          useOneTap
          promptMomentNotification={(notification) =>
            console.log("Prompt moment notification:", notification)
          }
        />
      ) : (
        <> Authenticated </>
      )}
    </div>
  );
}

export default LoginPage;
