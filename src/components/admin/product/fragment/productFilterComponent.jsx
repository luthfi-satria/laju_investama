import Select from 'react-select';

export default function ProductFilterComponent({
    filter,
    setFilter,
    category,
    triggerFind
}){
    return (
        <>
            <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-teal-950 text-white'>
                <div className="block w-full">
                    <h3 className="w-full px-4 py-2 text-xl border-b-2">
                        FILTER PRODUK
                    </h3>
                    {/* FILTER */}
                    <form name="src_category" className='px-4 py-4'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 '>
                            <div>
                                <label htmlFor='src-kode' className='block'>Kode</label>
                                <input 
                                    id="src-kode" 
                                    type="text" 
                                    name='kode' 
                                    className='rounded-sm px-2 py-2 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, kode_produk: e.target.value});
                                    }}
                                    autoComplete='off'
                                    placeholder='Kode Produk...'
                                />
                            </div>
                            <div>
                                <label htmlFor='src-nama' className='block'>Nama</label>
                                <input 
                                    id="src-nama" 
                                    type="text" 
                                    name='nama' 
                                    className='rounded-sm px-2 py-2 w-full text-gray-500'
                                    onKeyUp={(e)=>{
                                        setFilter({...filter, name: e.target.value});
                                    }}
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <label htmlFor='src-category' className='block'>Kategori</label>
                                <Select 
                                    inputId="src-category" 
                                    type="text" 
                                    name='kategori' 
                                    className='rounded-sm w-full text-gray-500'
                                    onChange={(value)=>{
                                        setFilter({...filter, category_id: value?.id});
                                    }}
                                    autoComplete='off'
                                    options={category?.items}
                                    getOptionLabel={option => option.name}
                                    getOptionValue={option => option.id}
                                />
                            </div>
                            <div>
                                <label htmlFor='src-status' className='block'>status</label>
                                <select 
                                    id="src-status" 
                                    type="checkbox" 
                                    name='status' 
                                    className='rounded-sm px-2 py-2 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, status: e.target.value});
                                    }}
                                    autoComplete='off'
                                >
                                    <option value={'all'}>Semua</option>
                                    <option value={'publish'}>Publish</option>
                                    <option value={'draft'}>Draft</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor='src-stok' className='block'>Status Stok</label>
                                <select 
                                    id="src-stok" 
                                    type="checkbox" 
                                    name='stok' 
                                    className='rounded-sm px-2 py-2 w-full text-gray-500'
                                    onChange={(e)=>{
                                        setFilter({...filter, stock_status: e.target.value});
                                    }}
                                    autoComplete='off'
                                >
                                    <option value={'all'}>Semua</option>
                                    <option value={'tersedia'}>Tersedia</option>
                                    <option value={'habis'}>Habis</option>
                                </select>
                            </div>
                            <div>
                                <button 
                                    id="src_clear" 
                                    type='reset'
                                    className='border border-white bg-red-500 px-2 py-2 rounded-l-md mt-5 w-1/2 hover:bg-red-600'
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
                                    className='border border-white px-2 py-2 rounded-r-md mt-5 w-1/2 bg-teal-700 hover:bg-teal-500'
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