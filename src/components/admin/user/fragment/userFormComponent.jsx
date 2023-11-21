import { useEffect, useState } from 'react';
import UserRegistrationForm from './../../../../constants/admin/user/userRegistrationConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select'
export default function UserForm({
    formData,
    handleChange,
    error,
    usergroupField
}){
    const [LoginAccount, setLoginAccount] = useState(false);
    const [passwordType, setPasswordType] = useState('password');

    useEffect(()=>{
        if(!LoginAccount){
            const optionObj = [];
            if(usergroupField){
                for(const items of usergroupField){
                    optionObj.push({
                        key: items.id,
                        value: String(items.id),
                        label: `${items.level} - ${items.name}`,
                    });
                }
            }
            setLoginAccount(() => UserRegistrationForm({usergroup: optionObj}));
        }
    },[usergroupField, LoginAccount]);

    return(
        <>
            <div className="">
            {LoginAccount && LoginAccount.map((items, index) => {
                    if(items.type == 'text' || items.type == 'password'){
                        return (
                            <div key={index} className='grid sm:grid-cols-3 gap-2 mb-2'>
                                <label htmlFor={`inp_${items.name}`} 
                                    className="text-sm text-right">
                                        {items.label}
                                </label>
                                <div className='sm:col-span-2 relative'>
                                    {items.type == 'password' && (
                                        <div 
                                            className="absolute right-0 mr-2 top-2 cursor-pointer text-gray-500"
                                            onClick={()=>setPasswordType(passwordType == 'text' ? 'password' : 'text')}
                                        >
                                        <FontAwesomeIcon icon={'eye'}/>
                                        </div>
                                    )}
                                    <input
                                        type={items.type == 'password' ? passwordType : items.type}
                                        name={items.name}
                                        id={`inp_${items.name}`}
                                        className={`w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500 ${items.name == 'user_type' ? 'bg-gray-200' : ''}`}
                                        placeholder={items?.placeholder}
                                        value={formData[items.name]}
                                        onChange={(e) => handleChange({...formData, [e.target.name]: e.target.value})}
                                        autoComplete="off"
                                        readOnly={items?.readonly == true}
                                    />
                                    {error[items.name] !='' && (
                                        <div className="text-red-500 text-xs w-full grid first-letter:uppercase">
                                            <div className="">
                                                {error[items.name]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    } else if(items.type == 'select'){
                        return (
                            <div key={index} className='grid sm:grid-cols-3 gap-2 mb-2'>
                                <label htmlFor={`inp_${items.name}`} 
                                    className="text-sm sm:col-span-1 text-right">
                                        {items.label}
                                </label>
                                <div className='sm:col-span-2 '>
                                    <Select
                                        name={items.name}
                                        inputId={`inp_${items.name}`}
                                        className="w-full text-xs"
                                        defaultValue={items?.option?.find(op => {
                                            return op.value == formData[items.name];
                                        })}
                                        onChange={({value}) => handleChange({...formData, [items.name]: value})}
                                        autoComplete="off"
                                        placeholder="Pilih grup..."
                                        options={items?.option}
                                    />
                                    {error[items.name] !='' && (
                                        <div className="text-red-500 text-xs w-full grid first-letter:uppercase">
                                            <div className="">
                                                {error[items.name]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    )
}