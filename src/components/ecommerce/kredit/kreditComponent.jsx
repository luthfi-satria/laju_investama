import { Link, useLocation, useOutletContext } from "react-router-dom";
import userDefault from '../../../assets/images/userDefault.png';
import { useEffect, useMemo, useState } from "react";
import ShowSweetAlert from "../../../helpers/showAlert";
import EcommerceHistoryCredit from "./historyKredit";

export default function KreditComponent(){
    const {
        CreateIcon,
        profile,
        AxiosRequest,
    } = useOutletContext();
    const location = useLocation().pathname.split('/');
    const [title, setTitle] = useState(false);
    const [transaksi, setTransaksi] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const defaultFilter = useMemo(() => ({
        page: 1,
        limit: 10,
        profile_phone: '',
    }),[location]);
    
    const [filter, setFilter] = useState(defaultFilter);
    
    // SCROLL FUNCTION
    window.onscroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
            if(transaksi){
                const total = totalData || 0;
                const limit = filter.limit;
                const page = filter.page;
                if(total > (page * limit)){
                    setFilter({...filter, page: page+1});
                    setRefresh(true);
                }
            }
        }
    }

    const errResponseHandler = (err) => {        
        ShowSweetAlert({
            icon: 'warning',
            title: 'Request Error',
            text: err.message
        });
    }

    useEffect(() => {
        if(filter.profile_phone == ''){
            AxiosRequest('get','api/user/profile', {},{})
            .then(({data}) => {
                setFilter({...filter, profile_phone: data?.data?.profile?.phone});
            });
        }
    },[AxiosRequest, filter]);

    useEffect(() => {
        if((!transaksi && filter.profile_phone != '') || refresh){
            setIsLoading(true);
            AxiosRequest('get','api/angsuran', filter, {})
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw(data);
                }

                if(data?.data?.page == 1){
                    setTransaksi(data?.data?.items);
                    setTotalData(data?.data?.total);
                }
                else{
                    const newItems = data?.data?.items;
                    const mergeItems = transaksi.concat(newItems);
                    setTransaksi(mergeItems);
                }                
            }).catch((error) => {
                errResponseHandler(error);
            }).finally(()=>{
                setRefresh(false);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            });
        }
    },[filter, AxiosRequest, transaksi, refresh]);
    
    return (
        <>
            <div 
                id="main_display"
                className="mt-32 sm:mt-28 h-full min-h-screen"
            >
                <div className="grid sm:grid-cols-4">
                    <div className="relative sm:border-r border-gray-200 sm:h-screen">
                        {/* PROFILE */}
                        <div className="hidden w-full sm:flex items-center justify-start px-4 py-2">
                            <Link
                                to={'/'}
                                className="flex items-center justify-center"
                            >
                                <img 
                                    src={userDefault} 
                                    className="w-12 h-12 mr-2 rounded-full" 
                                />
                                <div className="flex flex-col justify-between">
                                    <h3 className="text-lg font-bold leading-3">{profile?.username?.substring(0,8)}</h3>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full sm:col-span-3 px-4 py-4">
                        <EcommerceHistoryCredit
                            title={title}
                            dataKredit={transaksi}
                            CreateIcon={CreateIcon}
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="bg-white opacity-80 z-50 w-full h-screen fixed top-0 flex items-center justify-center">
                        <div className="w-1/2 text-center text-black font-bold text-2xl m-auto">
                            LOADING...
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}