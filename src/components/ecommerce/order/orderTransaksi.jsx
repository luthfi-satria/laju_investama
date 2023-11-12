import { Link } from 'react-router-dom';
import imgDefault from '../../../assets/images/noproduct_img.png';
import { IntlCurrency } from '../../../helpers/converterHelper';

export default function OrderTransaction({
    title,
    dataOrder,
    CreateIcon,
    batalkanPesanan,
}){
    const convImg = (data) => {
        const baseUrl = import.meta.env.VITE_APIURL;
        return data?.image ? baseUrl+'/api/product/'+data.id+'/image/'+data.image : imgDefault;
    }

    const convStatus = (status) => {
        let title = '';
        let style = '';
        switch(status){
            case 'WAITING' : 
                style = 'text-gray-500 border-gray-200 bg-gray-200';
                title = 'Menunggu Pembayaran';
                break;
            case 'PAID' : 
                style = 'text-emerald-500 border-emerald-200 bg-emerald-200';
                title = 'Sudah dibayar';
            break;                
            case 'PROCEED' : 
                style = 'text-yellow-700 border-yellow-200 bg-yellow-100';
                title = 'Diproses';
                break;
            case 'SUCCESS' : 
                style = 'text-teal-800 border-teal-500 bg-teal-300';
                title = 'Selesai';
                break;
            case 'CANCELED' : 
                style = 'text-red-600 border-red-300 bg-red-200';
                title = 'Dibatalkan';
                break;
        }

        return (
            <div className={`mr-2 font-bold border px-[4px] py-[2px] mb-2 rounded-md ${style}`}>
                {title}
            </div>
        )
    }
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold uppercase leading-6 mb-10">{title || 'DAFTAR TRANSAKSI'}</h2>

                {/* LIST TRANSAKSI */}
                {dataOrder && dataOrder.map((items, index) => (
                    <div className="mb-4" key={index}>
                            <div
                                className="block relative px-4 py-4 border border-gray-200 rounded-md"
                            >
                                <div
                                    className="flex flex-col items-stretch sm:flex-row sm:items-center mb-4 text-sm"
                                >
                                    <div className="font-bold mr-2 mb-2">
                                        Belanja
                                    </div>
                                    <div className="mr-2 mb-2">
                                        {new Date(items?.created_at).toLocaleString()}
                                    </div>
                                    {convStatus(items?.status)}
                                    <div className="text-gray-400 uppercase">
                                        {items?.kode_transaksi}
                                    </div>
                                </div>

                                {/* ITEM CONTAINER */}
                                <div 
                                    className="flex flex-col md:flex-row"
                                >
                                    <div className="detail-content flex-grow">
                                        <div
                                            className="flex w-full flex-col md:flex-row"
                                        >
                                            <div
                                                className="md:flex-shrink mr-4 md:w-36 md:h-36"
                                            >
                                                <img 
                                                src={convImg(items?.details?.[0].product)} 
                                                alt="Product Image"
                                                className="min-w-full max-w-full min-h-full max-h-full block rounded-lg"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div>
                                                    {items?.details.map((detail, n) => (
                                                        <div key={n} className='mt-10 md:mt-0 mb-2'>
                                                            <div className="text-gray-500 font-bold text-ellipsis whitespace-nowrap">{detail?.product?.name}</div>
                                                            <div>{detail?.qty} x <span className='font-bold'>{IntlCurrency(detail?.harga)}</span></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='detail-summary flex-grow items-center justify-center'>
                                        <div className='block relative text-gray-400 text-left md:text-right'>Total Belanja</div>
                                        <div className='block relative font-bold text-md text-left md:text-right'>{IntlCurrency(items?.grand_total)}</div>
                                    </div>
                                </div>
                                {/* END ITEM CONTAINER */}

                                <div className='w-full text-right mt-10 md:mt-0 flex items-center justify-center md:justify-end'>
                                    {items?.status == 'WAITING' && (
                                        <Link 
                                            to={'/pembayaran/'+items.kode_transaksi}
                                            className='bg-emerald-400 font-semibold px-4 py-2 text-sm text-white ring-2 ring-emerald-700 mr-5 md:mt-0 rounded-md hover:bg-emerald-500'    
                                        >
                                            Pembayaran
                                        </Link>                                        
                                    )}

                                    {items?.status == 'WAITING' && (
                                        <button 
                                            className='bg-red-500 font-semibold px-4 py-2 ring-2 ring-red-700 text-sm text-white mr-5 md:mt-0 rounded-md hover:bg-red-700'    
                                            onClick={() => batalkanPesanan(items)}
                                        >
                                            Batalkan
                                        </button>
                                    )}

                                    {/* <Link 
                                        to={`/invoice/${items?.kode_transaksi}`}
                                        className='bg-white px-4 py-2 font-semibold text-sm text-black rounded-md hover:bg-gray-200 border-2 border-gray-200'    
                                    >
                                        Invoice
                                    </Link> */}
                                </div>
                            </div>
                    </div>
                ))}

                {dataOrder && dataOrder.length == 0 && (
                    <div className='flex flex-col items-center justify-center px-4 py-10'>
                        {CreateIcon('boxes-packing', 'text-[200px] text-teal-500')}
                        <div className='text-3xl mt-10'>
                            Transaksi tidak ditemukan!
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}