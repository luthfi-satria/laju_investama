import { useCallback, useEffect, useMemo, useState } from "react";
import imgDefault from '../../../assets/images/noproduct_img.png';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import ShowSweetAlert from "../../../helpers/showAlert";
import { IntlCurrency, NumericalOnly } from "../../../helpers/converterHelper";

export default function MyCart(){
    const {
        AxiosRequest, 
        CreateIcon,
        TotalCart,
        SetTotalCart,
    } = useOutletContext();
    const navigate = useNavigate();
    const [filter, setFilter] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [listCart, setListCart] = useState(false);
    const [selectedCart, setSelectedCart] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStatus, setProcessStatus] = useState(null);
    const [TotalBarang, setTotalBarang] = useState(0);
    const [TotalHarga, setTotalHarga] = useState(0);
    
    const initFilter = useMemo(() => ({
        page : 1,
        limit: 20
    }),[]);

    useEffect(() => {
        if(!filter){
            setFilter(initFilter);
        }
    },[filter, initFilter]);

    useEffect(() => {
        if(processStatus){
            setTimeout(()=>{
                setProcessStatus(false);
            }, 1000);
        }
    },[processStatus]);

    const countCart = useCallback(() => {
        let total_harga = 0;
        let total_item = 0;
        if(selectedCart.length > 0){
            listCart.items.map((el) => {
                if(selectedCart.includes(el.id)){
                    total_harga = total_harga + (el?.product?.harga_jual * el?.qty);
                    total_item = total_item + el?.qty
                }
            });
        }
        return [total_harga, total_item]
    }, [listCart, selectedCart]);

    useEffect(()=>{
        if(selectedCart){
            const [total_harga, total_item] = countCart();
            setTotalBarang(total_item);
            setTotalHarga(total_harga);
        }
    },[selectedCart, countCart]);

    const errResponseHandler = (err) => {
        console.log(err);
        
        ShowSweetAlert({
            icon: 'warning',
            title: 'Request Error',
            text: err.message
        });
    }

    // SCROLL FUNCTION
    window.onscroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            if(listCart){
                const total = listCart?.total || 0;
                const limit = listCart?.limit || 10;
                const page = listCart?.page || 1;
                if(total > (page * limit)){
                    setFilter({...filter, page: page+1});
                    setRefresh(true);
                }
            }
        }
    }
    
    useEffect(()=>{
        if(filter && refresh){
            AxiosRequest('get', 'api/cart', filter, {})
            .then(({data}) => {
                if(data?.statusCode == 400){
                    throw {
                        message: 'Server sedang bermasalah'
                    };
                }

                if(data?.data?.page == 1){
                    setListCart(data?.data);
                }
                else{
                    const listItems = listCart?.items;
                    const newItems = data?.data?.items;
                    const mergeItems = listItems.concat(newItems);
                    setListCart({...listCart, items: mergeItems, page:data?.data?.page});
                }
            })
            .catch((error) => {
                errResponseHandler(error);
            })
            .finally(()=> {
                setRefresh(false);
            });
        }
    },[filter, refresh, AxiosRequest, listCart]);

    const convImg = (data) => {
        const baseUrl = import.meta.env.VITE_APIURL;
        return data?.image ? baseUrl+'/api/product/'+data.id+'/image/'+data.image : imgDefault;
    }

    const updateCart = (value, index, key) => {
        const cart = {...listCart.items[index], [`${key}`]: value};
        listCart.items[index] = cart;
        setListCart(listCart);
        const [total_harga, total_item] = countCart();
        setTotalBarang(total_item);
        setTotalHarga(total_harga);
        
        clearTimeout(processStatus);
        const timeout = sendUpdate(index);
        setProcessStatus(timeout);

    }
    
    const sendUpdate = (index) => {
        // setIsProcessing(true);
        return setTimeout(()=>{
            const product = listCart?.items[index];
            AxiosRequest('put', 'api/cart', {}, {
                product_id: product?.product_id,
                qty: Number(product?.qty),
                catatan: product?.catatan,
            }).then(({data}) =>{
                if(data.statusCode == 400){
                    throw data;
                }
                // setProcessStatus(true);
            }).catch((err) => {
                console.log('[ERROR] ', err);
            }).finally(() => {
                // setIsProcessing(false);
            });
        }, 2000);
    }

    const sendDelete = (index) => {
        setIsProcessing(true);
        setTimeout(()=>{
            const product = listCart?.items[index];
            AxiosRequest('delete', 'api/cart/'+product?.id)
            .then(({data}) =>{
                if(data.statusCode == 400){
                    throw data;
                }
                setProcessStatus(true);
                navigate(0);
            }).catch((err) => {
                console.log('[ERROR] ', err);
            }).finally(() => {
                setIsProcessing(false);
                delete listCart.items[index];
            });
        }, 1500);
    }

    const handleOrder = () => {
        ShowSweetAlert({
            title: 'Lanjutkan buat pesanan?',
            confirmButtonText: 'Buat order baru!',
            showCancelButton: true,
        }, true).then((result) => {
            if(result.isConfirmed){
                setIsProcessing(true);
                AxiosRequest('post', 'api/order', {}, {
                    cart_ids: selectedCart
                }).then(({data}) => {
                    if(data.statusCode == 400){
                        setProcessStatus(true);
                    }
                })
                .finally(()=>{
                    setTimeout(() => {
                        setIsProcessing(false);
                        navigate('/order', {replace: true});
                    }, 2000);
                });
            }
        });
    }

    const moveItem = (item_id) => {
        AxiosRequest('post',`api/wish/movetowish/${item_id}`)
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
                className="mt-40 sm:mt-[4rem] px-4 py-4 h-[90vh] flex items-center justify-center"
            >
                {isProcessing && (
                    <div className="fixed top-0 left-0 h-full w-full bg-black opacity-80 z-20 flex items-center justify-center">
                        <div className="text-white text-3xl font-bold">
                            Updating
                        </div>
                    </div>
                )}

                <div className="relative w-full">
                {listCart && listCart.items.length > 0 && (
                    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* CART CONTENT */}
                        <div id="detailCart" className="relative overflow-auto h-[70vh] col-span-2">
                            <div id="cartContainer" className="relative px-2 py-2 border-2 border-gray-200 rounded-sm">
                                <div id="detailCart-title">
                                    <h2 className="font-bold text-lg text-gray-500 mb-2">KERANJANG</h2>
                                    {/* CHECK ALL */}
                                    <div className="border-b-2 border-slate-200 py-2 px-2">
                                        <label className="w-full cursor-pointer" htmlFor="cart-slc-all">
                                            <input 
                                                type="checkbox"
                                                name="slc_all"
                                                id="cart-slc-all"
                                                defaultChecked={selectedCart.length > 0 ? true : false}
                                                className="w-5 h-5 cursor-pointer"
                                                onChange={(e) => {
                                                    if(e.target.checked == false){
                                                        setSelectedCart([]);
                                                    }else{
                                                        setSelectedCart(listCart?.items.map((items) => {
                                                            return items?.id;
                                                        }));
                                                    }
                                                }}
                                            />
                                            <span className="ml-5"> Pilih Semua</span>
                                        </label>
                                    </div>
                                    {/* ITEM LIST */}
                                    {listCart && listCart?.items.map((items, index) => (
                                        <div 
                                            id={`cartItem${index}`}
                                            key={index}
                                            className="flex w-full mt-2 border-b border-b-gray-200 pb-4">
                                            <div className="ml-2 mr-5">
                                                <label htmlFor={`slc-${items?.id}`}>
                                                    <input 
                                                        type="checkbox"
                                                        name="slc-product"
                                                        id={`slc-${items?.id}`}
                                                        checked={selectedCart.includes(items.id) ? true : false}
                                                        className="w-5 h-5 cursor-pointer"
                                                        onChange={(e) => {
                                                            if(e.target.checked){
                                                                setSelectedCart(selectedCart.concat([items.id]));
                                                            }else{
                                                                setSelectedCart(selectedCart.filter((el) => {
                                                                    return el != items.id
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                            <div className="items-center content-center w-24 sm:w-44 h-20 bg-gray-100 rounded-md">
                                                <img src={convImg(items?.product)} title={items?.product?.name} />
                                            </div>
                                            <div className="ml-5 w-1/2">
                                                <div className="text-md mb-1">{items?.product?.name}</div>
                                                <div className="text-lg font-bold mb-1">{IntlCurrency(items?.product?.harga_jual)}</div>
                                                <div className="text-md font-semibold mb-1 text-gray-500">Sisa: {items?.product?.stok - items?.product?.min_stok} unit</div>
                                                {/* ADD CATATAN */}
                                                <div className="block mb-2">
                                                    <textarea
                                                        type="text"
                                                        name="catatan"
                                                        className="w-full ring-1 ring-gray-200 px-2 py-2 outline-0"
                                                        defaultValue={items?.catatan || ''}
                                                        placeholder="tulis catatan.."
                                                        onBlur={(e) => updateCart(e.target.value, index, 'catatan')}
                                                    >
                                                    </textarea>
                                                </div>
                                                {/* BUTTON INCREMENT DECREMENT */}
                                                <div>
                                                    <span className="mr-2 text-md text-gray-400 font-semibold">Qty</span>
                                                    <button
                                                        id={`qty_dec${items.id}`}
                                                        className={`px-2 py-1 text-xs bg-green-700 focus:outline-none text-white rounded-full`}
                                                        onClick={() => {
                                                            let el = document.getElementById(`qty${items.id}`);
                                                            if(el.value >= 2){
                                                                let currenQty = parseInt(el.value) - 1;
                                                                el.value = currenQty;
                                                                updateCart(currenQty, index, 'qty');
                                                                SetTotalCart(TotalCart - 1);
                                                            }
                                                        }}
                                                    >
                                                        {CreateIcon('minus')}
                                                    </button>
                                                    <input 
                                                        type="text"
                                                        id={`qty${items?.id}`}
                                                        name="qty" 
                                                        defaultValue={items?.qty || 1}
                                                        placeholder="1"
                                                        onChange={(e) => {
                                                            e.target.value = NumericalOnly(e.target.value);
                                                            if(e.target.value > 1){
                                                                e.target.previousSibling.classList.toggle('disabled:opacity-25')
                                                            }
                                                            updateCart(Number(e.target.value), index, 'qty');
                                                        }}
                                                        className="mr-2 ml-2 w-10 ring-1 ring-gray-200 px-2 py-0 outline-0"
                                                    />
                                                    <button
                                                        className="px-2 py-1 text-xs bg-green-700 text-white rounded-full"
                                                        onClick={() => {
                                                            let el = document.getElementById(`qty${items.id}`);
                                                            let currenQty = parseInt(el.value) + 1;
                                                            if(currenQty <= (items?.product?.stok - items?.product?.min_stok)){
                                                                el.value = currenQty;
                                                                updateCart(currenQty, index, 'qty');
                                                                SetTotalCart(TotalCart + 1);
                                                            }
                                                        }}
                                                    >
                                                        {CreateIcon('plus')}
                                                    </button>
                                                </div>
                                                <div className="mt-5 flex items-start justify-stretch">
                                                    <button type="button"
                                                        className="mr-2 text-xs bg-red-500 text-white ring-1 ring-red-400 px-4 py-2 rounded-md hover:bg-red-600"
                                                        onClick={() => sendDelete(index)}
                                                    >
                                                        <div className="inline-block w-1/3">
                                                            {CreateIcon('trash','text-white text-sm')}
                                                        </div>
                                                        <div className="inline-block w-2/3">
                                                            Hapus
                                                        </div>
                                                    </button>
                                                    <button type="button"
                                                        className="text-xs text-gray-500 ring-1 ring-gray-400 px-4 py-2 rounded-md hover:bg-gray-200"
                                                        onClick={() => moveItem(items?.product_id)}
                                                    >
                                                        <div className="inline-block w-1/3">
                                                            {CreateIcon('heart-circle-plus','text-red-500 text-sm')}
                                                        </div>
                                                        <div className="inline-block w-2/3">
                                                            Pindahkan
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div id="summaryCart"
                            className="bg-white sticky w-full sm:w-full z-10 top-[11.5rem] sm:top-32 left-30 py-2 px-2 border-b-2 border-gray-200"
                        >
                            <div className="border border-gray-200 px-4 py-2 rounded-md" id="summaryDetail">
                                <h3 className="text-lg font-bold mb-4">Ringkasan Belanja</h3>
                                <div className="mb-4">
                                    Total Item (<span className="font-bold">{TotalBarang}</span> Item)
                                </div>
                                <div>
                                    <span className="text-lg">Total Harga</span>
                                    <span className="float-right font-bold text-2xl">{IntlCurrency(TotalHarga)}</span>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="w-full rounded-md mt-5 px-4 py-2 bg-teal-500 text-white text-md font-semibold hover:bg-teal-600 cursor-pointer"
                                    onClick={handleOrder}
                                >
                                    Beli
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {listCart && listCart?.items.length == 0 && (
                    <div className="relative w-full flex items-center justify-center bg-white min-h-screen overflow-hidden">
                        <div className="text-3xl text-center font-bold w-2/3 h-60">
                            <h1 className="mb-10">
                                {CreateIcon('shopping-cart','text-[200px] text-teal-400')}
                            </h1>
                            <p className="text-gray-500">Mohon maaf, keranjang anda masih kosong!
                                <Link to={'..'} replace={true} className="block text-md text-teal-400 mt-8 hover:text-teal-600">
                                    Kembali
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </>
    );
}