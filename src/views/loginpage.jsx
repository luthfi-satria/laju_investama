import { useEffect, useState } from "react";
import loginFields from "../constants/loginConstant";
import LoginInput from './../components/login/loginInput';
import SDITLogo from '../assets/images/logo/sdit.svg';
import RouteURL from "../constants/routesConstant";
import ValidateInput from "../helpers/validationHelper";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useLocalStorage } from "../hooks/appHooks";
import {useNavigate} from 'react-router-dom';
const fields = loginFields;
let fieldsState = {};
let errorState = {};

fields.forEach(element =>{
        fieldsState[element.id] = '';
        errorState[element.id] = '';
    }
);

export default function LoginPage({userData}){
    const [loading, setLoading] = useState(false)
    const [loginState, setLoginState] = useState(fieldsState);
    const [validError, setValidError] = useState(errorState);
    const [token, setToken] = useLocalStorage("token", false);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(()=>{
        if(userData){
            navigate(RouteURL.HOMEPAGE.PATH, {replace: true});
        }
    })

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setLoading(true);
        const validate = validation();
        if(validate == true){
            authenticateUser();
        }
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
        const APIURL = import.meta.env.VITE_APIURL+'/auth/login';
        axios.post(APIURL, loginState)
            .then(
                ({data}) => {
                    setLoading(false);
                    setToken(data.data.token);
                    window.location = RouteURL.HOMEPAGE.PATH;
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
        <div className="min-w-screen min-h-screen bg-gradient-to-b from-teal-400 flex items-center justify-center px-5 py-5">
            <div className="bg-teal-500 text-white rounded-lg shadow-xl w-full overflow-hidden" style={{maxWidth:'500px'}}>
                <div className="md:flex w-full">
                    <div className="hidden md:block w-2/5 bg-white">
                        <img src={SDITLogo} className="object-contain h-full w-full"/>
                    </div>
                    <div className="w-full md:w-3/5 py-2 px-3 md:px-3">
                        <div className="text-center mb-10">
                            <h1 className="font-bold text-base text-white">LOGIN</h1>
                            <p>Enter your login account</p>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                {
                                    fields.map((field) => 
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
                                    )
                                }
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-5">
                                        <button className="border-2 border-white block w-full mx-auto hover:bg-teal-700 focus:bg-teal-700 text-white rounded-lg px-3 py-1 font-semibold">
                                            {!loading && <span className='indicator-label'>Login</span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{display: 'block'}}>
                                                Mohon Tunggu...
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-5 text-right">
                                        <a href={RouteURL.REGISTER.PATH} className="cursor-pointer hover:text-teal-900 focus:text-teal-900">
                                            Register
                                        </a>
                                        <span className="mx-2">|</span>
                                        <a href={RouteURL.FORGOT_PASSWORD.PATH} className="cursor-pointer hover:text-teal-900 focus:text-teal-900">
                                            Forgot Password
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}