import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function AppTree({
    menuItem, 
    handleClick,
}){
    const customClass='w-full flex items-start justify-between px-4 py-2 text-gray-600 rounded-md bg-gradient-to-br from-slate-100 to-teal-400';
    
    return(
        <>
            <li className="w-full pt-2 pl-2">
                <div className={customClass}>
                    <div>
                        {menuItem.label}
                    </div>
                    <div>
                        <Link to="#" 
                            onClick={handleClick} 
                            title="Edit menu"
                            className="hover:text-white mr-5">
                            <FontAwesomeIcon icon={'edit'}/>
                        </Link>
                    </div>
                </div>
            </li>
        </>
    )
}