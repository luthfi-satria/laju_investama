import CommerceNavbar from "../../components/ecommerce/navbar";
import { useCallback, useEffect, useMemo, useState } from 'react';
import EcommerceSidebar from '../../components/ecommerce/sidebar';
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
    const srcField = useMemo(() => ({
        page: 1,
        limit: 10,
        name: '',
        status: 'publish',
        category_id: [],
        harga_min: 0,
        harga_max: null,
        stock_status: 'tersedia',
        order_by: '',
        orientation: 'ASC',
    }),[]);

    const [search, setSearch] = useState(srcField);
    const [category, setCategory] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [totalCart, setTotalCart] = useState(0);
    const [product, setProduct] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(()=>{},[srcField, totalCart]);

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

    // GET CATEGORY
    useEffect(()=>{
        if(!category){
            axiosRequest('get', 'api/category', {
                page: 1,
                limit: 1000,
            })
            .then(({data})=>{
                if(data.statusCode == 400){
                    throw(data);
                }
                setCategory(data?.data);
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    },[category, axiosRequest]);

    // SCROLL FUNCTION
    window.onscroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            if(product){
                const total = product?.total || 0;
                const limit = product?.limit || 10;
                const page = product?.page || 1;
                if(total > (page * limit)){
                    setSearch({...search, page: page+1});
                    setRefreshProduct(true);
                }
            }
        }
    }

    useEffect(()=>{
        if(!product || refreshProduct){
            setLoader(true);
            setTimeout(()=>{
                axiosRequest('get','api/product', search, {})
                .then(({data})=>{
                    if(data.statusCode == 400){
                        throw(data);
                    }
    
                    if(data?.data?.page == 1){
                        setProduct(data?.data);
                    }
                    else{
                        const productItems = product?.items;
                        const newItems = data?.data?.items;
                        const mergeItems = productItems.concat(newItems);
                        setProduct({...product, items: mergeItems, page:data?.data?.page});
                    }
                })
                .finally(()=>{
                    setRefreshProduct(false);
                    setLoader(false);
                });
            }, 1000);
        }
    }, [search, axiosRequest, product, refreshProduct]);

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

    const showSidebar = () => {
        setToggleSidebar(toggleSidebar ? false: true);
    }

    const orderProduct = (value) => {
        if(value == 'harga_terendah'){
            setSearch({...search, order_by: 'harga', orientation: 'ASC'});
        }
        else if(value == 'harga_tertinggi'){
            setSearch({...search, order_by: 'harga', orientation: 'DESC'});
        }else{
            setSearch({...search, order_by: 'name', orientation: 'ASC'});
        }
    }
    
    const resetFilter = () => {
        srcField.category_id = [];
        setRefreshProduct(true);
        setSearch({...search, ...srcField});
    }
    
    return(
        <>
            <div id="ecommerce">
                <CommerceNavbar
                    token={token}
                    RouteURL={RouteURL}
                    search={search}
                    setSearch={setSearch}
                    createIcon={newIcon}
                    showSidebar={showSidebar}
                    setRefreshProduct={setRefreshProduct}
                    profile={profile}
                    totalCart={totalCart}
                    currentPath={location}
                />
                {location?.pathname == '/' && (
                    <EcommerceSidebar
                        createIcon={newIcon}
                        AxiosRequest={axiosRequest}
                        Category={category}
                        Search={search}
                        SetSearch={setSearch}
                        ToggleSidebar={toggleSidebar}
                        setRefreshProduct={setRefreshProduct}
                        ResetFilter={resetFilter}
                    />
                )}
                <Outlet context={{
                        AxiosRequest: axiosRequest,
                        profile: profile,
                        search: search,
                        setSearch: setSearch,
                        CreateIcon: newIcon,
                        product: product,
                        setProduct: setProduct,
                        orderProduct: orderProduct,
                        IsLoading: loader,
                        TotalCart: totalCart,
                        SetTotalCart: setTotalCart,
                    }
                }/>
            </div>
        </>
    );
}