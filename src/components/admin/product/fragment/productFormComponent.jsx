import CurrencyInput from 'react-currency-input-field';
import DEFAULTIMG from '../../../../assets/images/defaultImg.svg';
import Select from 'react-select';

export default function ProductFormComponent({
    formData,
    handleChange,
    error,
    category,
    axiosRequest,
}){
    const baseUrl = import.meta.env.VITE_APIURL;

    const InitializeForm = (property) => {
        return formData?.[property] || '';
    }

    const convertImgUrl = (data) => {
        return data?.image ? baseUrl+'/api/product/'+data.id+'/image/'+data.image : DEFAULTIMG;
    }

    const handleChangeImage = (e, inputData) => {
        e.preventDefault();
        const fileData = new FormData();
        fileData.append('image', e.target.files[0]);
        axiosRequest('post', `api/product/image/${inputData.id}`, {}, fileData, {
            'Content-Type' : 'multipart/form-data',
        }).then(({data}) => {
            if(data.statusCode == 400){
                throw(data);
            }
            setTimeout(() => {
                handleChange({...formData, image: data.data.image});
            }, 1000);
        });
    }

    return(
        <>
            <div 
                id="data-produk" 
                className={`grid grid-cols-1`}
            >
                {/* KODE PRODUK */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-kode'>Kode Produk</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp-kode"
                            name="name" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={formData?.kode_produk || ''}
                            onChange={(e) => handleChange({...formData, kode_produk: e.target.value})}
                            placeholder="Kode produk..."
                            autoComplete='off'
                        />
                        {error?.kode_produk !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.kode_produk}
                            </div>
                        )}
                    </div>
                </div>

                {/* KATEGORI */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-kategori'>Kategori Produk</label>
                    </div>
                    <div className="col-span-2">
                        <Select 
                            type="text" 
                            inputId="inp-kategori"
                            name="kategori" 
                            className="w-full text-gray text-xs outline-none focus:border-gray-500"
                            onChange={(value) => handleChange({...formData, category_id: Number(value?.id)})}
                            // defaultValue={Number(formData?.category_id) || ''}
                            value={category?.items?.find(op => {
                                return op.id == formData?.category_id;
                            })}
                            autoComplete='off'
                            options={category?.items}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                        />
                        {error?.category_id !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.category_id}
                            </div>
                        )}
                    </div>
                </div>

                {/* NAMA PRODUK */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-nama'>Nama Produk</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp-nama"
                            name="name" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={formData?.name || ''}
                            onChange={(e) => handleChange({...formData, name: e.target.value})}
                            placeholder="Nama produk..."
                            autoComplete='off'
                        />
                        {error?.name !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.name}
                            </div>
                        )}
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-deskripsi'>Deskripsi</label>
                    </div>
                    <div className="col-span-2">
                        <textarea 
                            id="inp-deskripsi"
                            name="description" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Deskripsi produk..."
                            defaultValue={InitializeForm('description') || ''}
                            onChange={(e) => {
                                    handleChange({...formData, description: e.target.value})
                                }
                            }
                            autoComplete="off"
                        ></textarea>
                        {error?.description !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.description}
                            </div>
                        )}
                    </div>
                </div>

                {/* HARGA BELI*/}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-harga_beli'>Harga Beli</label>
                    </div>
                    <div className="col-span-2">
                        <CurrencyInput 
                            id="inp-harga_beli"
                            name="harga_beli" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Harga Beli..."
                            value={InitializeForm('harga_beli')}
                            decimalsLimit={0}
                            groupSeparator="."
                            decimalSeparator=","
                            intlConfig={{
                                locale: 'id-ID',
                                currency: 'IDR',
                            }}
                            onValueChange={(value) => handleChange({...formData, harga_beli: Number(value)})}
                            autoComplete="off"
                        />
                        {error?.harga_beli !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.harga_beli}
                            </div>
                        )}
                    </div>
                </div>

                {/* HARGA JUAL*/}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-harga_jual'>Harga Jual</label>
                    </div>
                    <div className="col-span-2">
                        <CurrencyInput 
                            id="inp-harga_jual"
                            name="harga_jual" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Harga Jual..."
                            value={InitializeForm('harga_jual')}
                            decimalsLimit={0}
                            groupSeparator="."
                            decimalSeparator=","
                            intlConfig={{
                                locale: 'id-ID',
                                currency: 'IDR',
                            }}
                            onValueChange={(value) => handleChange({...formData, harga_jual: Number(value)})}
                            autoComplete="off"
                        />
                        {error?.harga_jual !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.harga_jual}
                            </div>
                        )}
                    </div>
                </div>

                {/* STOK*/}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-stok'>Stok Tersedia</label>
                    </div>
                    <div className="col-span-2">
                        <CurrencyInput 
                            id="inp-stok"
                            name="stok" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Stok tersedia..."
                            value={InitializeForm('stok') || 1}
                            decimalsLimit={0}
                            groupSeparator="."
                            decimalSeparator="," 
                            onValueChange={(value) => handleChange({...formData, stok: Number(value)})}
                            autoComplete="off"
                        />
                        {error?.stok !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.stok}
                            </div>
                        )}
                    </div>
                </div>

                {/* MINIMAL STOK*/}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-min_stok'>Minimal Stok</label>
                    </div>
                    <div className="col-span-2">
                        <CurrencyInput 
                            id="inp-min_stok"
                            name="min_stok" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Minimal stok yang harus disimpan..."
                            value={InitializeForm('min_stok') || 1}
                            decimalsLimit={0}
                            groupSeparator="."
                            decimalSeparator=","
                            onValueChange={(value) => handleChange({...formData, min_stok: Number(value)})}
                            autoComplete="off"
                        />
                        {error?.stok !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.stok}
                            </div>
                        )}
                    </div>
                </div>

                {/* STATUS*/}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <div className='text-sm'>Status Publikasi</div>
                    </div>
                    <div className="col-span-2">
                        <label 
                            className='relative inline-flex items-center cursor-pointer' 
                            htmlFor='inp-status'
                        >
                            <input 
                                type="checkbox" 
                                id="inp-status"
                                name="status" 
                                className="sr-only peer"
                                placeholder="Terbitkan.."
                                value={''}
                                defaultChecked={formData?.status && typeof InitializeForm('status') != 'undefined' ? true: false}
                                onChange={(e) => handleChange({...formData, status: (e.target.checked ? 1: 0)})}
                                autoComplete="off"
                            />
                            <div 
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                            ></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Publish
                            </span>
                        </label>
                        {error?.status !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {error?.status}
                            </div>
                        )}
                    </div>
                </div>

                {/* IMAGE */}
                {formData?.id && (
                    <div className="grid sm:grid-cols-3 gap-2 mb-2">
                        <div className="">
                            <div className='text-sm'>Gambar</div>
                            <div className="mt-5">
                                <img
                                src={convertImgUrl(formData)}
                                className={`shadow-xl object-cover ring-4 ring-slate-400 rounded-md h-[100px] w-[100px] align-middle border-none`}
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className='relative'>
                                <label 
                                    htmlFor="inp_photo"
                                    title="ganti foto"
                                >
                                    <input 
                                        type="file"
                                        name="photo"
                                        id="inp_photo"
                                        onChange={(e) => handleChangeImage(e, formData)}
                                        title="ganti foto"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}