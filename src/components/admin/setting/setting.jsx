import { Helmet, HelmetProvider } from "react-helmet-async";
import RouteURL from "../../../constants/routesConstant";
import { useOutletContext } from 'react-router-dom';
import AdminSettingComponent from './fragment/settingComponent';

export default function AdminSettings(){
    const token = useOutletContext();
    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.SETTINGS.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-sm text-white font-semibold">ADMIN SETTINGS</h3>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    <AdminSettingComponent token={token}/>
                </div>
            </div>
        </>
    )
}