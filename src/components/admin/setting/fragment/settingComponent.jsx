import { AxiosRequest } from "../../../../hooks/axiosRequest";
import SettingAccordioinHeaderComponent from "./settingAccordionHeaderComponent";

export default function AdminSettingComponent({token}){

    const config = {
        method: 'get',
        url: import.meta.env.VITE_APIURL+'/api/configuration',
        headers: {
            Authorization: 'Bearer '+token
        }
    };

    const [apiRes, apiError] = AxiosRequest(config);
    const settings = apiRes && apiRes && Object.keys(apiRes.data).length > 0 ? apiRes.data.items : false;
    return (
        <>
            <div id="accordionExample">
                <div className="rounded-none border border-l-0 border-r-0 border-t-0 text-white border-neutral-200 dark:border-neutral-600 dark:bg-neutral-800">
                    {settings ? settings.map((items, keyItem)=> (
                            <SettingAccordioinHeaderComponent
                                key={items.id}
                                id={'element'+keyItem}
                                headTitle={items.name}
                                showElement={keyItem == 0 ? 'element'+keyItem : ''}
                                formData={items}
                                token={token}
                            />
                    )) : null}
                </div>
            </div>
        </>
    )
}