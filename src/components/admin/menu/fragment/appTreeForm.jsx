export default function AppTreeForm({
    data, 
    setData, 
    errArray
}){
    return(
        <>
        <form id="createMenu" encType="multipart/form-data">
            <div className="mb-2">
                <label htmlFor="label" className="block text-sm font-medium leading-6 text-gray-900">
                    Label name
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input 
                        type="text" 
                        id="label"
                        name="label" 
                        value={data?.label}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-600 
                        ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        onChange={(e) => setData({...data, label: e.target.value})}/>
                </div>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray?.label}</div>
                )}
            </div>
            <div className="mb-2">
                <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                    fontawesome icon
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input 
                        type="text" 
                        id="icon"
                        name="icon" 
                        value={data?.icon}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        onChange={(e) => setData({...data, icon: e.target.value})}
                    />
                </div>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.api_url}</div>
                )}
            </div>
            <div className="mb-2">
                <label htmlFor="level" className="block text-sm font-medium leading-6 text-gray-900">
                    Menu Level
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input 
                        type="number" 
                        id="level"
                        name="level" 
                        value={data?.level}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-2 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        min={0}
                        onChange={(e) => setData({...data, level: e.target.value})}
                    />
                </div>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.api_url}</div>
                )}
            </div>
            <div className="mb-2">
                <label htmlFor="sequence" className="block text-sm font-medium leading-6 text-gray-900">
                    Sequence
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input 
                        type="number" 
                        id="sequence"
                        name="sequence" 
                        value={data.sequence}
                        min={1}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        onChange={(e) => setData({...data, sequence: String(e.target.value)})}/>
                </div>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.sequence}</div>
                )}
            </div>
            <div className="mb-2">
                <div className="block text-sm font-medium leading-6 text-gray-900">
                    Set visibility
                </div>
                <label 
                    className='relative mt-2 inline-flex items-center cursor-pointer' 
                    htmlFor='inp-status'
                >
                    <input 
                        type="checkbox" 
                        id="inp-status"
                        name="status" 
                        className="sr-only peer"
                        value={''}
                        defaultChecked={data?.is_active}
                        onChange={(e) => setData({...data, is_active: (e.target.checked ? true: false)})}
                        autoComplete="off"
                    />
                    <div 
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Visible
                    </span>
                </label>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.is_active}</div>
                )}
            </div>
        </form>
        </>
    )
}