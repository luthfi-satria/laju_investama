import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IntlCurrency } from "../../../../helpers/converterHelper";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import KreditInfoDetail from "./kreditInfoDetail";

export default function KreditDetailComponent({
    axiosRequest,
    errorHandler,
}){
    const baseUrl = import.meta.env.VITE_APIURL;
    const location = useLocation().pathname.split('/');
    // const [kodeTransaksi, setKodeTransaksi] = useState(location[4]);
    const kodeTransaksi = location[4] || null;
    const [orderDetail, setOrderDetail] = useState(false);

    useEffect(() => {
        if(!orderDetail && kodeTransaksi){
            axiosRequest('get','api/kredit/'+kodeTransaksi)
            .then(({data}) => {
                setOrderDetail(data?.data);
                console.log(data);
            })
            .catch((error) => {
                errorHandler(error);
            });
        }
    },[orderDetail, axiosRequest, kodeTransaksi, errorHandler]);

    return (
        <>         
            <div className="mt-10 mb-10">
                <Link
                    to={'..'}
                    className="px-4 py-2 text-white border border-white rounded-md hover:bg-teal-400"
                >Kembali</Link>
            </div>   
            <div 
                id="pembayaran"
                className="bg-white grid lg:grid-cols-2 gap-2 w-full border-2 border-white px-4 py-4 rounded-md"
            >
                <div id="pembayaran-summary">
                    <div className="relative grid border border-gray-200 pb-5 rounded-md">
                        <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4">PROFIL KREDITUR</h3>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">Nama</div>
                            <div className="mt-4 block uppercase font-bold">: {orderDetail?.profile?.name}</div>
                        </div>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">Email</div>
                            <div className="mt-4 block uppercase font-bold">: {orderDetail?.profile?.email}</div>
                        </div>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">Telepon</div>
                            <div className="mt-4 block uppercase font-bold">: {orderDetail?.profile?.phone}</div>
                        </div>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">KTP</div>
                            <div className="mt-4 block uppercase font-bold">: {orderDetail?.profile?.ktp}</div>
                        </div>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">Masa Berlaku</div>
                            <div className="mt-4 block uppercase font-bold">: {UTCToLocaleDate(orderDetail?.profile?.masa_berlaku, 'local','/')}</div>
                        </div>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">Tempat, Tanggal Lahir</div>
                            <div className="mt-4 block uppercase font-bold">: {orderDetail?.profile?.dob_place}, {UTCToLocaleDate(orderDetail?.profile?.dob, 'local','/')}</div>
                        </div>
                        <div className="flex items-center justify-start">
                            <div className="mt-4 inline-block text-sm font-medium mr-5 px-4 w-1/3">Masa Berlaku</div>
                            <div className="mt-4 block uppercase font-bold">: {UTCToLocaleDate(orderDetail?.profile?.masa_berlaku, 'local','/')}</div>
                        </div>
                    </div>

                    <div className="relative grid border border-gray-200 pb-5 rounded-md mt-5">
                        <h3 className="mt-4 mb-2 inline-block text-sm font-medium mr-5 px-4">DOKUMEN KREDITUR</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3">
                            {['fc_ktp','fc_kk','slip_gaji','surat_pernyataan','rek_koran','down_payment'].map((items, index) => {
                                if(orderDetail?.document?.[items] && orderDetail?.document?.[items] != ''){
                                    return (
                                        <div key={index} className="flex items-center justify-center mb-5">
                                            <img 
                                                src={baseUrl+'/api/kredit/'+kodeTransaksi+'/support/'+orderDetail?.document?.[items]}
                                                title={items.replace('_', ' ').toUpperCase()}
                                                className="w-20 h-20 rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:translate-x-32 hover:scale-[5] duration-300 hover:z-10 hover:border hover:border-gray-400"
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-10 bg-gray-50 px-4 py-8 lg:mt-0 border border-gray-300 rounded-md">
                    <p className="text-3xl font-medium px-4 mb-10">Detail Pengajuan</p>
                    <div>
                        <KreditInfoDetail 
                            orderDetail={orderDetail}
                        />

                        {/* PRODUK */}
                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Produk</div>
                            <div className="px-4">: {orderDetail?.nama_produk}</div>
                        </div>

                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Jenis</div>
                            <div className="px-4">: {orderDetail?.jenis_produk}</div>
                        </div>

                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Tipe</div>
                            <div className="px-4">: {orderDetail?.tipe_produk}</div>
                        </div>

                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Ukuran</div>
                            <div className="px-4">: {orderDetail?.ukuran_produk}</div>
                        </div>

                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Warna</div>
                            <div className="px-4">: {orderDetail?.warna_produk}</div>
                        </div>

                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Spesifikasi</div>
                            <div className="px-4">: {orderDetail?.spesifikasi}</div>
                        </div>

                        <div className="flex items-center justify-start">
                            <div className="mt-4 mb-2 block text-sm font-medium px-4 w-1/3">Harga Produk</div>
                            <div className="px-4">: {IntlCurrency(orderDetail?.harga_produk || 0)}</div>
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