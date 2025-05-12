import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const UserRoute = () => {
    const [ok, setOk] = useState(false);
    const user = useSelector(state=> state?.user?.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const passCheck = async () => {
            try {
              const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/user-pass`);
              setOk(data.ok);
            } catch (error) {
              setOk(false);
            } finally {
              setLoading(false); // Set loading to false after check
            }
          };
        if(user?.id) passCheck();
    }, [user?.id]);
    
    if (!user) {
        return <UnAuthorized />;
    }
    if (loading) return <Loading />;
    return ok && <Outlet/>
}

export default UserRoute