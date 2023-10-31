import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { IntlCurrency } from "../../../helpers/converterHelper";
import imgDefault from '../../../assets/images/noproduct_img.png';
import ShowSweetAlert from "../../../helpers/showAlert";

export default function PembayaranComponent() {
    const {
        AxiosRequest,
        profile,
    } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [kodeTransaksi, setKodeTransaksi] = useState(location.pathname.split('/')[2]);
    const [doSubmit, setDoSubmit] = useState(false);

    const [orderDetail, setOrderDetail] = useState(false);
    const defaultPembayaran = useMemo(()=>({
        kode_transaksi: kodeTransaksi,
        payment_method: 'CASH',
        bank_name: '',
        ref_no: '',
        bukti_transaksi: '',
    }),[kodeTransaksi]);

    const [pembayaran, setPembayaran] = useState(defaultPembayaran);

    useEffect(()=>{},[pembayaran, doSubmit]);

    useEffect(() => {
        if(!orderDetail){
            AxiosRequest('get','api/order/'+kodeTransaksi)
            .then(({data}) => {
                setOrderDetail(data?.data);
            });
        }
    },[orderDetail, AxiosRequest, kodeTransaksi]);

    const convImg = (data) => {
        const baseUrl = import.meta.env.VITE_APIURL;
        return data?.image ? baseUrl+'/api/product/'+data.id+'/image/'+data.image : imgDefault;
    }
    
    const checkout = () => {
        ShowSweetAlert({
            title: 'Apakah anda ingin menyelesaikan pembayaran?',
            confirmButtonText: 'Selesaikan!',
            showCancelButton: true,
        }, true).then((result) => {
            if(result.isConfirmed){
                setDoSubmit(true);
                const formData = new FormData();
                for(const item in pembayaran){
                    if(pembayaran[item]){
                        formData.append(item, pembayaran[item]);
                    }
                }
                AxiosRequest('put', 'api/order', {}, formData, {
                    'Content-Type' : 'multipart/form-data',
                }).then(({data}) => {
                    if(data.statusCode == 400){
                        throw(data);
                    }
                    setTimeout(() => {
                        setDoSubmit(false);
                        navigate('/order',{replace: true});
                    }, 2000);
                });
            }
        });
    }

    return (
        <>
            <div 
                id="pembayaran"
                className="grid sm:px-10 lg:px-20 lg:grid-cols-2 w-full mt-[200px] sm:mt-[150px]"
            >
                <div id="pembayaran-summary" className="px-4 pt-2">
                    <h2 className="text-xl font-medium">Ringkasan Pembelian</h2>
                    <p className="text-gray-400">Cek barang belanjaan anda terlebih dahulu, baru mengisi metode pembayaran</p>
                    <div
                        className="mt-8 space-y-3 rounded-lg px-2 py-4 border sm:px-6 max-h-[50vh] overflow-auto"
                    >
                        {/* ITEM DETAILS */}
                        {orderDetail && orderDetail?.details?.map((items, index) => (
                            <div 
                                key={index}
                                className="flex flex-row rounded-lg bg-white">
                                <img
                                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                                    src={convImg(items?.product)}
                                    alt=""
                                />
                                <div className="flex w-full flex-col px-4 py-4">
                                    <span className="font-semibold">{items?.product?.name}</span>
                                    <span className="float-right text-gray-400">{items?.product?.description || 'tidak ada deskripsi'}</span>
                                    <p className="text-lg font-bold">
                                        {IntlCurrency(items?.harga)}
                                    </p>
                                    <p className="font-semibold text-gray-400">
                                        Qty: 
                                        <span className="font-normal text-lg text-gray-700 ml-2">
                                            {items?.qty}
                                        </span>
                                    </p>

                                </div>
                            </div>
                        ))}
                        {/* END ITEM DETAILS */}
                    </div>
                </div>

                <div className="mt-10 bg-gray-50 px-4 py-8 lg:mt-0 border border-gray-300 rounded-md">
                    <p className="text-3xl font-medium">Detail Pembayaran</p>
                    <div>
                        <div className="relative flex justify-start border-b border-b-gray-200 pb-5">
                            <div className="w-1/3">
                                <h3 className="mt-4 mb-2 block text-sm font-medium">Kode Transaksi</h3>
                                <div className="w-auto px-4 uppercase font-bold">{orderDetail?.kode_transaksi}</div>
                            </div>
                            <div className="w-1/3">
                                <h3 className="mt-4 mb-2 block text-sm font-medium">Total Barang</h3>
                                <div className="font-bold">{orderDetail?.total_item}</div>
                            </div>
                            <div className="w-1/3">
                                <h3 className="mt-4 mb-2 block text-sm font-medium">Total Belanja</h3>
                                <div className="font-bold">{IntlCurrency(orderDetail?.grand_total || 0)}</div>
                            </div>
                        </div>

                        {/* METODE PEMBAYARAN */}
                        <label htmlFor="metode" className="mt-4 mb-2 block text-sm font-medium">Metode Pembayaran</label>
                        <select
                            name="metode"
                            id="metode"
                            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none"
                            onChange={(e) => setPembayaran({...pembayaran, payment_method: e.target.value, bank_name: '', ref_no: '', bukti_transaksi: ''})}
                        >
                            <option value={'CASH'}>TUNAI</option>
                            <option value={'TRANSFER'}>TRANSFER</option>
                            {profile?.level != 'public' && (
                                <option value={'SALARY DEDUCTION'}>POTONG GAJI</option>
                            )}
                        </select>
                        {pembayaran.payment_method == 'CASH' && (
                            <p className="text-gray-500 mt-2 px-4">Silahkan klik <b>selesaikan pembayaran</b> dan lakukan pembayaran langsung melalui staff yang bertugas</p>
                        )}

                        {pembayaran.payment_method == 'SALARY DEDUCTION' && profile?.level != 'public' (
                            <p className="text-gray-500 mt-2 px-4">Silahkan klik <b>selesaikan pembayaran</b> dan pembayaran akan langsung memotong gaji bulanan</p>
                        )}

                        {pembayaran.payment_method == 'TRANSFER' && (
                            <div>
                                {/* BANK NAME */}
                                <label htmlFor="bank_name" className="mt-4 mb-2 block text-sm font-medium">Nama Bank</label>
                                <input
                                    type="text"
                                    name="bank"
                                    id="bank_name"
                                    placeholder="Nama bank..."
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none"
                                    onChange={(e) => setPembayaran({...pembayaran, bank_name: e.target.value})}
                                />
        
                                {/* NO REFERENSI */}
                                <label htmlFor="ref-no" className="mt-4 mb-2 block text-sm font-medium">Nomor Referensi</label>
                                <input
                                    type="text"
                                    name="ref_no"
                                    id="ref-no"
                                    placeholder="Nomor referensi..."
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none"
                                    onChange={(e) => setPembayaran({...pembayaran, ref_no: e.target.value})}
                                />
        
                                {/* BUKTI TRANSFER */}
                                <label htmlFor="bukti_tf" className="mt-4 mb-2 block text-sm font-medium">Bukti Transfer</label>
                                <input
                                    type="file"
                                    name="bukti"
                                    id="bukti_tf"
                                    placeholder="Unggah bukti pembayaran"
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none"
                                    onChange={(e) => setPembayaran({...pembayaran, bukti_transaksi: e.target.files[0]})}
                                />
                            </div>
                        )}

                        <div className="w-full mt-4 mb-2">
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-white text-md font-medium rounded-md bg-teal-500 hover:bg-teal-700"
                                onClick={checkout}
                            >
                                {doSubmit ? 'Pembayaran sedang diproses...' : 'Selesaikan pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}