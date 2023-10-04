import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from '../views/loginpage';
import RouteURL from '../constants/routesConstant';
import HomePage from './../views/ecommerce/homepage';
import HomeLayout from '../views/ecommerce/homeLayout';
import AdminLayout from '../views/admin/adminLayout';
import DashboardComponent from './../components/admin/dashboardComponent';
import { useLocalStorage } from '../hooks/appHooks';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import icon from '../assets/images/logo/sdit.svg';
import AdminSettings from './../components/admin/setting/setting';
import AdminMenu from '../components/admin/menu/appmenu';
import AdminAccessControl from '../components/admin/menu_access/accessControl';
import AdminUser from '../components/admin/user/user';
import AdminUsergroup from '../components/admin/usergroup/usergroup';
import AdminCategory from '../components/admin/category/category';
import AdminProduct from '../components/admin/product/product';
import AdminProfile from '../components/admin/profile/adminProfile';
import AdminEditUser from './../components/admin/user/editUser';
import AdminInvestor from '../components/admin/investor/investor';

export default function AppRouter(){
    const getToken = useLocalStorage('token',null);
    // console.log('ROUTE HOOKS', getToken);
    return(
        <>
            <div>
                <HelmetProvider>
                    <Helmet>
                        <title>PT. Laju Investama</title>
                        <meta charSet='utf-8'/>
                        <link rel="icon" type="image/x-icon" href={icon}></link>
                    </Helmet>
                </HelmetProvider>
                <BrowserRouter>
                    <Routes>

                        <Route element={<HomeLayout token={getToken}/>}>
                            <Route path={RouteURL.HOMEPAGE.PATH} element={<HomePage/>}>
                            </Route>
                        </Route>

                        <Route element={<AdminLayout token={getToken}/>}>
                            <Route path={RouteURL.DASHBOARD.PATH} element={<DashboardComponent/>}>
                            </Route>
                            <Route path={RouteURL.SETTINGS.PATH} element={<AdminSettings/>}></Route>
                            <Route path={RouteURL.MENU.PATH} element={<AdminMenu/>}></Route>
                            <Route path={RouteURL.MENU_ACCESS.PATH} element={<AdminAccessControl/>}></Route>
                            <Route path={RouteURL.USERS.PATH} element={<AdminUser/>}></Route>
                            <Route path={RouteURL.USERS.PATH+'/:id'} element={<AdminEditUser/>}></Route>
                            <Route path={RouteURL.USERGROUP.PATH} element={<AdminUsergroup/>}></Route>
                            <Route path={RouteURL.INVESTOR.PATH} element={<AdminInvestor/>}></Route>
                            <Route path={RouteURL.CATEGORY.PATH} element={<AdminCategory/>}></Route>
                            <Route path={RouteURL.PRODUCT.PATH} element={<AdminProduct/>}></Route>
                            <Route path='dashboard/profile' element={<AdminProfile/>}></Route>
                        </Route>

                        <Route path={RouteURL.LOGIN.PATH} element={<LoginPage/>}/>
                        {/* <Route path={RouteURL.REGISTER.PATH} element={<RegisterPage/>}/> */}
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}