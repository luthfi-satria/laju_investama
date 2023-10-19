import { AxiosRequest } from "../../../../hooks/axiosRequest";
import "../../../../assets/css/appmenuTreeComponent.css";
import AppTree from "./appTree";
import { useState } from "react";
import AppTreeModal from "./appTreeModal";

export default function AppmenuComponent({
    token
}){
    const config = {
        method: 'get',
        url: import.meta.env.VITE_APIURL+'/api/appmenu',
        headers: {
            Authorization: 'Bearer '+ token
        },
        data: {
            page : 1,
            limit: 10,
        }
    };

    const [apiRes, apiError] = AxiosRequest(config);
    const [showModal, setShowModal] = useState(false);
    const [assignData, setAssignData] = useState(false);
    const menu = apiRes && apiRes && Object.keys(apiRes.data).length > 0 ? apiRes.data.items : false;
 
    function menuTreeIteration(items, parent = null){
        const result = [];
        for(const a of items){
            if(a.parent_id == parent){
                result.push(<AppTree key={a.name} menuItem={a} handleClick={() => modalTrigger(a)}/>)
                const child = menuTreeIteration(items, a.id);
                if(child != ''){
                    result.push(<ul key={'child_'+a.name}>{child}</ul>);
                }
            }
        }
        return result;
    } 

    const modalTrigger = (data) => {
        setShowModal(true);
        setAssignData(data);
    }
    return(
        <>
            {apiError.error == true && (
                <div className="absolute right-0 px-4 py-4 bg-red-500 text-white">{apiError.message}</div>
            )}
            <div className="grid grid-cols-1 text-white">
                <div className="mb-10 border-white border-l-2">
                    <ul className="tree">
                        {menu && menuTreeIteration(menu)}
                    </ul>
                </div>
            </div>
            {showModal && (
                <>
                    <AppTreeModal 
                        title="Edit Menu"
                        assignData={assignData} 
                        handleClick={()=>setShowModal(false)}
                        token={token}
                    />
                </>
            )}
        </>
    )
}