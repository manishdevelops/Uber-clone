import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const CaptainLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/captains/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                toast.success('Logged out successfully!')
                setTimeout(() => {
                    navigate('/captain-login')
                }, 1500);
            }
        }).catch((error) => {
            toast.error(
                error?.response?.data?.message ||
                'Logout failed. Please try again.'
            )

        })
    }, [token, navigate])

    return (
        <>
            <ToastContainer />
            <div>CaptainLogout</div>
        </>
    )
}

export default CaptainLogout