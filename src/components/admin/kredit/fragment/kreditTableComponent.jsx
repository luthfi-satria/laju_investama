import { Link } from "react-router-dom";
import { IntlCurrency } from "../../../../helpers/converterHelper";
import Pagination from "../../../pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonAction from "../../../buttonAction";
import { useCallback, useEffect, useState } from "react";
import fileDownload from "js-file-download";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import ShowSweetAlert from "../../../../helpers/showAlert";
import KreditFilterComponent from "./kreditFilterComponent";

export default function KreditTableComponent({
    axiosRequest,
    errorHandler,
}){
    const [isLoading, setIsLoading] = useState(false);
    const [triggerFind, setTriggerFind] = useState(true);
    const [data, setData] = useState(false);

    const defaultFilter = useCallback(() => ({
        page: 1,
        limit: 10,
        kredit_code: '',
        profile_name: '',
        profile_phone: '',
        status: '',
        jenis_pembiayaan: '',
        nama_produk: '',
        tanggal_pengajuan: '',
        order_by: 'id',
        orientation: 'DESC',
    }),[]);
    const [filter, setFilter] = useState(defaultFilter);
    
    useEffect(()=>{
        if((triggerFind && filter)){
            setIsLoading(true);
            try{
                axiosRequest('get','api/kredit',{params: filter})
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
        axiosRequest('get', 'api/kredit/print/report', {responseType: 'blob', params: filter})
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
            case 'Menunggu Konfirmasi' : 
                style = 'text-gray-500 border-gray-200 bg-gray-200';
                title = 'MENUNGGU';
                break;
            case 'Terverifikasi' : 
                style = 'text-yellow-700 border-yellow-200 bg-yellow-200';
                title = 'TERVERIFIKASI';
                break;                
            case 'Disetujui' : 
                style = 'text-teal-700 border-teal-200 bg-teal-100';
                title = 'DISETUJUI';
                break;
            case 'Berlangsung' : 
                style = 'text-blue-800 border-blue-500 bg-blue-300';
                title = 'BERLANGSUNG';
                break;
            case 'Selesai' : 
                style = 'text-purple-800 border-purple-500 bg-purple-300';
                title = 'SELESAI';
                break;
            case 'Ditolak' : 
                style = 'text-red-600 border-red-300 bg-red-200';
                title = 'DITOLAK';
                break;
        }

        return (
            <div className={`mr-2 font-semibold text-center border px-[4px] py-[1px] rounded-md ${style}`}>
                {title}
            </div>
        )
    }

    const handleStatusOrder = (type, kode_transaksi) => {
        ShowSweetAlert({
            title: 'Konfirmasi perubahan status',
            text: `ubah status ${kode_transaksi} menjadi ${type}?`,
        }, true).then((response) => {
            if(response.isConfirmed){
                const url = `api/kredit/${kode_transaksi}/status`;
                axiosRequest('put', url, {
                    data: {
                        kredit_code: kode_transaksi,
                        status: type,
                    }
                })
                .then(({data}) => {
                    if(data){
                        setTriggerFind(true);
                    }
                });
            }
        });
    }

    return (
        <>
            <div>
                <div className="text-right mb-4 mr-4 py-2">
                    <Link 
                        to={'baru'}
                        className="border-2 mr-2 bg-emerald-500 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        replace={true}
                    >
                        <FontAwesomeIcon icon={'plus'} className="mr-2"/>
                        Buat Pengajuan
                    </Link>
                    <Link 
                        to={'pembayaran'}
                        className="border-2 mr-2 bg-orange-700 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-orange-800 leading-4"
                        replace={true}
                    >
                        <FontAwesomeIcon icon={'credit-card'} className="mr-2"/>
                        Pembayaran
                    </Link>
                    <button 
                        className="border-2 border-white uppercase px-2 py-2 rounded-md text-white hover:bg-teal-900 leading-4"
                        onClick={()=>printReport()}
                        >
                        <FontAwesomeIcon icon={'print'} className="mr-2"/>
                        Print
                    </button>
                </div>

                {/* FILTER */}
                <KreditFilterComponent 
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
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Kode
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        User
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Tgl Pengajuan
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Tgl Jth Tempo
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Status
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Jenis Pembiayaan
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Produk
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Tenor
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Harga
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        DP
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Cicilan
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-ellips">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data?.items?.length ? (data.items.map((items, index) => (
                                    <tr className={`px-4`} key={index}>
                                        <td className='px-4 py-2 min-w-[100px] uppercase'>{items?.kredit_code}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{items?.profile?.name}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>{UTCToLocaleDate(items?.tanggal_pengajuan)}</td>
                                        <td className='px-4 py-2 min-w-[50px] whitespace-nowrap'>{items?.tanggal_jatuh_tempo}</td>
                                        <td className='px-4 py-2 min-w-[100px] whitespace-nowrap'>
                                            {conditionalStatus(items?.status)}
                                        </td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.jenis_pembiayaan}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>{items?.nama_produk}</td>
                                        <td className='px-4 py-2 min-w-[100px]'>{items?.tenor}</td>
                                        <td className='px-4 py-2 min-w-[100px] text-right'>{IntlCurrency(items?.harga_produk || 0)}</td>
                                        <td className='px-4 py-2 min-w-[100px] text-right'>{IntlCurrency(items?.dp || 0)}</td>
                                        <td className='px-4 py-2 min-w-[100px] text-right'>{IntlCurrency(items?.cicilan || 0)}</td>
                                        <td className='px-4 py-2 min-w-[200px]'>
                                            <Link
                                                to={'detail/'+items.kredit_code}
                                                target="_blank"
                                                title="detail"
                                                className="capitalize border border-white rounded-md px-1.5 py-1 mr-2 hover:bg-gray-50 hover:text-black"
                                            >
                                                <FontAwesomeIcon icon={'magnifying-glass'} />
                                            </Link>

                                            {(items?.status == 'Menunggu Konfirmasi' || items?.status == 'Terverifikasi') && (
                                                <Link
                                                    to={'edit/'+items.kredit_code+'?hp='+items?.profile?.phone}
                                                    target="_blank"
                                                    title="detail"
                                                    className="capitalize border border-white rounded-md px-1.5 py-1 mr-2 hover:bg-gray-50 hover:text-black"
                                                >
                                                <FontAwesomeIcon icon={'pencil'} />
                                                </Link>
                                            )}

                                            {items?.status == 'Menunggu Konfirmasi' && (
                                                <ButtonAction
                                                    label={'Verifikasi'}
                                                    type='verifikasi'
                                                    customClass="bg-yellow-400 text-white hover:bg-yellow-400 hover:text-black"
                                                    icon='check'
                                                    iconClass='w-4 h-4 inline-block ml-1 mr-1'
                                                    handleClick={()=>handleStatusOrder('Terverifikasi',items?.kredit_code)}
                                                />
                                            )}

                                            {(items?.status == 'Menunggu Konfirmasi' || items?.status == 'Terverifikasi') && (
                                                <ButtonAction
                                                    label={'Ditolak'}
                                                    type='reject'
                                                    customClass="bg-red-400 text-white hover:bg-red-400 hover:text-red-400"
                                                    icon='ban'
                                                    iconClass='w-4 h-4 inline-block ml-1 mr-1'
                                                    handleClick={()=>handleStatusOrder('Ditolak',items?.kredit_code)}
                                                />
                                            )}
                                            {items?.status == 'Terverifikasi' && (
                                                <ButtonAction
                                                    label='Approve'
                                                    type="approve"
                                                    customClass="bg-teal-400 text-white hover:bg-teal-700 hover:text-black"
                                                    icon='thumbs-up'
                                                    iconClass='w-4 h-4 inline-block ml-1 mr-1'
                                                    handleClick={()=>handleStatusOrder('Disetujui',items?.kredit_code)}
                                                />
                                            )}

                                            {items?.status == 'Disetujui' && (
                                                <ButtonAction
                                                    label={'Berlangsung'}
                                                    type="ongoing"
                                                    customClass="bg-blue-500 text-white hover:bg-blue-700 hover:text-blue-500"
                                                    icon="money-bill-transfer"
                                                    iconClass="w-4 h-4 ml-1 mr-1"
                                                    handleClick={() => handleStatusOrder('Berlangsung', items?.kredit_code)}
                                                />
                                            )}

                                            {items?.status == 'Berlangsung' && (
                                                <ButtonAction
                                                    label={'Selesai'}
                                                    type="done"
                                                    customClass="bg-purple-500 hover:bg-purple-700 hover:text-purple-700"
                                                    icon="circle-check"
                                                    iconClass="w-4 h-4 ml-1 mr-1"
                                                    handleClick={() => handleStatusOrder('Selesai', items?.kredit_code)}
                                                />
                                            )}
                                            
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={12} className='px-4 py-4 text-center'>
                                            Data tidak ditemukan...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className='bg-teal-800 border-t border-white'>
                                    <td className='px-4' colSpan={12}>
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