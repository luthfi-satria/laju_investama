export default function AppTreeForm({data, handleChange, errArray}){
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
                        value={data.label}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-600 
                        ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        onChange={handleChange}/>
                </div>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.label}</div>
                )}
            </div>
            <div className="mb-2">
                <label htmlFor="link" className="block text-sm font-medium leading-6 text-gray-900">
                    Link url
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <input 
                        type="text" 
                        id="link"
                        name="api_url" 
                        value={data.api_url}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        onChange={handleChange}/>
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
                        type="text" 
                        id="level"
                        name="level" 
                        value={data.level}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-teal-400 sm:text-sm sm:leading-6"
                        disabled/>
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
                        onChange={handleChange}/>
                </div>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.sequence}</div>
                )}
            </div>
            <div className="mb-2">
                Set visibility
                <label htmlFor="is_active1" className="inline-block ml-10 mt-2 text-sm font-medium leading-6 text-gray-900">
                    <div className="relative mt-2 rounded-md">
                        <input 
                            type="radio" 
                            id="is_active1"
                            name="is_active" 
                            value="true"
                            defaultChecked={data.is_active === true}
                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                            onChange={handleChange}
                        /> Yes
                    </div>
                </label>
                <label htmlFor="is_active2" className="inline-block ml-10 mt-2 text-sm font-medium leading-6 text-gray-900">
                    <div className="relative mt-2 rounded-md">
                        <input 
                            type="radio" 
                            id="is_active2"
                            name="is_active" 
                            value="false"
                            defaultChecked={data.is_active === false}
                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                            onChange={handleChange}
                        /> No
                    </div>
                </label>
                {errArray && (
                    <div className="text-xs text-red-600">{errArray.is_active}</div>
                )}
            </div>
        </form>
        </>
    )
}