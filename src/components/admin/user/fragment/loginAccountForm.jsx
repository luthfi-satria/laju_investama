import { useEffect, useState } from "react";
import ShowSweetAlert from "../../../../helpers/showAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginAccountFORM({
    account,
    axiosHandler
}){
    const [errArray, setErrArray] = useState(false);
    const [loader, setLoader] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);
    const [usergroup, setUsergroup] = useState(false);
    const [passwordType, setPasswordType] = useState('password');
    const [loginAccount, setLoginAccount] = useState({
        username: '',
        usergroup_id: '',
        password: '',
    })
    
    useEffect(()=>{
        if(account){
            setLoginAccount({
                username: account.username,
                usergroup_id: String(account.usergroup_id),
                password: '',
            })
        }
    },[account]);

    useEffect(()=>{
        if(!usergroup){
            axiosHandler('get', {page: 1, limit: 100}, '/usergroup')
            .then(({data})=>{
                if(data.statusCode == 400){
                    throw(data);
                }

                if(data?.data){
                    const listGroup = data.data.items;
                    setUsergroup(listGroup);
                }
            })
            .catch((error)=>{
                console.log('Error', error);
            });
        }
    },[usergroup, axiosHandler]);

    const handleLogin = (e) => {
        setLoginAccount({...loginAccount, [e.target.name]: e.target.value});
    }

    const updateLogin = () => {
        setLoader(true);
        setTimeout(()=> {
            axiosHandler('put', loginAccount, '/user/login_account/'+account.id)
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
    return (
        <>
            <div 
                id="login-akun" 
                className={`border border-gray-400 px-4 py-4 rounded-sm grid grid-cols-1`}
            >
                {/* USERNAME */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='login-username'>Username</label>
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="text" 
                            id="login-username"
                            name="username" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Username..."
                            value={loginAccount?.username ? loginAccount.username : ''}
                            onChange={(e) => handleLogin(e)}
                            autoComplete="off"
                        />
                        {errArray?.username !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.username}
                            </div>
                        )}
                    </div>
                </div>

                {/* USERGROUP */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='login-usergroup'>Usergroup</label>
                    </div>
                    <div className="col-span-2">
                        <select 
                            id="login-usergroup"
                            name="usergroup_id" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            value={loginAccount?.usergroup_id ? loginAccount.usergroup_id : ''}
                            onChange={(e)=>handleLogin(e)}
                            autoComplete="off"
                        >
                            {usergroup && usergroup.map((items, index) => {
                                return (
                                    <option 
                                        key={index}
                                        value={items.id}
                                        data-level={items.level}
                                    >
                                        {items.level} - {items.name}
                                    </option>
                                );
                            })}
                        </select>
                        {errArray?.usergroup_id !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.usergroup_id}
                            </div>
                        )}
                    </div>
                </div>

                {/* PASSWORD */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='login-password'>Password</label>
                    </div>
                    <div className="col-span-2 relative">
                        <div 
                            className="absolute right-0 mr-2 top-1 cursor-pointer text-gray-500"
                            onClick={()=>setPasswordType(passwordType == 'text' ? 'password' : 'text')}
                        >
                            <FontAwesomeIcon icon={'eye'}/>
                        </div>
                        <input 
                            type={passwordType} 
                            id="login-password"
                            name="password" 
                            className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            placeholder="Ganti password..."
                            value={loginAccount?.password ? loginAccount.password : ''}
                            onChange={(e) => handleLogin(e)}
                            autoComplete="off"
                        />
                        {errArray?.password !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.password}
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
                            onClick={updateLogin}
                        >
                        {loader ? 'Harap Tunggu' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}