export default function AccessControlFilter({
    filter,
    setFilter,
    triggerFind,
    defaultFilter,
}){
    return (
        <>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                <div className="block w-full overflow-x-auto">
                    <h3 className="w-full px-4 py-2 text-xl border-b-2">
                        FILTER AKSES MENU
                    </h3>
                    {/* FILTER */}
                    <form name="src-kredit" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src-group' className='block'>group</label>
                                <input 
                                    id="src-group" 
                                    type="text" 
                                    name='kode' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, usergroup: e.target.value});
                                    }}
                                    autoComplete='off'
                                    placeholder="Group user..."
                                />
                            </div>

                            <div>
                                <label htmlFor='src-group-level' className='block'>Group level</label>
                                <input 
                                    id="src-group-level" 
                                    type="text" 
                                    name='level' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, group_level: e.target.value});
                                    }}
                                    autoComplete='off'
                                    placeholder="Level group..."
                                />
                            </div>

                            <div>
                                <label htmlFor='src-menu' className='block'>Menu</label>
                                <input 
                                    id="src-menu" 
                                    type="text" 
                                    name='menu' 
                                    className='rounded-sm px-2 py-1 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, menu: e.target.value});
                                    }}
                                    autoComplete='off'
                                    placeholder="Nama Menu..."
                                />
                            </div>                           
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='reset'
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
                    </form>
                </div>
            </div>        
        </>
    )
}