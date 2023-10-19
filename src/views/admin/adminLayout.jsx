import NavbarComponent from "../../components/admin/navbarComponents";
import NavbarLogo from '../../assets/images/logo/sdit.svg';
import AsideComponent from "../../components/admin/asideComponent";
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { FetchAdminMenu } from "../../hooks/adminMenuHooks";
import AdminRouter from "../../routes/adminRouter";

export default function AdminLayout({token, profile, RouteURL, setProfile}){
    const navigate = useNavigate();

    useEffect(()=>{
        if(!token && !profile){
            navigate(RouteURL.LOGIN.PATH, {replace: true})
        }
    });

    const adminMenu = FetchAdminMenu(token);

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
                        {/* <Outlet context={token}/> */}
                        <AdminRouter
                            RouteURL={RouteURL}
                            profile={profile}
                            setProfile={setProfile}
                            token={token}
                        />
                    </div>
                </div>
            </div>
        </div>
    </> 
    )
};