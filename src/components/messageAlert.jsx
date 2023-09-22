const fixedClass = 'max-w-sm w-full shadow-lg px-4 py-3 rounded relative border-l-4 text-white bg-red-400'
export default function MessageAlert({
    alertMessage = 'Alert Message',
    customClass = '',
    handleFunction
}){ 
    return(
        <>
            <div className="fixed inset-x-0 top-0 flex items-end justify-right px-4 py-6 justify-end">
                <div className={fixedClass+' '+customClass}>
                    <div className="p-2">
                        <div className="flex items-start">
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm leading-5 font-medium">
                                    {alertMessage}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button className="inline-flex text-white transition ease-in-out duration-150"
                                onClick={handleFunction}
                                >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}