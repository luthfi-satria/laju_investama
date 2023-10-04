import CommerceNavbar from "../../components/ecommerce/navbar";
import { useCallback, useEffect, useMemo, useState } from 'react';
import EcommerceSidebar from '../../components/ecommerce/sidebar';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { Outlet } from "react-router-dom";

export default function HomeLayout({
    token = ''
}){
    library.add(fas);

    const srcField = useMemo(() => ({
        page: 1,
        limit: 10,
        name: '',
        status: 'publish',
        category_id: [],
        harga_min: 0,
        harga_max: null,
        stock_status: '',
        order_by: '',
        orientation: 'ASC',
    }),[]);

    const [search, setSearch] = useState(srcField);
    const [category, setCategory] = useState(false);
    const [authorization, setAuthorization] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [product, setProduct] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(()=>{},[srcField]);

    useEffect(()=>{
        if(!authorization && token != ''){
            setAuthorization({
                Authorization: 'Bearer '+ token,
            })
        }
    },[token, authorization]);

    const axiosRequest = useCallback((method, path, param={}, data={}, headers={})=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/'+path,
            headers: {
                ...authorization,
                ...headers
            },
            params: param,
            data: data,
        });
    }, []);

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
            .catch((err) => {
                console.log('ERR', err);
                throw err;
            })
        }
    },[category, axiosRequest]);

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
                    search={search}
                    setSearch={setSearch}
                    createIcon={newIcon}
                    showSidebar={showSidebar}
                    setRefreshProduct={setRefreshProduct}
                />
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
                <Outlet context={{
                        AxiosRequest: axiosRequest,
                        search: search,
                        setSearch: setSearch,
                        CreateIcon: newIcon,
                        product: product,
                        setProduct: setProduct,
                        orderProduct: orderProduct,
                        IsLoading: loader
                    }
                }/>
            </div>
        </>
    );
}