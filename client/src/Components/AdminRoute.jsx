import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loading from './Loading';
import UnAuth from './UnAuth';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state=> state?.user?.user)
    useEffect(() => {
        const passCheck = async () => {
            try {
              const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/admin-pass`);
              setOk(data.ok);
            } catch (error) {
              setOk(false);
            } finally {
              setLoading(false); // Set loading to false after check
            }
        };
        if(user?.isVerified
        ) passCheck();
    }, [user?.isVerified])
    if (!user) {
        return <UnAuth />;
    }
    if (loading) return <Loading />;
    return ok && <Outlet />
}

export default AdminRoute