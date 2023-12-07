import React, { useState, useEffect, useContext } from "react";
import { LoginPageButton } from "../login/LoginPageButton";
import LoginInput from "../login/LoginInput";
import SignUpInput from "../login/SignUpInput";
import logo from "../../assets/images/logo.svg";
import { useNavigate } from "react-router-dom";
import { POST } from "../../composables/api";
import urls from "../../composables/urls.json";
import { UserContext } from "../ContentRouter";
import Loading from "../common/Loading";

export function Login() {
  const { setLogin } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0); 

  const [isLogginIn, setLoggingIn] = useState(() => {
    const setSize = sessionStorage.getItem("loggingIn");
    return JSON.parse(setSize!) ?? true;
  });

  useEffect(() => {
    sessionStorage.setItem("loggingIn", JSON.stringify(isLogginIn));
  }, [isLogginIn]);

  const navigate = useNavigate();

  async function signIn() {
    setLoading(true);
    const data = {
      password: password,
      username: username,
    };
    try {
      const token_vals = await POST(urls.login, data);
      console.log(token_vals);
      if (token_vals.success) {
        setLoading(false);
        setLogin(token_vals);
        navigate("/user/dashboard");
      }
    } catch (e) {
      setLoading(false);
      setError("Incorrect Username or Password");
      console.error("Error logging in: ", e);
    }
  }

  async function signUp() {
    setLoading(true);
    const data = {
      password: password,
      phone_number: username,
      email: email,
      first_name: firstName,
      last_name: lastName,
      age: age,
      weight: weight,
      height: height,
    };
    try {
      const user = await POST(urls.account, data);
      if (user.success) {
        setLoading(false);
        setLoggingIn(true);
        setError("");
      }
    } catch (e) {
      setLoading(false);
      setError("Username/Email already is linked to an account.");
      console.error("Error creating acount: ", e);
    }
  }

  const clearForm = () => {
    setError("");
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setAge(0);
    setWeight(0);
    setHeight(0);
  };
  console.log(username, password, email, firstName, lastName, age, weight, height);
  return (
    <div className="flex flex-grow items-center justify-center rounded-xl bg-gradient-to-t from-indigo-950 to-pink-950 overflow-hidden ">
      <div className="w-full h-full flex items-center justify-center overflow-x-hidden overscroll-contain overflow-auto p-4">
        <div className="pt-4 h-full flex flex-col items-center w-full md:w-[34rem]">
          <div className="w-full flex items-center justify-center min-h-[3.75rem] max-h-[180px] gap-4">
            <img
              src={logo}
              alt="logo"
              className="max-w-[3.75rem] object-contain aspect-square md:my-10 mb-14 md:mb-20"
            />
            <p className="text-6xl text-neutral-100 md:my-10 mb-14 md:mb-20 text-center">
              ShapeShyft
            </p>
          </div>

          <div
            className={`relative p-10 w-full ${
              isLogginIn ? "min-h-[472px] h-[472px]" : "min-h-[768px] h-[768px] md:min-h-[624px] md:h-[624px]"
            } flex flex-col bg-neutral-100 rounded-xl overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.8)] transition-all ease-in-out duration-300`}
          >
            <div className="h-[72px] max-h-[72px] min-h-[72px] flex flex-col">
              <h1 className="text-2xl font-semibold">
                {isLogginIn ? "Login" : "Sign Up"}
              </h1>
              <p className="text-red-500 mt-auto">{error}</p>
            </div>
            {isLogginIn ? (
              <form
                className="flex flex-col flex-grow gap-10 text-xl"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await signIn();
                }}
              >
                <LoginInput
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
                <div className="mt-auto w-full flex flex-col items-center justify-center gap-4">
                  <LoginPageButton
                    prompt={loading ? <Loading /> : "Login"}
                    id="login"
                  />
                  <div className="w-full flex justify-center items-center  text-neutral-400 gap-4">
                    <div className="w-1/3 bg-neutral-300 h-1 rounded-full" />
                    <p className="text-center mb-1">or</p>
                    <div className="w-1/3 bg-neutral-300 h-1 rounded-full" />
                  </div>
                  <LoginPageButton
                    prompt="Sign Up"
                    id="signup"
                    onClick={() => {
                      setLoggingIn(false);
                      clearForm();
                    }}
                  />
                </div>
              </form>
            ) : (
              <form
                className="flex flex-col flex-grow gap-10 text-xl"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await signUp();
                }}
              >
                <SignUpInput
                  setUsername={setUsername}
                  setPassword={setPassword}
                  setEmail={setEmail}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                  setAge={setAge}
                  setHeight={setHeight}
                  setWeight={setWeight}
                />
                <div className="md:sticky bottom-0 mt-auto w-full flex flex-col items-center justify-center gap-4">
                  <LoginPageButton
                    prompt={loading ? <Loading /> : "Create Account"}
                    id="createAccount"
                  />
                  <div className="w-full flex justify-center items-center  text-neutral-400 gap-4">
                    <div className="w-1/3 bg-neutral-300 h-1 rounded-full" />
                    <p className="text-center mb-1">or</p>
                    <div className="w-1/3 bg-neutral-300 h-1 rounded-full" />
                  </div>
                  <LoginPageButton
                    prompt="Login"
                    onClick={() => {
                      setLoggingIn(true);
                      clearForm();
                    }}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
