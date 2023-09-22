import { useEffect, useState } from "react";

export default function UserFilterComponent({
    filter,
    setFilter,
    axiosHttp
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
                        FILTER USER
                    </h3>
                    {/* FILTER */}
                    <form name="src_usergroup" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src_nama' className='block'>Nama</label>
                                <input 
                                    id="src_nama" 
                                    type="src_text" 
                                    name='nama' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, ['name']: e.target.value});
                                    }}
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <label htmlFor='src_username' className='block'>Username</label>
                                <input 
                                    id="src_username" 
                                    name='src_username' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => setFilter({...filter, ['username']: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor='src_email' className='block'>Email</label>
                                <input 
                                    id="src_email" 
                                    name='src_email' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => setFilter({...filter, ['email']: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor='src_phone' className='block'>Telepon</label>
                                <input 
                                    id="src_phone" 
                                    name='src_phone' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => setFilter({...filter, ['phone']: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor='src_gender' className='block'>Kelamin</label>
                                <select 
                                    id="src_gender" 
                                    name='src_gender' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full'
                                    onChange={(e) => {
                                        setFilter({...filter, ['gender']: e.target.value})
                                    }}
                                >
                                    <option value={''}>Semua</option>
                                    <option value={'male'}>Laki laki</option>
                                    <option value={'female'}>Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor='src_group' className='block'>Group</label>
                                <select 
                                    id="src_group" 
                                    name='src_group' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full h-7 overflow-hidden'
                                    onChange={(e) => setFilter({...filter, ['usergroup_id']: e.target.value})}
                                >
                                    <option value={''}>Semua</option>
                                    {usergroup && usergroup.map((items, index)=>(
                                        <option key={index} value={items.id}>{items.level} - {items.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor='src_new' className='block'>Status verifikasi</label>
                                <select 
                                    id="src_new" 
                                    name='src_new' 
                                    className='rounded-sm px-2 py-1 text-gray-600 w-full h-7 overflow-hidden'
                                    onChange={(e) => setFilter({...filter, ['status']: e.target.value})}
                                >
                                    <option value={''}>Semua</option>
                                    <option value={'baru'}>Belum verifikasi</option>
                                    <option value={'lama'}>Sudah verifikasi</option>
                                </select>
                            </div>
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='reset'
                                    className='border border-white bg-red-500 px-2 py-1 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
                                    onClick={()=>setFilter({
                                        page: 1,
                                        limit: 10
                                    })}
                                >
                                    Hapus
                                </button>
                                <button 
                                    id="src_btn" 
                                    type='button'
                                    className='border border-white px-2 py-1 rounded-r-md mt-5 w-1/2 bg-teal-700 hover:bg-teal-500'
                                >
                                    Cari
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>        
        </>
    )
}