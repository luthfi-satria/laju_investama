export default function AppTree({
    menuItem, 
    handleClick,
    customClass='text-white text-sm border-2 border-white hover:bg-teal-700'
}){
    return(
        <>
            <li className="w-full pt-2 pl-2">
                <a href="#" onClick={handleClick} className={customClass}>
                    <span className="ml-4 mr-4">{menuItem.label}</span>
                </a>
            </li>
        </>
    )
}