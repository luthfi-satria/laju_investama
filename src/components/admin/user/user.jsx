import { Helmet, HelmetProvider } from "react-helmet-async";
import UserComponent from "./fragment/userComponent";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUser({
    token,
    RouteURL
}){
    const [usergroup, setUsergroup] = useState(false);

    useEffect(()=>{
        if(!usergroup){
            axios({
                method: 'get',
                url: import.meta.env.VITE_APIURL+'/api/usergroup',
                headers: {
                    Authorization: 'Bearer '+token
                },
                params: {
                    page: 1,
                    limit: 100
                }
            })
            .then(({data})=>{
                if(data.statusCode == 400){
                    throw(data);
                }

                if(data?.data){
                    const listGroup = data.data.items;
                    setUsergroup(listGroup);
                }
            })
            .catch((error)=>{
                console.log('Error', error);
            });
        }
    },[usergroup, token]);

    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.USERS.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-3 text-2xl text-white font-semibold py-2 border-b border-white">
                            {RouteURL.USERS.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="flex-auto">
                    <UserComponent 
                        token={token}
                        usergroup={usergroup}
                    />
                </div>
            </div>
        </>
    )
}