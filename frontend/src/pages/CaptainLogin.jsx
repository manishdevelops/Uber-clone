import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { UserDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'


const UserLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState({})

    useEffect(() => {
        console.log(userData)
    }, [userData])

    const submitHandler = (e) => {
        e.preventDefault();

        setUserData({
            email: email,
            password: password
        })

        setEmail('')
        setPassword('')
    }


    return (

        <div className='min-h-screen flex flex-col justify-between bg-white px-4 py-7 sm:px-8 md:px-0'>
            <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-md">
                    <img className='w-36 h-16 mb-10' src="https://static.vecteezy.com/system/resources/previews/027/127/451/original/uber-logo-uber-icon-transparent-free-png.png" alt="driver-logo" />

                    <form onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                        <input
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                            type="email"
                            placeholder='email@example.com'
                        />

                        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

                        <input
                            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            required type="password"
                            placeholder='password'
                        />

                        <button
                            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                        >Login</button>
                    </form>
                    <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
                </div>
            </div>
            <div className="w-full max-w-md mx-auto">
                <Link
                    to='/login'
                    className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                >Sign in as User</Link>
            </div>
        </div>
    )
}

export default UserLogin