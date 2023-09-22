import { Helmet, HelmetProvider } from "react-helmet-async";
import RouteURL from "../../../constants/routesConstant";
import { useOutletContext } from 'react-router-dom';
import UsergroupComponent from "./fragment/usergroupComponent";

export default function AdminUsergroup(){
    const token = useOutletContext();
    return(
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.USERGROUP.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="uppercase text-blueGray-400 mb-1 text-sm text-white font-semibold">KELOLA GRUP USER</h3>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    <UsergroupComponent token={token}/>
                </div>
            </div>
        </>
    )
}