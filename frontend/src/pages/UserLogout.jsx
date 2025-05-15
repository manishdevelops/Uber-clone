import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()


    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('token')
            navigate('/login')
        }
    }).catch((error) => {
        toast.error(
            error?.response?.data?.message ||
            'Logout failed. Please try again.'
        )
    })


    return (
        <>
            <ToastContainer />
            <div>UserLogout</div>
        </>
    )
}

export default UserLogout