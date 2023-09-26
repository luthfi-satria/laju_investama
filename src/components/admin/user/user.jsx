import { Helmet, HelmetProvider } from "react-helmet-async";
import RouteURL from "../../../constants/routesConstant";
import { useOutletContext } from 'react-router-dom';
import UserComponent from "./fragment/userComponent";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUser(){
    const token = useOutletContext();
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
                        <h3 className="uppercase text-blueGray-400 mb-1 text-sm text-white font-semibold">
                            {RouteURL.USERS.HELMET.title}
                        </h3>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    <UserComponent 
                        token={token}
                        usergroup={usergroup}
                    />
                </div>
            </div>
        </>
    )
}