import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import userDefault from '../../../assets/images/userDefault.png';
import { useEffect, useMemo, useState } from "react";
import ShowSweetAlert from "../../../helpers/showAlert";
import WishDataComponent from "./wishdata";

export default function WishListComponent(){
    const {
        CreateIcon,
        profile,
        AxiosRequest,
    } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation().pathname.split('/');
    const [wish, setWish] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const sideMenu = useMemo(() => [
        {
            to: '../order',
            status: '',
            title: 'Daftar Transaksi',
        },
        {
            to: '../order/waiting',
            status: 'waiting',
            title: 'Menunggu Pembayaran',
        },
        {
            to: '../order/paid',
            status: 'paid',
            title: 'Sudah dibayar',
        },
        {
            to: '../order/proceed',
            status: 'proceed',
            title: 'Diproses',
        },
        {
            to: '../order/success',
            status: 'success',
            title: 'Berhasil',
        },
        {
            to: '../order/canceled',
            status: 'canceled',
            title: 'Dibatalkan',
        }
    ],[]);
    const defaultFilter = useMemo(() => ({
        page: 1,
        limit: 10,
        order_by: 'created_at',
        orientation: 'DESC',
    }),[]);
    const [filter, setFilter] = useState(defaultFilter);

    const errResponseHandler = (err) => {
        console.log(err);
        
        ShowSweetAlert({
            icon: 'warning',
            title: 'Request Error',
            text: err.message
        });
    }

    useEffect(() => {
        if(!wish || refresh){
            AxiosRequest('get','api/wish', filter, {})
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw(data);
                }

                if(data?.data?.page == 1){
                    setWish(data?.data?.items);
                    setTotalData(data?.data?.total);
                }
                else{
                    const newItems = data?.data?.items;
                    const mergeItems = wish.concat(newItems);
                    setWish(mergeItems);
                }                
            }).catch((error) => {
                errResponseHandler(error);
            }).finally(()=>{
                setRefresh(false);
            });
        }
    },[filter, AxiosRequest, wish, refresh]);

    const DeleteWish = (product_id) => {
        setTimeout(()=>{
            AxiosRequest('delete', 'api/wish/'+product_id)
            .then(({data}) =>{
                if(data.statusCode == 400){
                    throw data;
                }
                setRefresh(true);
            }).catch((err) => {
                console.log('[ERROR] ', err);
            }).finally(() => {
                setRefresh(false);
            });
        }, 1500);
    }
    
    const moveItem = (item_id) => {
        AxiosRequest('post',`api/wish/movetocart/${item_id}`)
        .then(({data}) => {
            if(data.statusCode == 400){
                throw data;
            }
            ShowSweetAlert({
                icon: 'success',
                title: 'Sukses',
                text: 'item sudah dipindahkan'
            });
            setTimeout(() => {
                navigate(0);
            }, 1000);
        });                
    }
    return (
        <>
            <div 
                id="main_display"
                className="mt-32 sm:mt-28 h-full min-h-screen"
            >
                <div className="grid sm:grid-cols-4">
                    <div className="hidden sm:block relative sm:border-r border-gray-200 sm:h-screen">
                        {/* PROFILE */}
                        <div className="w-full sm:flex items-center justify-start px-4 py-2">
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
                                                    replace={true}
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

                        <div className="w-full px-4 py-4">
                            <div className="hidden relative w-full sm:flex flex-col justify-between items-start border-t border-gray-300 cursor-pointer">
                                <h3 className="block relative font-bold text-lg leading-6 w-full">
                                    <button
                                        className="flex justify-between items-start w-full text-lg font-bold py-2"
                                    >
                                        <div>Wishlist</div>
                                        <div>
                                            {CreateIcon('chevron-down','rounded-full')}
                                        </div>
                                    </button>
                                </h3>
                                <div id="content-wish" className="w-full">
                                    <ul
                                        className="block list-none w-full overflow-hidden"
                                    >
                                        <li>
                                            <div
                                                className="block relative px-4 py-2 w-full text-left"
                                            >
                                                <Link
                                                    to={'../wishlist'}
                                                    className="block -ml-4 hover:font-bold"
                                                    replace={true}
                                                >
                                                    My Wishlist
                                                </Link>  
                                                </div>                                            
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-3 px-4 py-4">
                        <WishDataComponent 
                            wishData={wish}
                            deleteWish={DeleteWish}
                            CreateIcon={CreateIcon}
                            moveItem={moveItem}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}