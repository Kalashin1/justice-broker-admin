import { sendPasswordResetEmail } from "firebase/auth";
import { FormEvent, useRef } from "react";
import { auth } from "../../../../firebase-setting";

const ForgotPasswordForm = () => {
  const formRef = useRef<HTMLFormElement|null>(null)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const {
      email: {value: email}
    } = formRef.current!
    await sendPasswordResetEmail(auth, email)
    alert("Check your email to reset your password");
  }
  return (
    <form
      className="bg-white rounded-md shadow-2xl p-5"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
      <p className="text-sm font-normal text-gray-600 mb-8">Welcome Back</p>
      <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
        <input
          id="email"
          className=" pl-2 w-full outline-none border-none"
          type="email"
          name="email"
          placeholder="Email Address"
        />
      </div>
      <button
        type="submit"
        className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
