import { auth } from './Firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import {BsFillShieldLockFill, BsTelephoneFill} from "react-icons/bs"
import {CgSpinner} from "react-icons/cg"
import OtpInput from "otp-input-react"
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
// import dotenv from 'dotenv'
// dotenv.config()
function App() {
  const [showOtp, setShowOtp] = useState(false)
  const [user,setUser]=useState(false)
  const [loading,setLoading]=useState(false)
  const [ph, setPh] = useState("")
  const [otp, setOtp] = useState("")

  function onCaptchVerify(){
    if(!window.recaptchaVerifier){
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSignUp()
        },
        'expired-callback': () => {
        }
      },auth);
      
    }
  }
  const onSignUp = () => {
    setLoading(true)
    onCaptchVerify()
    const appVerifier=window.recaptchaVerifier
    const formatPh="+"+ph
    signInWithPhoneNumber(auth, formatPh, appVerifier)
    .then((confirmationResult) => {
      
      window.confirmationResult = confirmationResult;
      setLoading(false)
      setShowOtp(true)
      toast.success("OTP sended successfully")
  
    }).catch((error) => {
      console.log(error)
      setLoading(false)
    });
  }
  function onOtpVerify() {
    setLoading(true)
window.confirmationResult.confirm(otp)
  .then((res)=>{
    const user=res.user
    setUser(res.user)
    setLoading(false)
  })
  .catch((error)=>{
    toast.error("verification failed")
    console.log(error)
    setLoading(false)
  })
 
    
  }
  // const sendOtp=async()=>{

  //   try {
  //     const reCaptcha=new RecaptchaVerifier(auth,"recaptcha",{})
  //   const confirmation=await signInWithPhoneNumber(auth,ph,reCaptcha)
  //   console.log(confirmation)
  //   } catch (error) {
  //     throw error
  //   }
  // }
  return (
    <section className='bg-gray-400 flex items-center justify-center h-screen'>
   <div>
   <Toaster toastOptions={{duration:4000}}/>
    <div id='recaptcha-container'></div>
     {user ?
     <h1 className='text-center  text-black font-medium text-2xl '>
     👍YOU ARE LOGGED IN👍
  
   </h1> :
      <div className='w-80 flex flex-col gap-4 rounded-lg p-4'>
     <h1 className='text-center leading-normal text-black font-medium text-3xl mb-6'>
       Welcome to page
     </h1>
     {/* otp page */}
    { showOtp ?<>
     <div className='bg-black text-gray-400 w-fit mx-auto p-4 rounded-full'>
     <BsFillShieldLockFill size={30}/>
     </div>
     <label htmlFor='ph' className='font-bold text-xl text-black text-center'>
     Enter your OTP
     </label>
     <OtpInput value={otp} onChange={setOtp} OTPLength={6} otpType="number" disable={false}
     autoFocus
     className="otp-container"
     ></OtpInput>
     <button onClick={onOtpVerify} className='bg-gray-500 w-full flex gap-1  items-center justify-center py-2.5 text-black rounded '>
     { loading && <CgSpinner size={20} className='mt-1 animate-spin'/>}
       <span >Verify</span>
     </button>
     </>
     :
      <>
     <div className='bg-black text-gray-400 w-fit mx-auto p-4 rounded-full'>
     <BsTelephoneFill size={30}/>
     </div>
     <label htmlFor='' className='font-bold text-xl text-black text-center'>
     Verify your phone number
     </label>
    <PhoneInput country={"in"} value ={ph} onChange={(ph)=>setPh("+"+ph)}/>
     <button onClick={onSignUp} className='bg-gray-500 w-full flex gap-1  items-center justify-center py-2.5 text-black rounded '>
     { loading && <CgSpinner size={20} className='mt-1 animate-spin'/>}
       <span >Send code via SMS</span>
     </button>
     </>   }
       </div>
     }
   </div>
  </section>
  );
}

export default App;
