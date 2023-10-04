import NavbarComponent from "../../components/admin/navbarComponents";
import NavbarLogo from '../../assets/images/logo/sdit.svg';
import AsideComponent from "../../components/admin/asideComponent";
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";
import RouteURL from "../../constants/routesConstant";
import { ValidateToken } from "../../hooks/validateToken";
import { useEffect } from "react";
import { FetchAdminMenu } from "../../hooks/adminMenuHooks";

export default function AdminLayout({token}){
    const validToken = ValidateToken(token[0]);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!validToken[0] && typeof validToken[0] != 'undefined'){
            navigate(RouteURL.LOGIN.PATH, {replace: true})
        }
    });

    const adminMenu = FetchAdminMenu(token[0]);

    const AppMenu = adminMenu[0];
    return (
    <>
        <div id="admin">
            <HelmetProvider>
                <Helmet>
                    <title>{RouteURL.DASHBOARD.HELMET.title}</title>
                </Helmet>
            </HelmetProvider>
            <AsideComponent AppMenu={AppMenu}/>
            <div className="relative bg-gradient-to-br bg-teal-600">
                <NavbarComponent
                    navbarImg={NavbarLogo}
                    appTitle={'Laju Investama'}
                    appMenu={AppMenu}
                />
                <div className="relative lg:pt-24 pl-2 pb-32 pt-12">
                    <div className="lg:ml-64 sm:ml-2">
                        <Outlet context={token[0]}/>
                    </div>
                </div>
            </div>
        </div>
    </> 
    )
};