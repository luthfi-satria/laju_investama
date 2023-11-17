import Select from 'react-select';
import { useEffect, useState } from 'react';

export default function AccessControlForm({
    data,
    setData,
    errArray,
    axiosRequest,
}){
    const [usergroup, setUsergroup] = useState(false);
    const [menu, setMenu] = useState(false);
    const [triggerLoad, setTriggerLoad] = useState(true);
    const [triggerMenu, setTriggerMenu] = useState(true);
    const permissionsField = ['CREATE','UPDATE','DELETE','VIEW'];
    useEffect(() => {
        if(!usergroup && triggerLoad){
            axiosRequest('get','api/usergroup',{params:{
                page: 1,
                limit:1000,
            }}, true).then(({data}) => {
                console.log(data);
                setUsergroup(data?.data);
                setTriggerLoad(false);
            }).catch((err) => {
                setTriggerLoad(false);
                console.log(err);
            });
        }
    },[usergroup, axiosRequest, triggerLoad]);

    useEffect(() => {
        if(!menu && triggerMenu){
            axiosRequest('get','api/appmenu',{params:{
                page: 1,
                limit:1000,
            }}, true).then(({data}) => {
                setMenu(data?.data);
                setTriggerMenu(false);
            }).catch((err) => {
                setTriggerMenu(false);
                console.log(err);
            });
        }
    },[menu, axiosRequest, triggerMenu]);
    return(
        <>
            <div 
                id="data-produk" 
                className={`grid grid-cols-1`}
            >

                {/* USERGROUP */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp_usergroup'>Usergroup</label>
                    </div>
                    <div className="col-span-2">
                        <Select 
                            type="text" 
                            inputId="inp_usergroup"
                            name="usergroup" 
                            className="w-full text-gray text-xs outline-none focus:border-gray-500"
                            onChange={(value) => setData({...data, usergroup_id: Number(value?.id)})}
                            value={usergroup?.items?.find(op => {
                                return op.id == data?.usergroup_id;
                            })}
                            autoComplete='off'
                            options={usergroup?.items}
                            getOptionLabel={(option) => option?.level?.concat(` - ${option?.name}`)}
                            getOptionValue={(option) => option.id}
                        />
                        {errArray?.usergroup_id !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.usergroup_id}
                            </div>
                        )}
                    </div>
                </div>

                {/* MENU */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <label className='text-sm sm:text-right' htmlFor='inp-menu'>Menu</label>
                    </div>
                    <div className="col-span-2">
                        <Select 
                            type="text" 
                            inputId="inp-menu"
                            name="menu" 
                            className="w-full text-gray text-xs outline-none focus:border-gray-500"
                            onChange={(value) => setData({...data, menu_id: Number(value?.id)})}
                            value={menu?.items?.find(op => {
                                return op.id == data?.menu_id;
                            })}
                            autoComplete='off'
                            options={menu?.items}
                            getOptionLabel={(option) => option?.label}
                            getOptionValue={(option) => option.id}
                        />
                        {errArray?.menu_id !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.menu_id}
                            </div>
                        )}
                    </div>
                </div>

                {/* PERMISSIONS */}
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    <div className="">
                        <div className='text-sm sm:text-left'>Permissions</div>
                    </div>
                    <div className="col-span-2">
                        {permissionsField.map((items, key) =>(
                            <div key={key}>
                                <label 
                                    htmlFor={`cx_${items}`}
                                    className="relative inline-flex items-center cursor-pointer"
                                >
                                    <input 
                                        type="checkbox"
                                        id={`cx_${items}`}
                                        name={`inp_${items}`} 
                                        className="sr-only peer"
                                        value={items}
                                        defaultChecked={data?.permissions && data?.permissions?.includes(items) ? true: false}
                                        onChange={(e)=>{
                                            if(e.target.checked){
                                                setData({...data, permissions: data?.permissions?.concat([e.target.value])});
                                            }else{
                                                setData({...data, permissions: data?.permissions?.filter((el) => {
                                                    return el != items;
                                                })});
                                            }
                                        }}
                                    />
                                    <div 
                                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                                    ></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {items}
                                    </span>
                                </label>
                            </div>
                        ))}
                        {errArray?.permissions !='' && (
                            <div className="text-red-500 text-xs w-full first-letter:uppercase">
                                {errArray?.permissions}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}