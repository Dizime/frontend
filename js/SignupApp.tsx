import React, { FormEvent, StrictMode, useState, useRef, useEffect } from "react";
import { APIVersion } from "./interfaces/Common";
import { axiose } from "./interfaces/Axiose";
import TextBox from "./components/TextBox";
import CheckBox from "./components/CheckBox";
import Button from "./components/Button";
import { Colors } from "./interfaces/Common";
import { SignupBox } from "./interfaces/Classes";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Link } from "react-router-dom";

export default function SignupApp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const [errors, dSetErrors] = useState<[string | null, string | null, string | null, string | null, string | null]>([null, null, null, null, null]);
  let noDispErrors: [string | null, string | null, string | null, string | null, string | null] = [null, null, null, null, null];
  const setErrors = (errors: [string | null, string | null, string | null, string | null, string | null]) => {
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
    setErrors([null, null, null, null, null]);
    console.log("Submitting");
    console.log(username, email, password, passwordConfirm, terms, newsletter);
    if (!username) setErrors([`Username is required`, noDispErrors[1], noDispErrors[2], noDispErrors[3], noDispErrors[4]]);
    if (!email) setErrors([noDispErrors[0], `Email is required`, noDispErrors[2], noDispErrors[3], noDispErrors[4]]);
    if (password !== passwordConfirm) setErrors([noDispErrors[0], noDispErrors[1], `Passwords do not match`, `Passwords do not match`, noDispErrors[4]]);
    if (!password) setErrors([noDispErrors[0], noDispErrors[1], `Password is required`, noDispErrors[3], noDispErrors[4]]);
    if (!passwordConfirm) setErrors([noDispErrors[0], noDispErrors[1], noDispErrors[2], `Password confirmation is required`, noDispErrors[4]]);
    if (!terms) setErrors([noDispErrors[0], noDispErrors[1], noDispErrors[2], noDispErrors[3], `You must agree to the Terms of Service`]);
    console.log(errors);
    if (noDispErrors.filter(e => e !== null).length > 0) return;
    setLoading(true);
    axiose.post(`/api/v${APIVersion}/auth/signup`, {
      username,
      email,
      password,
      newsletter
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(res => {
      setLoading(false);
      if (res.data.error) {
        setErrors([res.data.error, res.data.error, res.data.error, res.data.error, res.data.error]);
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
    axiose.post(`/api/v${APIVersion}/auth/signup`, {
      username,
      email,
      password,
      newsletter,
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
        setErrors([res.data.error, res.data.error, res.data.error, res.data.error, res.data.error]);
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
      setErrors([err.response.data.error, err.response.data.error, err.response.data.error, err.response.data.error, err.response.data.error]);
      (captchaRef.current)?.resetCaptcha();
    });
  }
  return (
    <StrictMode>
      <div className="grid place-content-center h-full bg-gradient-1">
        <form className={SignupBox} onSubmit={submit} style={(captcha || showLoading) ? { display: "none"}:{ display: "block" }}>
          <h1 className="text-4xl text-white font-bold text-center mb-4">Sign Up</h1>
          <TextBox placeholder="John" value={username} onChange={(e:any) => setUsername(e.target.value)} id="username" label="Username" required error={errors[0]} />
          <TextBox placeholder="john@example.com" type="email" value={email} onChange={(e:any) => setEmail(e.target.value)} id="email" label="Email Address" required error={errors[1]} />
          <TextBox placeholder="********" type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} id="password" label="Password" required error={errors[2]} />
          <TextBox placeholder="********" type="password" value={passwordConfirm} onChange={(e:any) => setPasswordConfirm(e.target.value)} id="passwordConfirm" label="Confirm Password" required error={errors[3]} />
          <CheckBox checked={terms} onChange={(e:any) => setTerms(e.target.checked)} id="terms" label="I agree to the Terms of Service" required error={errors[4]} />
          <CheckBox checked={newsletter} onChange={(e:any) => setNewsletter(e.target.checked)} id="newsletter" label="Subscribe to our newsletter" />
          <Button text="Sign Up" id="signup" priority={Colors.PRIMARY} type="submit" loading={loading} />
          <hr className="my-4" />
          <p className="text-center text-white">Already have an account? <Link to="/login" className="text-blue-500">Log in</Link></p>
        </form>
        <form className={SignupBox} style={(captcha && !showLoading) ? { display: "block"}:{ display: "none"}}>
          <h1 className="text-4xl text-white font-bold text-center mb-4">Sign Up</h1>
          {captchaKey && <div className="flex justify-center items-center h-4/5"><HCaptcha sitekey={captchaKey} onVerify={submitCaptcha} ref={captchaRef} /></div>}
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