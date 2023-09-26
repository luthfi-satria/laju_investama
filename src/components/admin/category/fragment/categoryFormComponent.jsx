export default function CategoryFormComponent({
    formData,
    handleChange,
    error,
}){

    const InitializeForm = (property) => {
        return formData?.[property] || '';
    }

    return(
        <>
            <div 
                id="akun-profile" 
                className={`grid grid-cols-1`}
            >
                {/* NAMA */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_nama'>Nama Kategori</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_nama"
                            name="name" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={formData?.name || ''}
                            onChange={(e) => handleChange({...formData, name: e.target.value})}
                            autoComplete='off'
                        />
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-deskripsi'>Deskripsi</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp-deskripsi"
                            name="description" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Deskripsi kategori..."
                            value={InitializeForm('description')}
                            onChange={(e) => {
                                    handleChange({...formData, description: e.target.value})
                                }
                            }
                            autoComplete="off"
                        />
                        {error?.description !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.description}
                            </div>
                        )}
                    </div>
                </div>

                {/* SEQUENCE*/}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-sequence'>Urutan</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="number" 
                            id="inp-sequence"
                            name="sequence" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Urutan..."
                            value={InitializeForm('sequence')}
                            onChange={(e) => handleChange({...formData, sequence: Number(e.target.value)})}
                            autoComplete="off"
                        />
                        {error?.sequence !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.sequence}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}