import { useEffect, useState } from "react";
import loginFields from "../constants/loginConstant";
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

const fields = loginFields;
let fieldsState = {};
let errorState = {};

fields.forEach(element =>{
        fieldsState[element.id] = '';
        errorState[element.id] = '';
    }
);

export default function LoginPage({
    token,
    setToken,
    RouteURL
}){
    library.add(fas);
    const [loading, setLoading] = useState(false)
    const [loginState, setLoginState] = useState(fieldsState);
    const [validError, setValidError] = useState(errorState);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(()=>{
        if(token){
            navigate('../', {replace: true});
        }
    },[token, navigate])

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setLoading(true);
        setTimeout(()=>{
            const validate = validation();
            if(validate == true){
                authenticateUser();
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

    const authenticateUser = () =>{
        const APIURL = import.meta.env.VITE_APIURL+'/api/auth/login';
        axios.post(APIURL, loginState)
            .then(
                ({data}) => {
                    setLoading(false);
                    setToken(data.data.token);
                    navigate('../', {replace: true});
                    // window.location = RouteURL.HOMEPAGE.PATH;
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

        if(ValidateInput('Empty', loginState.email) == false){
            error['email'] = 'Email harus terisi';
        }

        if(ValidateInput('Email', loginState.email) == false){
            error['email'] = 'Format email tidak sesuai';
        }

        if(ValidateInput('Empty', loginState.password) == false){
            error['password'] = 'Password harus terisi'; 
        }

        if(Object.keys(error).length > 0){
            setValidError(error);
            return false;
        }
        return true;
    }
    
    return(
        <>
            <div className="min-w-screen min-h-screen bg-gradient-to-b from-teal-400 to-transparent flex items-center justify-center">
                <div className="w-full bg-gray-50 flex content-center justify-center shadow-inner shadow-gray-500">
                    <div className="w-3/4 grid md:grid-cols-2">
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
                        <div className="bg-white px-10 py-5 mb-5 sm:mb-0 shadow-md shadow-teal-600">
                            <h3 className="font-bold text-xl border-b border-gray-300 text-gray-600 px-2 py-2 mb-5">
                                LOG IN
                            </h3>
                            <div>
                                {fields.map((field) => (
                                    <LoginInput
                                    key={field.id}
                                    handleChange={handleChange}
                                    value={loginState[field.id]}
                                    labelText={field.labelText}
                                    labelFor={field.labelFor}
                                    id={field.id}
                                    name={field.name}
                                    type={field.type}
                                    isRequired={field.isRequired}
                                    placeholder={field.placeholder}
                                    customClass=''
                                    errorMessage={validError[field.id]}
                                />
                                ))}
                                <div>
                                    <button
                                        onClick={handleSubmit}
                                        className="font-bold w-full bg-teal-400 px-5 py-2 text-white hover:bg-teal-600 border-2 border-teal-200"
                                    >
                                        <FontAwesomeIcon icon='unlock' className="w-4 h-3 mr-2 text-white" />
                                        {loading ? 'Mohon Tunggu...' : 'Log In'}
                                    </button>
                                </div>
                                <div>
                                    <div className="w-full px-3 mb-5 text-right">
                                        Belum punya akun? 
                                        <a 
                                        href={RouteURL.REGISTER.PATH} 
                                        className="ml-2 text-gray-500 cursor-pointer hover:text-blue-500 font-semibold focus:text-teal-900">
                                            Register
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