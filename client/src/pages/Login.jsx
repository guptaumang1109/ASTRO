import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState("login")

  const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

  const handleSubmit = async (e) => {
        e.preventDefault()

    }

  const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-300 rounded-lg shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <h1 className="text-white text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-2xl font-medium m-auto text-gray-300">Please sign in to continue</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-black/20 border border-white/10 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-purple-500/50 focus-within:bg-black/40">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0 w-full bg-transparent text-white placeholder-gray-500" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-black/20 border border-white/10 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-purple-500/50 focus-within:bg-black/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0 w-full bg-transparent text-white placeholder-gray-500" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-black/20 border border-white/10 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-purple-500/50 focus-within:bg-black/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0 w-full bg-transparent text-white placeholder-gray-500" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mt-4 text-left text-purple-400 hover:text-purple-300 transition-colors cursor-pointer w-full">
                    <button className="text-sm outline-none cursor-pointer" type="button">Forget password?</button>
                </div>
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-purple-600 hover:bg-purple-500 transition-colors py-2 font-medium shadow-lg shadow-purple-900/20 cursor-pointer">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer text-center w-full">{state === "login" ? "Don't have an account?" : "Already have an account?"} <span className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">click here</span></p>
            </form>
  )
}

export default Login
