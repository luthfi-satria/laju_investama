export default function CategoryFilterComponent({
    filter,
    setFilter,
    triggerFind,
}){
    return (
        <>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                <div className="block w-full overflow-x-auto">
                    <h3 className="w-full px-4 py-2 text-xl border-b-2">
                        FILTER Category
                    </h3>
                    {/* FILTER */}
                    <form name="src_category" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src-nama' className='block'>Nama</label>
                                <input 
                                    id="src-nama" 
                                    type="text" 
                                    name='nama' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, ['name']: e.target.value});
                                    }}
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='reset'
                                    className='border border-white bg-red-500 px-2 py-1 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
                                    onClick={()=>{
                                        setFilter({
                                            page: 1,
                                            limit: 10,
                                            includeDeleted: 'true',
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
                    </form>
                </div>
            </div>        
        </>
    )
}