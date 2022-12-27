import React, { FormEvent, StrictMode, useState, useRef, useEffect } from "react";
import { APIVersion } from "./interfaces/Common";
import { axiose } from "./interfaces/Axiose";
import TextBox from "./components/TextBox";
import CheckBox from "./components/CheckBox";
import Button from "./components/Button";
import { Colors } from "./interfaces/Common";
import { LoginBox } from "./interfaces/Classes";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Link } from "react-router-dom";

export default function SignupApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const [errors, dSetErrors] = useState<[string | null, string | null]>([null, null]);
  let noDispErrors: [string | null, string | null] = [null, null];
  const setErrors = (errors: [string | null, string | null]) => {
    dSetErrors(errors);
    noDispErrors = errors;
  }
  const [captcha, setCaptcha] = useState(false);
  const showCaptcha = () => setCaptcha(true);
  const [captchaKey, setCaptchaKey] = useState("");
  useEffect(() => {
    axiose.get(`/config/hcaptcha.json`)
    .then(res => {
      setCaptchaKey(res.data.Login);
    });
  }, []);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([null, null]);
    console.log("Submitting");
    if (!email) setErrors([`Email is required`, noDispErrors[1]]);
    if (!password) setErrors([noDispErrors[0], `Password is required`]);
    console.log(errors);
    if (noDispErrors.filter(e => e !== null).length > 0) return;
    setLoading(true);
    axiose.post(`/api/v${APIVersion}/auth/login`, {
      email,
      password,
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(res => {
      setLoading(false);
      if (res.data.error) {
        setErrors([res.data.error, res.data.error]);
      } else {
        localStorage.setItem("wsOnlyToken", res.data.wsOnlyToken);
        window.location.href = "/app";
      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response.data.code === 40002) {
        showCaptcha();
      }
    });
  }
  const submitCaptcha = (response: string) => {
    setShowLoading(true);
    setCaptcha(false);
    axiose.post(`/api/v${APIVersion}/auth/login`, {
      email,
      password,
      "h-captcha-response": response
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(res => {
      if (res.data.error) {
        setLoading(false);
        setShowLoading(false);
        setCaptcha(false);
        setErrors([res.data.error, res.data.error]);
        (captchaRef.current)?.resetCaptcha();

      } else {
        localStorage.setItem("wsOnlyToken", res.data.wsOnlyToken);
        window.location.href = "/app";
      }
    })
    .catch(err => {
      setShowLoading(false);
      setCaptcha(false);
      setLoading(false);
      setErrors([err.response.data.error, err.response.data.error]);
      (captchaRef.current)?.resetCaptcha();

    });
  }
  return (
    <StrictMode>
      <div className="grid place-content-center h-full bg-gradient-1">
        <form className={LoginBox} onSubmit={submit} style={(captcha || showLoading) ? { display: "none"}:{ display: "block" }}>
          <h1 className="text-4xl text-white font-bold text-center mb-4">Welcome back</h1>
          <TextBox placeholder="john@example.com" type="email" value={email} onChange={(e:any) => setEmail(e.target.value)} id="email" label="Email Address" required error={errors[0]} />
          <TextBox placeholder="********" type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} id="password" label="Password" required error={errors[1]} />
          <Button text="Log in" id="login" priority={Colors.PRIMARY} type="submit" loading={loading} />
          <hr className="my-4" />
          <p className="text-center text-white">You don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link></p>
        </form>
        <form className={LoginBox} style={(captcha && !showLoading) ? { display: "block"}:{ display: "none"}}>
          <h1 className="text-4xl text-white font-bold text-center mb-4">Welcome back</h1>
          { captchaKey && <div className="flex justify-center items-center h-4/5"><HCaptcha sitekey={captchaKey} onVerify={submitCaptcha} ref={captchaRef} /></div>}
        </form>
        <div className="h-128" style={showLoading ? { display: "block"}:{ display: "none"}}>
          <div role="status">
            <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </StrictMode>
  )
}