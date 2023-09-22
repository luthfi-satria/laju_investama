import { useOutlet } from 'react-router-dom';
import CommerceNavbar from "../../components/ecommerce/navbar/navbar";

export default function HomeLayout(){
    const outlet = useOutlet();
    return(
        <>
            <div id="ecommerce">
                <CommerceNavbar/>
                {outlet}
            </div>
        </>
    );
}