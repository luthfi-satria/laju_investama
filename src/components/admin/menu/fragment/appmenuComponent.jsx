import { AxiosRequest } from "../../../../hooks/axiosRequest";
import "../../../../assets/css/appmenuTreeComponent.css";
import AppTree from "./appTree";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppTreeModal from "./appTreeModal";
import axios from "axios";
import ShowSweetAlert from './../../../../helpers/showAlert';

export default function AppmenuComponent({
    token
}){
    const config = {
        method: 'get',
        url: import.meta.env.VITE_APIURL+'/api/appmenu',
        headers: {
            Authorization: 'Bearer '+ token
        },
        params: {
            page : 1,
            limit: 100,
        }
    };

    const defaultData = useMemo(() => ({
        id: 1,
        label:'',
        api_url: '',
        sequence: 1,
        parent_id:null,
        level:0,
        icon: '',
        is_active: true,
    }),[])

    const [apiRes, apiError] = AxiosRequest(config);
    const [showModal, setShowModal] = useState(false);
    const [assignData, setAssignData] = useState(defaultData);
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        if(apiRes && apiRes?.data?.items){
            setMenu(apiRes?.data?.items);
        }
    },[apiRes]);

    useEffect(()=>{},[assignData]);
    
    function menuTreeIteration(items, parent = null){
        const result = [];
        for(const a of items){
            if(a.parent_id == parent){
                result.push(<AppTree key={'menu_'+a.name} menuItem={a} handleClick={() => modalTrigger(a)}/>)
                const child = menuTreeIteration(items, a.id);
                if(child != ''){
                    result.push(<ul key={'child_'+a.name}>{child}</ul>);
                }
            }
        }
        return result;
    } 

    const axiosRequest = useCallback((method, path, config={}, headers={})=>{
        return axios({
            method: method,
            url: import.meta.env.VITE_APIURL+'/'+path,
            headers: {
                Authorization: 'Bearer '+token,
                ...headers
            },
            ...config,
        });
    }, [token]);

    const errResponseHandler = useCallback((err) => {
        let errTxt = 'Input form tidak valid';
        if(err.code == 'ERR_NETWORK'){
            errTxt = err.message;
        }
        ShowSweetAlert({
            icon: 'warning',
            title: 'Request Error',
            text: errTxt
        });
    },[]);

    const modalTrigger = (data) => {
        setShowModal(true);
        setAssignData({
            ...assignData, 
            id: data?.id,
            label: data?.label,
            api_url: data?.api_url,
            sequence: String(data?.sequence),
            parent_id: data?.parent_id,
            level:data?.level,
            icon: data?.icon,
            is_active: data?.is_active,            
        });
    }
    return(
        <>
            {apiError.error == true && (
                <div className="absolute right-0 px-4 py-4 bg-red-500 text-white">{apiError.message}</div>
            )}
            <div className="grid grid-cols-1 text-white font-bold">
                <div className="mb-10 border-white border-l-2">
                    <div className="w-full px-4 py-2 text-gray-600 rounded-e-md bg-gradient-to-br from-slate-100 to-teal-400">
                      DASHBOARD
                    </div>
                    <ul className="tree">
                        {menu && menuTreeIteration(menu)}
                    </ul>
                </div>
            </div>
            {showModal && (
                <>
                    <AppTreeModal 
                        title="Edit Menu"
                        axiosRequest={axiosRequest}
                        errResponseHandler={errResponseHandler}
                        assignData={assignData}
                        setAssignData={setAssignData}
                        menu={menu}
                        setMenu={setMenu} 
                        showModal={()=>setShowModal(false)}
                    />
                </>
            )}
        </>
    )
}