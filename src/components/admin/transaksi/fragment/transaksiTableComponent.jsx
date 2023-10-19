import { Link } from "react-router-dom";
import { IntlCurrency } from "../../../../helpers/converterHelper";
import Pagination from "../../../pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonAction from "../../../buttonAction";
import { useCallback, useEffect, useState } from "react";
import fileDownload from "js-file-download";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import TransaksiFilterComponent from "./transaksiFilterComponent";
import ShowSweetAlert from "../../../../helpers/showAlert";

export default function TransaksiTableComponent({
    axiosRequest,
    errorHandler,
}){
    const [isLoading, setIsLoading] = useState(false);
    const [triggerFind, setTriggerFind] = useState(true);
    const [data, setData] = useState(false);

    const defaultFilter = useCallback(() => ({
        page: 1,
        limit: 10,
        user_id: '',
        platform: 'admin',
        status: '',
        kode_transaksi: '',
        payment_method: '',
        date_start: '',
        date_end: '',
        order_by: 'id',
        orientation: 'DESC',
    }),[]);
    const [filter, setFilter] = useState(defaultFilter);
    
    useEffect(()=>{
        if((triggerFind && filter)){
            setIsLoading(true);
            try{
                axiosRequest('get','api/order',{params: filter})
                .then(({data}) => {
                    setData(data?.data);
                })
                .catch((err) => {
                    errorHandler(err.response.data.message);
                }).finally(() => {
                    setTimeout(()=>{
                        setIsLoading(false);
                        setTriggerFind(false);
                    }, 1000);
                });
            }
            catch(err){
                errorHandler(err.response.data.message[0].constraint[0]);
            }
        }
    },[filter, axiosRequest, errorHandler, triggerFind]);

    const changeLimitOption = (e) => {
        const option = Number(e.target.value);
        setFilter({...filter, limit: option, page: 1});
        setTriggerFind(true);
    }

    const changePage = (e) => {
        setFilter({...filter, page: Number(e)});
        setTriggerFind(true);
    }

    const printReport = () => {
        axiosRequest('get', 'api/order/print/report', {responseType: 'blob', params: filter})
        .then((response) => {
            if(response.status == 200){
                fileDownload(response.data, 'data_order','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }
        });
    }    
    
    const conditionalStatus = (status) => {
        let title = '';
        let style = '';
        switch(status){
            case 'WAITING' : 
                style = 'text-gray-500 border-gray-200 bg-gray-200';
                title = 'BLM BAYAR';
                break;
            case 'PAID' : 
                style = 'text-emerald-700 border-emerald-200 bg-emerald-200';
                title = 'LUNAS';
            break;                
            case 'PROCEED' : 
                style = 'text-yellow-700 border-yellow-200 bg-yellow-100';
                title = 'DIPROSES';
                break;
            case 'SUCCESS' : 
                style = 'text-blue-800 border-blue-500 bg-blue-300';
                title = 'SELESAI';
                break;
            case 'CANCELED' : 
                style = 'text-red-600 border-red-300 bg-red-200';
                title = 'BATAL';
                break;
        }

        return (
            <div className={`mr-2 font-semibold text-center border px-[4px] py-[1px] rounded-md ${style}`}>
                {title}
            </div>
        )
    }

    const handleStatusOrder = (type, kode_transaksi) => {
        let title = '';
        switch(type){
            case 'verify': 
                title = 'Verifikasi order '+ kode_transaksi.toUpperCase();
                break;
            case 'done':
                title = 'Selesaikan order '+ kode_transaksi.toUpperCase();
                break;
            case 'canceled':
                title = 'Batalkan order '+ kode_transaksi.toUpperCase();
                break;
        }

        ShowSweetAlert({
            title: title
        }, true).then((response) => {
            if(response.isConfirmed){
                const url = `api/order/${kode_transaksi}/status/${type}`;
                axiosRequest('put', url)
                .then(() => {
                    setTriggerFind(true);
                });
            }
        });
    }

    return (
        <>
            <div>
                <div className="text-right mb-4 mr-4">
                    <button 
                        className="border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>printReport()}
                        >
                        <FontAwesomeIcon icon={'print'} className="mr-2"/>
                        Print
                    </button>
                </div>

                {/* FILTER */}
                <TransaksiFilterComponent 
                    filter={filter}
                    setFilter={setFilter}
                    triggerFind={setTriggerFind}
                    defaultFilter={defaultFilter}
                />
                {/* table */}
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white">
                    <div className="block w-full overflow-x-auto">
                        <table id="tblOrder" className="table-striped items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Kode
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        User
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Tanggal
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Status
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Total Bayar
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Metode
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Tanggal Bayar
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={`px-4`} key={index}>
                                        <td className='px-4 py-2 min-w-[100px] uppercase'>{items?.kode_transaksi}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.user?.name}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{UTCToLocaleDate(items?.created_at)}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>
                                            {conditionalStatus(items?.status)}
                                        </td>
                                        <td className='px-4 py-2 min-w-[100px] text-right'>{IntlCurrency(items?.grand_total)}</td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.payment_method}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.payment_date && UTCToLocaleDate(items?.payment_date)}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>
                                            <Link
                                                to={'detail/'+items.kode_transaksi}
                                                target="_blank"
                                                title="detail"
                                                className="capitalize border border-white rounded-md px-1.5 py-1 mr-2 hover:bg-gray-50 hover:text-black"
                                            >
                                                <FontAwesomeIcon icon={'magnifying-glass'} />
                                            </Link>
                                            {items?.status == 'PAID' && (
                                                <ButtonAction
                                                    label={'Verifikasi'}
                                                    type='verifikasi'
                                                    customClass="bg-yellow-400 text-white hover:bg-yellow-400 hover:text-black"
                                                    icon='check'
                                                    iconClass='w-4 h-4 inline-block ml-1 mr-1'
                                                    handleClick={()=>handleStatusOrder('verify',items?.kode_transaksi)}
                                                />
                                            )}
                                            {items?.status == 'PROCEED' && (
                                                <ButtonAction
                                                    label='selesaikan'
                                                    type="done"
                                                    customClass="bg-teal-400 text-white hover:bg-teal-700 hover:text-black"
                                                    icon='thumbs-up'
                                                    iconClass='w-4 h-4 inline-block ml-1 mr-1'
                                                    handleClick={()=>handleStatusOrder('done',items?.kode_transaksi)}
                                                />
                                            )}

                                            {items?.status == 'WAITING' && (
                                                <ButtonAction
                                                    label={'batalkan'}
                                                    type="abort"
                                                    customClass="bg-red-500 hover:bg-red-700"
                                                    icon="xmark"
                                                    iconClass="w-4 h-4 ml-1 mr-1"
                                                    handleClick={() => handleStatusOrder('canceled', items?.kode_transaksi)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className='px-4 py-4 text-center'>
                                            Data tidak ditemukan...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className='bg-teal-800 border-t border-white'>
                                    <td className='px-4' colSpan={9}>
                                    <Pagination
                                        loading={isLoading}
                                        page={filter.page}
                                        limit={Number(filter.limit)}
                                        setPage={changePage}
                                        setPerPage={changeLimitOption}
                                        maxData={data?.total || 0}
                                        />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        {isLoading && (
                            <div className='absolute z-10 flex items-center justify-center top-0 w-full bg-black opacity-70 h-full'>
                                <div className='relative bg-white px-4 py-4 border border-white rounded-lg text-center text text-black font-bold'>LOADING...</div>
                            </div>
                        )}
                    </div>
                </div>   
            </div>         
        </>
    );
}