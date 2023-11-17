import { useCallback, useEffect, useState } from "react";
import LoginInput from './../components/login/loginInput';
import LajuInvest from './../assets/images/logo/lajuinvestama.png';
import ValidateInput from "../helpers/validationHelper";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

export default function RegistrationPage({
    token
}){
    library.add(fas);
    const defaultRegisData = useCallback(() => ({
        email: '',
        phone: '',
        username: '',
        password: '',
        retypePassword: '',
    }),[]);
    const [loading, setLoading] = useState(false);
    const [regisData, setRegisData] = useState(defaultRegisData);
    const [validError, setValidError] = useState(defaultRegisData);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(()=>{
        if(token){
            navigate('../', {replace: true});
        }
    },[token, navigate])

    const handleChange=(e)=>{
        setRegisData({...regisData,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setLoading(true);
        setTimeout(()=>{
            const validate = validation();
            if(validate == true){
                registerUser();
            }
        },1000);
    }

    const showAlert = (prop) => {
        let swalProp = {
            showCloseButton: true,
            customClass:{
                actions: 'text-center',
                icon: 'text-xs'
            }
        }

        if(Object.keys(prop).length > 0){
            console.log(prop);
            swalProp = {...swalProp, ...prop}
        }

        MySwal.fire(swalProp);
    }

    const registerUser = () =>{
        const APIURL = import.meta.env.VITE_APIURL+'/api/user/register';
        delete regisData.retypePassword;
        axios.post(APIURL, regisData)
            .then(
                ({data}) => {
                    console.log(data);
                    setLoading(false);
                    navigate('/login', {replace: true});
                }
            ).catch((error) => {
                let errorRes = {};
                if(error.response){
                    errorRes[error.response.data.message[0].property] = error.response.data.message[0].constraint[0]
                    showAlert({
                        icon: 'info',
                        text: error.response.data.message[0].constraint[0]
                    });
                }
                else if(error.request){
                    showAlert({
                        icon: 'error',
                        text: 'Server saat ini tidak dapat digunakan'
                    });
                    console.log('error request', error.request)
                }

                if(Object.keys(errorRes).length > 0){
                    console.log(errorRes);
                    setValidError(errorRes);
                }
                setLoading(false);
            });

    }
    
    const validation = () => {
        let error = {};

        if(ValidateInput('Empty', regisData.email) == false){
            error['email'] = 'Email harus terisi';
        }

        if(ValidateInput('Email', regisData.email) == false){
            error['email'] = 'Format email tidak sesuai';
        }

        if(ValidateInput('Empty', regisData.phone) == false){
            error['phone'] = 'Telepon harus terisi'; 
        }

        if(ValidateInput('Empty', regisData.username) == false){
            error['username'] = 'Username harus terisi'; 
        }

        if(ValidateInput('Empty', regisData.password) == false){
            error['password'] = 'Password harus terisi'; 
        }

        if(ValidateInput('Empty', regisData.password) == false){
            error['retypePassword'] = 'Ulangi password harus terisi'; 
        }

        if(ValidateInput('MatchingPassword', regisData.password, regisData.retypePassword) == false){
            error['retypePassword'] = 'Password tidak sama';
        }
        
        if(Object.keys(error).length > 0){
            setValidError(error);
            setLoading(false);
            return false;
        }
        return true;
    }
    
    return(
        <>
            <div className="min-w-screen min-h-screen bg-gradient-to-b from-teal-400 to-transparent flex items-center justify-center">
                <div className="w-full bg-gray-50 flex content-center justify-center shadow-inner shadow-gray-500 px-4">
                    <div className="w-full grid md:grid-cols-2">
                        <div className="px-5 py-5">
                            <h1 className="font-bold text-gray-400 text-3xl text-center">PT. LAJU INVESTAMA</h1>
                            <div 
                                alt="Login into PT. Laju Investama Application" 
                                className="w-full p-4 min-h-[300px] bg-cover bg-no-repeat bg-center hidden md:block"
                                style={{
                                    backgroundImage: `url(${LajuInvest})`
                                }}
                            >
                            </div>
                        </div>
                        <div className="bg-white px-4 py-5 mb-5 sm:mb-0 shadow-md shadow-teal-600">
                            <h3 className="font-bold text-xl border-b border-gray-300 text-gray-600 px-2 py-2 mb-5">
                                Register
                            </h3>
                            <div>
                                {Object.keys(regisData).map((field) => (
                                    <LoginInput
                                    key={field}
                                    handleChange={handleChange}
                                    value={regisData[field]}
                                    labelText={field}
                                    labelFor={field}
                                    id={field}
                                    name={field}
                                    type={['password', 'retypePassword'].includes(field) ? 'password' : 'text'}
                                    isRequired={true}
                                    placeholder={field}
                                    customClass=''
                                    errorMessage={validError[field]}
                                />
                                ))}
                                <div>
                                    <button
                                        onClick={handleSubmit}
                                        className="font-bold w-full bg-teal-400 px-5 py-2 text-white hover:bg-teal-600 border-2 border-teal-200"
                                    >
                                        <FontAwesomeIcon icon='unlock' className="w-4 h-3 mr-2 text-white" />
                                        {loading ? 'Mohon Tunggu...' : 'Register'}
                                    </button>
                                </div>
                                <div>
                                    <div className="w-full px-3 mb-5 text-right">
                                        Sudah punya akun? 
                                        <a 
                                        href={'/login'} 
                                        className="ml-2 text-gray-500 cursor-pointer hover:text-blue-500 font-semibold focus:text-teal-900">
                                            Login
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}