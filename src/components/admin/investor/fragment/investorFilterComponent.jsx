import { useEffect, useState } from "react";

export default function InvestorFilterComponent({
    filter,
    setFilter,
    axiosHttp,
    triggerFind,
}){
    const [usergroup, setUsergroup] = useState(false);

    useEffect(()=>{
        if(!usergroup){
            axiosHttp('get','/api/usergroup',{
                page: 1,
                limit: 100
            })
            .then((response)=>{
                if(response.statusCode == 400){
                    throw(response);
                }
                setUsergroup(response.data.data?.items);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    },[usergroup, axiosHttp]);
    return (
        <>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                <div className="block w-full overflow-x-auto">
                    <h3 className="w-full px-4 py-2 text-xl border-b-2">
                        FILTER INVESTOR
                    </h3>
                    {/* FILTER */}
                    <div name="src_usergroup" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src-nama' className='block'>Nama</label>
                                <input 
                                    id="src-nama" 
                                    type="text" 
                                    name='nama' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, name: e.target.value});
                                    }}
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <label htmlFor='src-nilai' className='block'>Nilai</label>
                                <input 
                                    id="src-nilai" 
                                    name='src-nilai' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => setFilter({...filter, nilai: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor='src-jangka_waktu' className='block'>Jangka Waktu</label>
                                <input 
                                    id="src-jangka_waktu" 
                                    name='src-jangka_waktu' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => setFilter({...filter, jangka_waktu: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label htmlFor='src-tanggal_investasi' className='block'>Tanggal Investasi</label>
                                <input 
                                    id="src-tanggal_investasi"
                                    type="date" 
                                    name='src-tanggal_investasi' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => setFilter({...filter, tanggal_investasi: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor='src_new' className='block'>Status verifikasi</label>
                                <select 
                                    id="src_new" 
                                    name='src_new' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full h-7 overflow-hidden'
                                    onChange={(e) => setFilter({...filter, is_verified: e.target.value})}
                                >
                                    <option value={'semua'}>Semua</option>
                                    <option value={'belum'}>Belum verifikasi</option>
                                    <option value={'sudah'}>Sudah verifikasi</option>
                                </select>
                            </div>
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='button'
                                    className='border border-white bg-red-500 px-2 py-1 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
                                    onClick={()=>{
                                        setFilter({
                                            page: 1,
                                            limit: 10
                                        });
                                        triggerFind(true);
                                    }}
                                >
                                    Hapus
                                </button>
                                <button 
                                    id="src_btn" 
                                    type='button'
                                    className='border border-white px-2 py-1 rounded-r-md mt-5 w-1/2 bg-teal-700 hover:bg-teal-500'
                                    onClick={()=>{
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