export default function UsergroupForm({formData, handleChange, error}){
    return (
        <>
            <div className="grid grid-cols-1">
                <div>
                    <label htmlFor="inp_name" className="block w-full text-gray text-xs mt-2 mb-2">Nama Group</label>
                    <input 
                        type="text" 
                        id="inp_name"
                        name="name" 
                        className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                        placeholder="Nama group..."
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    {error?.name !='' && (
                        <div className="text-red-500 first-letter:uppercase">{error.name}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="inp_level" className="block w-full text-gray text-xs mt-2 mb-2">
                        Level
                    </label>
                    <select 
                        name="level" 
                        id="inp_level"
                        className="w-full text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                        value={formData.level}
                        onChange={handleChange}
                    >
                        <option value={'owner'}>Owner</option>
                        <option value={'organisasi'}>Organisasi</option>
                        <option value={'public'}>Public</option>
                    </select>
                    {error?.level && (
                        <div className="text-red text-xs">{error.level}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="inp_isDefault" className="block w-full text-gray text-xs mt-2 mb-2">
                        Set as Default
                    </label>
                    <div className="inline-block w-1/4">
                        <input 
                            type="radio"
                            value={'true'}
                            name="is_default"
                            id="inp_isDefault" 
                            onChange={handleChange}
                            className="mr-2 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            defaultChecked={formData.is_default == true ? true : false}
                        />
                        Yes
                    </div>
                    <div className="inline-block w-1/4">
                        <input 
                            type="radio"
                            value={'true'}
                            name="is_default" 
                            onChange={handleChange}
                            className="mr-2 text-gray text-xs px-2 py-2 outline-none border focus:border-gray-500"
                            defaultChecked={formData.is_default == false ? true: false}
                        />
                        No
                    </div>
                    {error?.is_default && (
                        <div className="text-red text-xs">{error.is_default}</div>
                    )}
                </div>
            </div>
        </>
    )
}