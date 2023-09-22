import { Helmet } from "react-helmet-async";
import SditLogo from '../assets/images/logo/sdit.svg'

export default function MetaHelmet({
    title
}){
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <link rel="shortcut icon" href={SditLogo}/>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"/>
            </Helmet>
        </>
    );
}