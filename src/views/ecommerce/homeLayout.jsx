import CommerceNavbar from "../../components/ecommerce/navbar";
import { useCallback, useEffect, useState } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { Outlet, useLocation } from "react-router-dom";

export default function HomeLayout({
    token = '',
    profile,
    RouteURL,
}){
    library.add(fas);
    const location = useLocation();
    const [totalCart, setTotalCart] = useState(0);
    const [loader, setLoader] = useState(false);

    const axiosRequest = useCallback((method, path, param={}, data={}, headers={})=>{
        const option = {
            method: method,
            url: import.meta.env.VITE_APIURL+'/'+path,
            params: param,
            data: data,
        };

        if(token && token != ''){
            option.headers = {Authorization: 'Bearer '+token};
        }

        if(Object.keys(headers).length > 0){
            option.headers = {...option.headers, headers};
        }

        return axios(option);
    }, [token]);

    // GET CART TOTAL
    useEffect(()=>{
        if(token && token != '' && profile){
            axiosRequest('get', 'api/cart/total')
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw data;
                }
                setTotalCart(data?.data?.total);
            })
            .catch((error) => {
                console.log('ERROR', error);
            });
        }
    },[token, profile, axiosRequest]);

    const newIcon = (icon, classes) => {
        return <FontAwesomeIcon icon={icon} className={classes}/>;
    }
    
    return(
        <>
            <div id="ecommerce">
                <CommerceNavbar
                    token={token}
                    RouteURL={RouteURL}
                    // search={search}
                    // setSearch={setSearch}
                    createIcon={newIcon}
                    // showSidebar={showSidebar}
                    // setRefreshProduct={setRefreshProduct}
                    profile={profile}
                    totalCart={totalCart}
                    currentPath={location}
                />
                <Outlet context={{
                        AxiosRequest: axiosRequest,
                        profile: profile,
                        CreateIcon: newIcon,
                        IsLoading: loader,
                        setLoader: setLoader,
                        TotalCart: totalCart,
                        SetTotalCart: setTotalCart,
                    }
                }/>
            </div>
        </>
    );
}