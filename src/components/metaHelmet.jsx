import { Helmet } from "react-helmet-async";
import logo from '../assets/images/logo/favico.png'

export default function MetaHelmet({
    title
}){
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <link rel="shortcut icon" href={logo}/>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"/>
            </Helmet>
        </>
    );
}