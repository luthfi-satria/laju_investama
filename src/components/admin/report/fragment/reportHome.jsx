import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import StatusOrder from "../../../../constants/statusOrder";
import { FormatNumber } from "../../../../helpers/converterHelper";

export default function ReportHome({
    axiosRequest,
    errorHandler,
}){
    const summary = [
        {
            key: 'user',
            title: 'Total User',
            icon: 'users',
            bgColor: 'blue',
        },
        {
            key: 'product',
            title: 'Total Produk',
            icon: 'cubes',
            bgColor: 'yellow',
        },
        {
            key: 'investor',
            title: 'Investor Aktif',
            icon: 'user-secret',
            bgColor: 'red',
        },
        {
            key: 'order',
            title: 'Order Selesai (7 Hari)',
            icon: 'gift',
            bgColor: 'green',
        },
        {
            key: 'kredit',
            title: 'Total Kredit Aktif',
            icon: 'money-bill-transfer',
            bgColor: 'purple',
        },
        {
            key: 'tagihan',
            title: 'Tagihan Masuk',
            icon: 'bank',
            bgColor: 'teal',
        }
    ];

    const [statistic, setStatistic] = useState(false);

    useEffect(() => {
        if(!statistic){
            axiosRequest('get','api/dashboard/statistics')
            .then(({data}) => {
                setStatistic(data?.data);
            })
            .catch((err) => {
                errorHandler(err.response.data.message);
            });
        }
    },[statistic, axiosRequest, errorHandler]);

    const handleCounter = (items) => {
        let total = 0;
        const desc = [];
        if(['user','product','investor','order'].includes(items.key) && statistic?.[items.key]){
            total = statistic?.[items.key]?.total;
            if(items.key == 'user'){
                const stats = statistic?.user?.stats;
                let i = 1;
                for(const el of stats){
                    desc.push(
                        <div key={`user${i}`} className="grid grid-cols-3">
                            <div className="text-xs text-green-500 font-bold col-span-2">
                                {el.period}
                            </div>
                            <div className="text-xs">: {el.total} user</div>
                        </div>)
                    i++;
                }
            }

            if(items.key == 'product'){
                const stats = statistic?.product?.stokHabis;
                desc.push(<div key={`product_stok`} className="text-sm text-grey-400 font-bold">Stok habis</div>)
                if(stats.length > 0){
                    let i = 1;
                    for(const el of stats){
                        desc.push(
                        <div key={`product${i}`} className="grid grid-cols-3">
                            <div className="text-xs text-green-500 font-bold">
                                {el?.kode_produk}
                            </div>
                            <div className="col-span-2 overflow-hidden whitespace-nowrap text-ellipsis">{el?.name}</div>
                        </div>
                        );
                        i++;
                    }
                }
                else{
                    desc.push(<div key={`product_stok_empty`} className="text-xs">Stok Produk Aman</div>)
                }
            }

            if(items.key == 'investor'){
                desc.push(<div key={`total_investasi`} className="text-sm text-green-500 font-bold">Total Investasi: {FormatNumber(statistic?.investor?.total_investasi || 0, 'indonesia')}</div>)
            }

            if(items.key == 'order'){
                const stats = statistic?.order?.stats;
                desc.push(<div key={`order_stok`} className="text-sm text-grey-400 font-bold">Transaksi 7 hari terakhir</div>)
                if(stats.length > 0){
                    let i = 1;
                    for(const el of stats){
                        desc.push(
                        <div key={`order${i}`} className="grid grid-cols-3 gap-2">
                            <div 
                                className="text-xs text-green-500 font-bold col-span-2 overflow-hidden whitespace-nowrap text-ellipsis"
                                title={StatusOrder[el?.status]}
                            >
                                {StatusOrder[el?.status]}
                            </div>
                            <div className="text-xs">: {el?.total_in_week}</div>
                        </div>
                        );
                        i++;
                    }
                }
                else{
                    desc.push(<div key={`product_stok_empty`}>Tidak ada transaksi</div>)
                }
            }
        }else if(items.key == 'kredit'){
            total = statistic?.kredit?.active_outcome;
            const stats = statistic?.kredit?.stats;
            desc.push(<div key={`kredit`} className="text-sm text-grey-400 font-bold">Kredit aktif</div>)
            if(stats?.length > 0){
                let i = 1;
                for(const el of stats){
                    desc.push(
                    <div key={`kredit${i}`} className="grid grid-cols-3 gap-2">
                        <div 
                            className="text-xs text-green-500 font-bold col-span-2 overflow-hidden whitespace-nowrap text-ellipsis"
                            title={el?.status}
                        >
                            {el?.status}
                        </div>
                        <div className="text-xs">: {el?.total}</div>
                    </div>
                    );
                    i++;
                }
            }
        }else if(items.key == 'tagihan'){
            let stats = statistic?.tagihan?.stats;
            desc.push(<div key={`tagihan`} className="text-sm text-grey-400 font-bold">Tagihan masuk 7 hari terakhir</div>)
            if(stats?.length > 0){
                let i = 1;
                for(const el of stats){
                    total += el?.total_bayar_in_week;
                    desc.push(
                    <div key={`kredit${i}`} className="grid grid-cols-3 gap-2">
                        <div 
                            className="text-xs text-green-500 font-bold col-span-2 overflow-hidden whitespace-nowrap text-ellipsis"
                            title={el?.payment_method}
                        >
                            {el?.payment_method}
                        </div>
                        <div className="text-xs">: {FormatNumber(el?.total_bayar_in_week || 0, 'indonesia')}</div>
                    </div>
                    );
                    i++;
                }
            }
            else{
                desc.push(<div key={'tagihan_nol'}
                    className="text-xs text-green-500 font-bold col-span-2 overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    Belum ada tagihan masuk
                </div>);
            }
        }
        total = FormatNumber(total, 'indonesia');

        return (
            <>
                <div className="p-4 text-right">
                    <p className="block antialiased font-sans text-md leading-normal font-semibold text-blue-gray-600">
                        {items?.title}
                    </p>
                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                        {total}
                    </h4>
                </div>
                <div className="border-t border-blue-gray-50 p-4">
                    <div className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                        {desc}
                    </div>
                </div>            
            </>            
        );
    }
    return(
        <>
            <div id="summary" className="w-full mt-5 grid grid-cols-2 md:grid-cols-3 gap-2 px-2">
                {summary && summary.map((items, key) => (
                    <div 
                        key={key} 
                        className="relative mb-5 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
                    >
                        <div 
                            className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-${items?.bgColor}-500 text-white shadow-${items?.bgColor}-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center`}
                        >
                            <FontAwesomeIcon icon={items?.icon} className="w-8 h-8 text-white"/>
                        </div>
                        {handleCounter(items)}
                    </div>
                ))}
            </div>
        </>
    )
}