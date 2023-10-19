import CartForm from "./cartForm";

export default function CartModal({
    handleClick,
    handleSubmit,
    successRes,
    isSubmitted,
    cartProduct,
}){
    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full my-6 mx-auto max-w-lg">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none px-5 py-5 mt-4">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-white">
                            <h3 className="text-2xl text-gray-600 font-semibold">
                                Tambah Keranjang
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={handleClick}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto bg-white">
                            {successRes != '' && 
                                <div
                                    className="absolute bg-red-200 border border-red-300 -top-10 right-5 whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none"
                                >{successRes}</div>
                            }
                            <CartForm
                                product={cartProduct}
                            />                        
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b bg-white">
                            <button
                                className="text-red-500 rounded shadow hover:shadow-lg hover:bg-gray-200 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleClick}
                            >
                                Close
                            </button>
                            <button
                                className="bg-teal-500 text-white active:bg-teal-600 hover:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleSubmit}
                            >
                                {isSubmitted ? 'HARAP TUNGGU...' :'SELESAI'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>        
        </>
    );
}