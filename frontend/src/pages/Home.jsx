import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1695066584644-5453334ff5ac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] min-h-screen pt-8 flex flex-col justify-between w-full'>
                <img className='w-14 ml-4 sm:ml-9' src='https://1000logos.net/wp-content/uploads/2021/04/Uber-logo.png' alt='uber-logo' />
                <div className='bg-white pb-7 py-4 px-4 sm:px-8 max-w-md w-full mx-auto rounded-t-2xl sm:rounded-2xl shadow-lg mb-0 sm:mb-8'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-center'>Get Started with Uber</h2>
                    <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5 text-base sm:text-lg'>Continue</Link>
                </div>
            </div>
        </div>
    )
}

export default Home