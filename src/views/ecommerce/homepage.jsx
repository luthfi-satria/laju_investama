import { useOutletContext } from "react-router-dom"
import ProductList from "../../components/ecommerce/product/produkList";
import { useEffect, useMemo, useState } from "react";
import EcommerceSidebar from "../../components/ecommerce/sidebar";

export default function HomePage(){
    const {
        profile, 
        CreateIcon, 
        IsLoading, 
        setLoader,
        AxiosRequest,
        TotalCart,
        SetTotalCart,
    } = useOutletContext();

    const srcField = useMemo(() => ({
        page: 1,
        limit: 10,
        name: '',
        status: 'publish',
        category_id: [],
        harga_min: '',
        harga_max: '',
        stock_status: 'tersedia',
        order_by: 'name',
        orientation: 'ASC',
    }),[]);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [search, setSearch] = useState(srcField);
    const [category, setCategory] = useState(false);
    const [product, setProduct] = useState(false);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [scrollData, setScrollData] = useState({
        innerHeight: 0,
        screenTop: 0,
        offsetHeight: 0,
        innerScrollTop: 0,
        maxOffset: 0,
    });

    useEffect(()=>{},[srcField, TotalCart]);

    // GET CATEGORY
    useEffect(()=>{
        if(!category){
            AxiosRequest('get', 'api/category', {
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
    },[category, AxiosRequest]);

    // SCROLL FUNCTION
    window.onscroll = () => {
        setScrollData({
            ...scrollData, 
            innerHeight: window.innerHeight, 
            screenTop: document.documentElement.scrollTop,
            offsetHeight: document.documentElement.offsetHeight,
            innerScrollTop: window.innerHeight + document.documentElement.scrollTop,
            maxOffset: document.documentElement.offsetHeight - 100,
        });
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
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
                AxiosRequest('get','api/product', search, {})
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
                return false;
            }, 1000);
            setRefreshProduct(false);
        }
    }, [search, AxiosRequest, product, refreshProduct, setLoader]);

    const orderProduct = (value) => {
        if(value == 'harga_terendah'){
            setSearch({...search, order_by: 'harga_jual', orientation: 'ASC', page: 1});
        }
        else if(value == 'harga_tertinggi'){
            setSearch({...search, order_by: 'harga_jual', orientation: 'DESC', page: 1});
        }else{
            setSearch({...search, order_by: 'name', orientation: 'ASC', page: 1});
        }
        setRefreshProduct(true);
    }
    
    const resetFilter = () => {
        setSearch(srcField);
        setRefreshProduct(true);
    }

    const showSidebar = () => {
        setToggleSidebar(toggleSidebar ? false: true);
    }
    return(
        <>
            <EcommerceSidebar
                createIcon={CreateIcon}
                AxiosRequest={AxiosRequest}
                Category={category}
                Search={search}
                SetSearch={setSearch}
                ShowSidebar={showSidebar}
                ToggleSidebar={toggleSidebar}
                setRefreshProduct={setRefreshProduct}
                ResetFilter={resetFilter}
            />
            {/* FOR DEBUGGING */}
            {/* <div className="fixed left-0 w-full z-20 px-4 py-4 bg-slate-300 text-black">
                <p>Inner Height: {scrollData.innerHeight}</p>
                <p>screenTop: {scrollData.screenTop}</p>
                <p>offsetHeight: {scrollData.offsetHeight}</p>
                <p>InnerScrollTop: {scrollData.innerScrollTop}</p>
                <p>MaxOffset: {scrollData.maxOffset}</p>
            </div> */}
            <div 
                id="main_display"
                className="relative mt-28 -ml-1 sm:mt-28 sm:ml-0 md:ml-[17rem] lg:ml-[18rem] px-4 h-full min-h-screen"
            >
                {/* ORDER SECTION */}
                <div
                    className="sticky top-28 md:left-0 py-4 w-full mb-2 flex items-center justify-between z-10 bg-white border-b border-slate-200"
                >
                    <div className="w-1/3">
                        <button
                          onClick={showSidebar}
                          className="block md:hidden text-slate-400 hover:text-slate-700"
                        >
                          {CreateIcon('filter', 'text-2xl mr-3')}
                          Filter
                        </button>
                    </div>
                    <div className="w-2/3 text-right">
                        <span className="hidden sm:inline-block">Urut berdasarkan:</span>
                        <span className="inline-block sm:hidden">
                            {CreateIcon('sort','text-slate-400')}
                        </span>
                        <select
                            id="sortby"
                            name="urutan"
                            className="inline-block ml-2 ring-1 ring-slate-200 px-3 py-2 rounded-md hover:bg-slate-200"
                            onChange={(e) => orderProduct(e.target.value)}
                        >
                            <option>Paling Sesuai</option>
                            <option value={'harga_terendah'}>Harga Terendah</option>
                            <option value={'harga_tertinggi'}>Harga Tertinggi</option>
                        </select>
                    </div>
                </div>

                <ProductList
                    Product={product}
                    SetProductList={setProduct}
                    CreateIcon={CreateIcon}
                    IsLoading={IsLoading}
                    AxiosRequest={AxiosRequest}
                    TotalCart={TotalCart}
                    SetTotalCart={SetTotalCart}
                    profile={profile}
                />
            </div>
        </>
    )
}