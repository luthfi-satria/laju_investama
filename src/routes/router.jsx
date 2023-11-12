import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from '../views/loginpage';
import HomePage from './../views/ecommerce/homepage';
import HomeLayout from '../views/ecommerce/homeLayout';
import { useLocalStorage } from '../hooks/appHooks';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import icon from '../assets/images/logo/sdit.svg';
import { ValidateToken } from '../hooks/validateToken';
import RouteURL from '../constants/routesConstant';
import AdminLayout from '../views/admin/adminLayout';
import MyCart from '../components/ecommerce/cart/myCart';
import MyOrderComponent from '../components/ecommerce/order/orderComponent';
import PembayaranComponent from '../components/ecommerce/pembayaran/pembayaran';
import PengaturanProfile from '../components/ecommerce/pengaturan/pengaturan';
import RegistrationPage from '../views/registration';
import WishListComponent from '../components/ecommerce/wish/wishlist';

export default function AppRouter(){
    const [token, setToken] = useLocalStorage('token',null);
    const [rootProfile, setrootProfile] = ValidateToken(token);
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
                        <Route path={RouteURL.HOMEPAGE.PATH} element={
                            <HomeLayout 
                            token={token} 
                            profile={rootProfile}
                            RouteURL={RouteURL}
                        />}>
                            <Route path={RouteURL.HOMEPAGE.PATH} element={<HomePage/>}/>
                            <Route path={RouteURL.CART.PATH} element={<MyCart/>}/>
                            <Route path={RouteURL.WISHLIST.PATH} element={<WishListComponent/>}/>
                            <Route path={RouteURL.ORDER.PATH+'/*'} element={<MyOrderComponent/>}/>
                            <Route path={'pembayaran/*'} element={<PembayaranComponent/>}/>
                            <Route path={RouteURL.PENGATURAN.PATH} element={<PengaturanProfile/>}/>
                        </Route>
                        <Route path='/dashboard/*' element={
                            <AdminLayout 
                                profile={rootProfile} 
                                token={token} 
                                RouteURL={RouteURL}
                                setProfile={setrootProfile}
                            />
                        }/>
                        <Route path={RouteURL.LOGIN.PATH} element={
                            <LoginPage 
                                token={token} 
                                setToken={setToken} 
                                RouteURL={RouteURL}
                            />}
                        />
                        <Route path={RouteURL.REGISTER.PATH} element={
                            <RegistrationPage/>
                        } />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}