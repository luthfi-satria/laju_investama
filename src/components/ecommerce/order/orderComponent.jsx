import { Link, useLocation, useOutletContext } from "react-router-dom";
import userDefault from '../../../assets/images/userDefault.png';
import { useEffect, useMemo, useState } from "react";
import OrderTransaction from "./orderTransaksi";
import ShowSweetAlert from "../../../helpers/showAlert";

export default function MyOrderComponent(){
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
    const defaultFilter = useMemo(() => ({
        page: 1,
        limit: 10,
        platform: 'ecommerce',
        status: location[2] ? location[2] : '',
        kode_transaksi: '',
        payment_method: '',
        date_start: '',
        date_end: '',
        order_by: 'created_at',
        orientation: 'DESC',
    }),[location]);
    
    const [filter, setFilter] = useState(defaultFilter);
    
    // SCROLL FUNCTION
    window.onscroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 === document.documentElement.offsetHeight) {
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
    const sideMenu = useMemo(() => [
        {
            to: '/order',
            status: '',
            title: 'Daftar Transaksi',
        },
        {
            to: '/order/waiting',
            status: 'waiting',
            title: 'Menunggu Pembayaran',
        },
        {
            to: '/order/paid',
            status: 'paid',
            title: 'Sudah dibayar',
        },
        {
            to: '/order/proceed',
            status: 'proceed',
            title: 'Diproses',
        },
        {
            to: '/order/success',
            status: 'success',
            title: 'Berhasil',
        },
        {
            to: '/order/canceled',
            status: 'canceled',
            title: 'Dibatalkan',
        }
    ],[]);

    const errResponseHandler = (err) => {
        console.log(err);
        
        ShowSweetAlert({
            icon: 'warning',
            title: 'Request Error',
            text: err.message
        });
    }

    useEffect(() => {
        if(!transaksi || refresh){
            AxiosRequest('get','api/order', filter, {})
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
            });
        }
    },[filter, AxiosRequest, transaksi, refresh]);
    

    const batalkanPesanan = (dataOrder) => {
        console.log('Data order', dataOrder);
        ShowSweetAlert({
            title: 'Batalkan pesanan?',
            confirmButtonText: 'Batalkan',

        }, true).then((response) => {
            if(response.isConfirmed){
                AxiosRequest('post', 'api/order/abort/'+dataOrder.kode_transaksi)
                .then(({data}) => {
                    console.log('RESPONSE', data);
                    document.location.reload();
                })
                .catch((error) => {
                    console.log('ERROR BATAL PESANAN', error);
                });
            }
            console.log(response);
        });
    }
    return (
        <>
            <div 
                id="main_display"
                className="mt-44 sm:mt-32 px-4 py-4 h-full min-h-screen"
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

                        {/* MENUS */}
                        <div className="w-full px-4 py-4">
                            <div className="hidden relative w-full sm:flex flex-col justify-between items-start border-t border-gray-300 cursor-pointer">
                                <h3 className="block relative font-bold text-lg leading-6 w-full">
                                    <button
                                        className="flex justify-between items-start w-full text-lg font-bold py-2"
                                    >
                                        <div>Pembelian</div>
                                        <div>
                                            {CreateIcon('chevron-down','rounded-full')}
                                        </div>
                                    </button>
                                </h3>
                                <div id="content-pembelian" className="w-full">
                                    <ul
                                        className="block list-none w-full overflow-hidden"
                                    >
                                        {sideMenu.map((item, index) => (
                                            <li key={index}>
                                                <div
                                                    className="block relative px-4 py-2 w-full text-left"
                                                >
                                                <Link
                                                    to={item.to}
                                                    className="block -ml-4 hover:font-bold"
                                                    onClick={() => {
                                                        setFilter({...filter, status: item.status})
                                                        setTitle(item.title)
                                                        setRefresh(true);
                                                    }}
                                                >
                                                    {item.title}
                                                </Link>  
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* MENUS ON MOBILE */}
                        <div className="w-full max-w-md px-4 pb-4 overflow-auto flex items-start justify-between sm:hidden">
                            {sideMenu.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="rounded-md px-4 py-2 text-ellipsis min-h-[70px] flex items-center justify-center max-[200px] bg-gray-200 mr-2 border-2 border-gray-500 hover:bg-gray-300"
                                    onClick={() => {
                                        setFilter({...filter, status: item.status})
                                        setTitle(item.title)
                                        setRefresh(true);
                                    }}
                                >
                                    <div className="text-gray-600 font-semibold">{item.title}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="sm:col-span-3 px-4 py-4">
                        <OrderTransaction
                            title={title}
                            dataOrder={transaksi}
                            CreateIcon={CreateIcon}
                            batalkanPesanan={batalkanPesanan}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}