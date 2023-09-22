import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NumericalOnly } from "../../../../helpers/converterHelper";
import { UTCToLocaleDate } from "../../../../helpers/dateHelper";
import UserImage from "./userImage";

export default function DataProfile({
    panel,
    setPanel,
    axiosHandler,
    swal,
    updateStatus,
    setUpdateStatus,
}){
    const [userProfile, setUserProfile] = useState(null);
    const [userImg, setUserImg] = useState(false);
    const [loader, setLoader] = useState(false);
    const [errArray, setErrArray] = useState(false);
    const baseUrl = import.meta.env.VITE_APIURL;

    useEffect(()=>{
        if(userProfile == null){
            axiosHandler('get')
            .then(({data}) => {
                if(data.statusCode == 400){
                    throw(data);
                }
                setUserProfile(data.data);
                setUserImg(baseUrl+'/api/user/photo/'+data.data.id+'/'+data.data.profile.photo);
            });
        }
    }, [axiosHandler, userProfile, baseUrl]);

    const handleProfile = (e) => { 
        const profile = userProfile.profile;
        setUserProfile({...userProfile, profile: {...profile, [e.target.name]: e.target.value}});
    }

    const updateProfile = () => {
        const profile = userProfile.profile;
        delete profile.user_id;
        delete profile.photo;

        setLoader(true);
        setTimeout(()=> {
            axiosHandler('put', profile)
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
                swal({
                    icon: 'warning',
                    title: 'Request Error',
                    text: errTxt
                });
            })
            .finally(() => {
                setLoader(false);
            });
        },5000);
    }

    const handleChangeImage = (e) => {
        const formData = new FormData();
        formData.append('photo', e.target.files[0]);
        axiosHandler('post', formData, `/photo/${userProfile.id}`, {
            'Content-Type' : 'multipart/form-data',
        }).then(({data}) => {
            if(data.statusCode == 400){
                throw(data);
            }
            setTimeout(() => {
                setUserImg(baseUrl+'/api/user/photo/'+userProfile.id+'/'+data.data.photo);
            }, 1000);
        });
    }

    return(
        <>
            {/* FOTO PROFILE */}
            <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className='relative'>
                        <UserImage
                            url={userProfile && userImg}
                        />
                        <label 
                            htmlFor="inp_photo"
                            className="absolute ring-1 ring-slate-300 -top-1 rounded-lg cursor-pointer left-0 -mr-3 bg-slate-50 opacity-10 hover:opacity-50 hover:bg-gray-500 hover:text-white px-2 py-1 text-gray-600"
                            title="ganti foto"
                        >
                            <input 
                                type="file"
                                name="photo"
                                id="inp_photo"
                                className="hidden"
                                onChange={(e) => handleChangeImage(e)}
                                title="ganti foto"
                            />
                            <FontAwesomeIcon icon="camera-retro" />
                        </label>
                    </div>
                </div>
            </div>
            {/* PROFILE */}
            <div className="mt-10 py-2 border-t border-blueGray-200">
                <h3 
                    className='relative font-semibold uppercase bg-gradient-to-br px-4 py-2 bg-gray-200 border border-gray-400 cursor-pointer hover:bg-gray-300'
                    onClick={()=>setPanel({
                        ...panel, 
                        ['show']: panel.show == true ? false : true,
                        ['context'] : 'data-pribadi'
                    })}
                >
                    DATA PRIBADI
                    <span className="text-red-600 text-xs absolute top-2 px-2">* Wajib Diisi</span>
                    <div 
                        className='md:inline-block float-right'
                    >
                        <FontAwesomeIcon icon={panel.show && panel.context =='data-pribadi' ? 'chevron-down' : 'chevron-right'}/>
                    </div>
                </h3>
                <div 
                    id="form-data-pribadi" 
                    className={`border border-gray-400 px-4 py-4 rounded-sm grid grid-cols-1 ${panel.show && panel.context =='data-pribadi' ? '' : 'hidden'}`}
                >
                    <div className="sm:w-2/3">
                        
                        {/* Nama */}
                        <div className="grid sm:grid-cols-5 gap-2">
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_name'>Nama Lengkap</label>
                            <input 
                                type="text" 
                                id="inp_name"
                                name="name" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Nama lengkap..."
                                value={ userProfile?.profile?.name ? userProfile.profile.name : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.name !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.name}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="grid sm:grid-cols-5 gap-2 mt-2">
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_email'>Email</label>
                            <input 
                                type="email" 
                                id="inp_email"
                                name="email" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Email..."
                                value={userProfile?.profile?.email ? userProfile.profile.email : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.email !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.email}
                                </div>
                            </div>
                        )}

                        {/* handphone */}
                        <div className="grid sm:grid-cols-5 gap-2 mt-2">
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_hp'>Handphone</label>
                            <input 
                                type="text" 
                                id="inp_hp"
                                name="phone" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Nomor Telepon..."
                                value={userProfile?.profile?.phone ? userProfile.profile.phone : ''}
                                onKeyUp={(e) => NumericalOnly(e.target.value)}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.phone !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.phone}
                                </div>
                            </div>
                        )}

                        {/* no_ktp */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_ktp'>Nomor KTP</label>
                            <input 
                                type="text" 
                                id="inp_ktp"
                                name="ktp" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Nomor KTP..."
                                value={userProfile?.profile?.ktp ? userProfile.profile.ktp : ''}
                                onKeyUp={(e) => e.target.value = NumericalOnly(e.target.value)}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.ktp !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.ktp}
                                </div>
                            </div>
                        )}

                        {/* masa_berlaku */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_exp'>Masa Berlaku</label>
                            <input 
                                type="date" 
                                id="inp_exp"
                                name="masa_berlaku" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Masa berlaku KTP..."
                                value={userProfile?.profile?.masa_berlaku ? UTCToLocaleDate(userProfile.profile.masa_berlaku) : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.masa_berlaku !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.masa_berlaku}
                                </div>
                            </div>
                        )}

                        {/* dob_place */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_dobPlace'>Tempat, Tanggal Lahir</label>
                            <div className="sm:col-span-3">
                                <input 
                                    type="text" 
                                    id="inp_dobPlace"
                                    name="dob_place" 
                                    className="w-full md:w-2/5 md:inline-block text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500 mr-2"
                                    placeholder="Tempat lahir..."
                                    value={userProfile?.profile?.dob_place ? userProfile.profile.dob_place : ''}
                                    onChange={(e) => handleProfile(e)}
                                    autoComplete="off"
                                />
                                <input 
                                    type="date" 
                                    id="inp_dob"
                                    name="dob" 
                                    className="w-full md:w-2/5 md:inline-block text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                    placeholder="Tanggal lahir..."
                                    value={userProfile?.profile?.dob ? UTCToLocaleDate(userProfile.profile.dob) : ''}
                                    onChange={(e) => handleProfile(e)}
                                    autoComplete="off"
                                />
                            </div>
                            {errArray?.dob !='' && (
                                <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                    <div className="sm:col-start-3 col-span-3">{errArray.dob}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gender */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <div className='text-sm sm:col-span-2 sm:text-right'>Jenis Kelamin</div>
                            <div className="sm:col-span-3">
                                <input 
                                    type="radio" 
                                    id="inp_gender"
                                    name="gender" 
                                    className="w-5 inline-block text-gray text-xs py-2 outline-none border focus:border-gray-500"
                                    value={'male'}
                                    checked={userProfile?.profile?.gender == 'male' ? true : false}
                                    onChange={(e) => handleProfile(e)}
                                />
                                <label className="text-sm mr-4" htmlFor="inp_gender">
                                    Pria
                                </label>
                                <input 
                                    type="radio" 
                                    id="inp_gender2"
                                    name="gender" 
                                    className="w-5 inline-block text-gray text-xs py-2 outline-none border focus:border-gray-500"
                                    value={'female'}
                                    checked={userProfile?.profile?.gender == 'female' ? true : false}
                                    onChange={(e) => handleProfile(e)}
                                />
                                <label className='text-sm sm:col-span-2 sm:text-right' htmlFor="inp_gender2">Wanita</label>
                            </div>
                        </div>
                        {errArray?.gender !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.gender}
                                </div>
                            </div>
                        )}

                        {/* pendidikan */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_edu'>Pendidikan</label>
                            <select 
                                type="text" 
                                id="inp_edu"
                                name="education" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Pendidikan..."
                                value={userProfile?.profile?.education ? userProfile.profile.education : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            >
                                <option>----</option>
                                <option>SD</option>
                                <option>SLTP</option>
                                <option>SLTA</option>
                                <option>Sarjana</option>
                                <option>Magister</option>
                                <option>Doktoral</option>
                            </select>
                        </div>
                        {errArray?.education !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.education}
                                </div>
                            </div>
                        )}

                        {/* marital status */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_marital'>Status Pernikahan</label>
                            <select 
                                type="text" 
                                id="inp_marital"
                                name="marital_status" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Status Pernikahan..."
                                value={userProfile?.profile?.marital_status ? userProfile.profile.marital_status : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            >
                                <option>----</option>
                                <option>Belum menikah</option>
                                <option>Menikah</option>
                                <option>Bercerai</option>
                            </select>
                        </div>
                        {errArray?.marital_status !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.marital_status}
                                </div>
                            </div>
                        )}

                        {/* alamat */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_alamat'>Alamat</label>
                            <input 
                                type="text" 
                                id="inp_alamat"
                                name="alamat" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Alamat..."
                                value={userProfile?.profile?.alamat ? userProfile.profile.alamat : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.alamat !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.alamat}
                                </div>
                            </div>
                        )}
                        
                        {/* kelurahan */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_kelurahan'>Kelurahan</label>
                            <input 
                                type="text" 
                                id="inp_kelurahan"
                                name="kelurahan" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Kelurahan..."
                                value={userProfile?.profile?.kelurahan ? userProfile.profile.kelurahan : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.kelurahan !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.kelurahan}
                                </div>
                            </div>
                        )}

                        {/* kecamatan */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_kecamatan'>Kecamatan</label>
                            <input 
                                type="text" 
                                id="inp_kecamatan"
                                name="kecamatan" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Kecamatan..."
                                value={userProfile?.profile?.kecamatan ? userProfile.profile.kecamatan : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.kecamatan !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.kecamatan}
                                </div>
                            </div>
                        )}

                        {/* kota */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_kota'>Kota</label>
                            <input 
                                type="text" 
                                id="inp_kota"
                                name="kota" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Kota..."
                                value={userProfile?.profile?.kota ? userProfile.profile.kota : ''}
                                onChange={(e) => handleProfile(e)}
                                autoComplete="off"
                            />
                        </div>
                        {errArray?.kota !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.kota}
                                </div>
                            </div>
                        )}

                        {/* Status Kepemilikan */}
                        <div className='grid sm:grid-cols-5 gap-2 mt-2'>
                            <label className='text-sm sm:col-span-2 sm:text-right' htmlFor='inp_sttPemilik'>Status Kepemilikan</label>
                            <select 
                                type="text" 
                                id="inp_sttPemilik"
                                name="status_kepemilikan" 
                                className="sm:col-span-3 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                                placeholder="Status milik..."
                                value={userProfile?.profile?.status_kepemilikan ? userProfile.profile.status_kepemilikan : ''}
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
                        </div>
                        {errArray?.status_kepemilikan !='' && (
                            <div className="text-red-500 text-xs w-full grid sm:grid-cols-5 gap-2 first-letter:uppercase">
                                <div className="sm:col-start-3 col-span-3">{errArray.status_kepemilikan}
                                </div>
                            </div>
                        )}

                        {/* BUTTON */}
                        <div className='mt-2 w-full py-4 text-center sm:text-right'>
                            {updateStatus && <span className="mr-5 text-xs text-gray-400">Data berhasil disimpan!!</span>}
                            <button 
                                type='button'
                                className='bg-teal-500 border mr-2 border-teal-600 text-xs rounded-md px-4 ring-2 leading-4 font-semibold ring-slate-600 py-2 text-white hover:bg-teal-800'
                                onClick={updateProfile}
                            >
                            {loader ? 'Harap Tunggu' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>        
        </>
    )
}