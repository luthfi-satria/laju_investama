import { useEffect, useState } from "react"
import ShowSweetAlert from "../../../../helpers/showAlert";

export default function EditUserFormComponent({
    account={},
    setAccount,
    axiosHandler
}){
    const [errArray, setErrArray] = useState(false);
    const [loader, setLoader] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);

    const handleProfile = (e) => {
        const profile = account.profile;
        const updateProfile = {...profile, [e.target.name]:e.target.value}
        setAccount({...account, ['profile']: updateProfile});
    }
   
    const updateProfile = () => {
        const profile = account.profile;
        delete profile.user_id;
        delete profile.photo;

        setLoader(true);
        setTimeout(()=> {
            axiosHandler('put', profile, '/user/profile/'+account.id)
            .then((response) => {
                if(response){
                    setUpdateStatus(true);
                    setErrArray(false);
                }
            })
            .catch((err)=>{
                let errTxt = 'Input form tidak valid';
                if(err.code == 'ERR_NETWORK'){
                    errTxt = err.message;
                }
                else{
                    const joinErr = {};
                    const errMsg = err.response.data.message;
                    for(const e of errMsg){
                        joinErr[e.property] = e.constraints.join(', ');
                    }
                    setErrArray(joinErr);
                }
                ShowSweetAlert({
                    icon: 'warning',
                    title: 'Request Error',
                    text: errTxt
                });
            })
            .finally(() => {
                setLoader(false);
                setTimeout(()=>{
                    setUpdateStatus(false);
                },3000);
            });
        },5000);
    }

    const InitializeForm = (property) => {
        return account?.profile?.[property] || '';
    }

    return (
        <>
            <div 
                id="akun-profile" 
                className={`border border-gray-400 px-4 py-4 rounded-sm grid grid-cols-1`}
            >
                {/* NAMA */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_name'>Nama Lengkap</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_name"
                            name="name" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nama lengkap..."
                            value={InitializeForm('name')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.name !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.name}
                            </div>
                        )}
                    </div>
                </div>

                {/* ALAMAT */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_alamat'>Alamat</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_alamat"
                            name="alamat" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Alamat lengkap..."
                            value={InitializeForm('alamat')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.alamat !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.alamat}
                            </div>
                        )}
                    </div>
                </div>

                {/* KELURAHAN */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_kelurahan'>Kelurahan</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_kelurahan"
                            name="kelurahan" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kelurahan..."
                            value={InitializeForm('kelurahan')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.kelurahan !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.kelurahan}
                            </div>
                        )}
                    </div>
                </div>

                {/* KECAMATAN */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_kecamatan'>Kecamatan</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_kecamatan"
                            name="kecamatan" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kecamatan..."
                            value={InitializeForm('kecamatan')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.kecamatan !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.kecamatan}
                            </div>
                        )}
                    </div>
                </div>

                {/* KOTA */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_kota'>Kota</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_kota"
                            name="kota" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Kota..."
                            value={InitializeForm('kota')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.kota !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.kota}
                            </div>
                        )}
                    </div>
                </div>

                {/* EMAIL */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_email'>Email</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_email"
                            name="email" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Alamat Email..."
                            value={InitializeForm('email')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.email !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.email}
                            </div>
                        )}
                    </div>
                </div>

                {/* PHONE */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_phone'>Nomor Telepon</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_phone"
                            name="phone" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Phone..."
                            value={InitializeForm('phone')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.phone !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.phone}
                            </div>
                        )}
                    </div>
                </div>

                {/* GENDER */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_gender'>Jenis Kelamin</label>
                    </div>
                    <div className="col-span-2">
                        <select 
                            id="inp_gender"
                            name="gender" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Jenis Kelamin..."
                            value={InitializeForm('gender')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        >
                            <option value={''}>----</option>
                            <option value={'male'}>Laki laki</option>
                            <option value={'female'}>Perempuan</option>
                        </select>
                        {errArray?.gender !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.gender}
                            </div>
                        )}
                    </div>
                </div>

                {/* DOB PLACE */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_dob_place'>Tempat Lahir</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_dob_place"
                            name="dob_place" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Tempat Lahir..."
                            value={InitializeForm('dob_place')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.dob_place !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.dob_place}
                            </div>
                        )}
                    </div>
                </div>

                {/* DOB */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_dob'>Tanggal Lahir</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="date" 
                            id="inp_dob"
                            name="dob" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Tanggal Lahir..."
                            value={InitializeForm('dob')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.dob !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.dob}
                            </div>
                        )}
                    </div>
                </div>

                {/* MARITAL STATUS */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_martial'>Status</label>
                    </div>
                    <div className="col-span-2">
                        <select 
                            id="inp_martial"
                            name="marital_status" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Status pernikahan..."
                            value={InitializeForm('marital_status')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        >
                            <option value={''}>----</option>
                            <option value={'Belum Menikah'}>Belum Menikah</option>
                            <option value={'Menikah'}>Menikah</option>
                            <option value={'Bercerai'}>Bercerai</option>
                        </select>
                        {errArray?.marital_status !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.marital_status}
                            </div>
                        )}
                    </div>
                </div>

                {/* PENDIDIKAN */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_education'>Pendidikan</label>
                    </div>
                    <div className="col-span-2">
                        <select 
                            id="inp_education"
                            name="education" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={InitializeForm('education')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        >
                            <option>----</option>
                            <option value={'Sekolah Dasar'}>SD</option>
                            <option value={'Sekolah Lanjutan Tingkat Pertama'}>SLTP</option>
                            <option value={'Sekolah Lanjutan Tingkat Akhir'}>SLTA</option>
                            <option value={'Diploma 3'}>Diploma 3</option>
                            <option value={'Sarjana'}>Sarjana</option>
                            <option value={'Magister'}>Magister</option>
                            <option value={'Doktoral'}>Doktoral</option>
                        </select>
                        {errArray?.education !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.education}
                            </div>
                        )}
                    </div>
                </div>

                {/* KTP */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_ktp'>Nomor KTP</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="inp_ktp"
                            name="ktp" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Nomor KTP..."
                            value={InitializeForm('ktp')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.ktp !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.ktp}
                            </div>
                        )}
                    </div>
                </div>

                {/* MASA BERLAKU KTP */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_exp'>Masa Berlaku KTP</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="date" 
                            id="inp_exp"
                            name="masa_berlaku" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Tanggal Lahir..."
                            value={InitializeForm('masa_berlaku')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        />
                        {errArray?.masa_berlaku !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.masa_berlaku}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* STATUS KEPEMILIKAN RUMAH */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_kepemilikan'>Status Kepemilikan</label>
                    </div>
                    <div className="col-span-2">
                        <select 
                            id="inp_kepemilikan"
                            name="status_kepemilikan" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={InitializeForm('status_kepemilikan')}
                            onChange={(e) => handleProfile(e)}
                            autoComplete="off"
                        >
                            <option>----</option>
                            <option>Milik Sendiri</option>
                            <option>Milik Orang Tua</option>
                            <option>Mengontrak</option>
                            <option>Rumah Dinas</option>
                            <option>Lainnya</option>
                        </select>
                        {errArray?.status_kepemilikan !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.status_kepemilikan}
                            </div>
                        )}
                    </div>
                </div>

                {/* VERIFIKASI DATA */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <div className='text-sm'>Status Verifikasi</div>
                    </div>
                    <div className="col-span-2">
                        <label 
                            className="relative inline-flex items-center cursor-pointer"
                            htmlFor="inp_verifikasi"
                        >
                            <input 
                                type="checkbox"
                                id="inp_verifikasi"
                                name="verify_at" 
                                className="sr-only peer"
                                value=''
                                defaultChecked={account?.profile && typeof InitializeForm('verify_at') != 'undefined' ? true: false}
                                onChange={(e)=>{
                                    setAccount({...account, ['profile']: {...account.profile, ['verify_at']: String(e.target.checked)}})
                                }}
                            />
                            <div 
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Verifikasi
                            </span>
                        </label>
                        {errArray?.verify_at !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.verify_at}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid mb-2">
                    <div className='mt-2 w-full py-4 text-center sm:text-right'>
                        {updateStatus && <span className="mr-5 text-xs text-gray-400">Data berhasil disimpan!!</span>}
                        <button 
                            type='button'
                            className='bg-teal-500 border mr-2 border-teal-600 text-xs rounded-md px-4 ring-2 leading-4 font-semibold ring-slate-600 py-2 text-white hover:bg-teal-800'
                            onClick={updateProfile}
                        >
                        {loader ? 'Harap Tunggu' : 'Update'}
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}