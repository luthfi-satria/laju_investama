import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import imgDefault from '../../../../assets/images/noproduct_img.png';
import { IntlCurrency } from "../../../../helpers/converterHelper";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function TransaksiDetailComponent({
    axiosRequest,
    errorHandler,
    errResponseHandler,
}){
    const location = useLocation().pathname.split('/');
    const [kodeTransaksi, setKodeTransaksi] = useState(location[4]);
    const [orderDetail, setOrderDetail] = useState(false);

    useEffect(() => {
        if(!orderDetail && kodeTransaksi){
            axiosRequest('get','api/order/'+kodeTransaksi)
            .then(({data}) => {
                setOrderDetail(data?.data);
                console.log(data);
            })
            .catch((error) => {
                errorHandler(error);
            });
        }
    },[orderDetail, axiosRequest, kodeTransaksi, errorHandler]);

    const convImg = (data) => {
        const baseUrl = import.meta.env.VITE_APIURL;
        return data?.image ? baseUrl+'/api/product/'+data.id+'/image/'+data.image : imgDefault;
    }
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Detail Transaksi</title>
                </Helmet>
            </HelmetProvider>
            <div 
                id="pembayaran"
                className="bg-white grid lg:grid-cols-2 w-full border-2 border-white px-4 py-4 rounded-md"
            >
                <div id="pembayaran-summary" className="px-4 pt-2">
                    <h2 className="text-xl font-medium">Ringkasan Pembelian</h2>
                    <div
                        className="mt-8 space-y-3 rounded-lg px-2 sm:px-6 max-h-[50vh] overflow-auto"
                    >
                        {/* ITEM DETAILS */}
                        {orderDetail && orderDetail?.details.map((items, index) => (
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
                                    <p className="text-lg font-bold">{IntlCurrency(items?.harga)}</p>
                                </div>
                            </div>
                        ))}
                        {/* END ITEM DETAILS */}

                        {!orderDetail && (
                            <div className="text-white font-bold">
                                TIDAK ADA PRODUK YANG DITAMPILKAN
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 bg-gray-50 px-4 py-8 lg:mt-0 border border-gray-300 rounded-md">
                    <p className="text-3xl font-medium px-4 mb-10">Detail Transaksi</p>
                    <div>
                        <div className="relative grid border-b border-b-gray-200 pb-5">
                            <div className="flex items-center justify-start">
                                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Kode Transaksi</h3>
                                <div className="mt-4 mb-2 block uppercase font-bold">{orderDetail?.kode_transaksi}</div>
                            </div>
                            <div className="flex items-center justify-start">
                                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Total Barang</h3>
                                <div className="mt-4 mb-2 block font-bold">{orderDetail?.total_item}</div>
                            </div>
                            <div className="flex items-center justify-start">
                                <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4 w-1/3">Total Belanja</h3>
                                <div className="mt-4 mb-2 block font-bold">{IntlCurrency(orderDetail?.grand_total || 0)}</div>
                            </div>
                        </div>

                        {/* METODE PEMBAYARAN */}
                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Metode Pembayaran</div>
                            <div className="px-4">{orderDetail?.payment_method}</div>
                        </div>

                        {orderDetail.payment_method == 'TRANSFER' && (
                            <div>
                                <div className="flex items-center justify-start">
                                    {/* BANK NAME */}
                                    <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Nama Bank</div>
                                    <div className="px-4">{orderDetail?.bank_name}</div>
                                </div>
        
                                {/* NO REFERENSI */}
                                <div className="flex items-center justify-start">
                                    <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Nomor Referensi</div>
                                    <div className="px-4">{orderDetail?.ref_no}</div>
                                </div>
        
                                {/* BUKTI TRANSFER */}
                                <div className="flex items-center justify-start">
                                    <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Bukti Transfer</div>
                                    <div className="flex items-center justify-center w-36 h-36">
                                        {orderDetail?.bukti_transaksi ? (
                                            <img 
                                                src={import.meta.env.VITE_APIURL+'/api/order/'+kodeTransaksi+'/bukti_transaksi/'+orderDetail?.bukti_transaksi}
                                                alt=""
                                                className="mt-10 border-2 border-white" 
                                            />
                                        ) : 'Tidak ada Bukti'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}