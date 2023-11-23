import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";

export default function KreditFilterComponent({
    filter,
    setFilter,
    triggerFind,
    defaultFilter,
}){
    const [startAju, setStartAju] = useState(null);
    const [endAju, setEndAju] = useState(null);

    const setPengajuan = (dates) => {
        const [start, end] = dates;
        const endDate = end < start ? start: end;
        const tglAju = UTCToLocaleDate(start)+':'+UTCToLocaleDate(endDate);
        setStartAju(start);
        setEndAju(end);
        setFilter({...filter, tanggal_pengajuan: tglAju});
    }

    return (
        <>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                <div className="block w-full overflow-x-auto">
                    <h3 className="w-full px-4 py-2 text-xl border-b-2">
                        FILTER PENGAJUAN KREDIT
                    </h3>
                    {/* FILTER */}
                    <div name="src-kredit" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src-kode' className='block'>Kode</label>
                                <input 
                                    id="src-kode" 
                                    type="text" 
                                    name='kode' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, kredit_code: e.target.value});
                                    }}
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <label htmlFor='src-status' className='block'>Status</label>
                                <select 
                                    id="src-status" 
                                    type="text" 
                                    name='status' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, status: e.target.value});
                                    }}
                                    autoComplete='off'
                                >
                                    <option value={''}>Semua Status</option>
                                    <option value={'Menunggu Konfirmasi'}>Menunggu</option>
                                    <option value={'Terverifikasi'}>Terverifikasi</option>
                                    <option value={'Disetujui'}>Disetujui</option>
                                    <option value={'Berlangsung'}>Berlangsung</option>
                                    <option value={'Selesai'}>Selesai</option>
                                    <option value={'Ditolak'}>Ditolak</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor='src-metode' className='block'>Pembiayaan</label>
                                <select 
                                    id="src-metode" 
                                    type="checkbox" 
                                    name='pembiayaan' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, jenis_pembiayaan: e.target.value});
                                    }}
                                    autoComplete='off'
                                >
                                    <option value={''}>Semua</option>
                                    <option value={'Sendiri'}>Sendiri</option>
                                    <option value={'Bersama'}>Bersama</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="src-tgl-pengajuan">Tanggal Pengajuan</label>
                                <ReactDatePicker
                                    showIcon={true}
                                    value={filter?.tanggal_pengajuan}
                                    selected={startAju}
                                    onChange={setPengajuan}
                                    dateFormat={'dd/MM/yyyy'}
                                    className="rounded-sm px-2 py-1 w-full text-gray-500"
                                    calendarClassName="rounded-sm px-2 py-1 w-full text-gray-500"
                                    placeholderText="Select date..."
                                    selectsRange={true}
                                    id="src-tgl-pengajuan"
                                    startDate={startAju}
                                    endDate={endAju}
                              />
                            </div>                            
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='button'
                                    className='border border-white bg-red-500 px-2 py-1 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
                                    onClick={()=>{
                                        setFilter(defaultFilter);
                                        triggerFind(true);
                                    }}
                                >
                                    Hapus
                                </button>
                                <button 
                                    id="src_btn" 
                                    type='button'
                                    className='border border-white px-2 py-1 rounded-r-md mt-5 w-1/2 bg-teal-700 hover:bg-teal-500'
                                    onClick={() => {
                                        setFilter({...filter, page:1});
                                        triggerFind(true);
                                    }}
                                >
                                    Cari
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </>
    )
}