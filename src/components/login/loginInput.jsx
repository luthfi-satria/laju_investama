const fixedInputClass="w-full -ml-10 pl-2 pr-3 py-2 text-teal-600 border-b border-gray-200 outline-none focus:border-indigo-500"

export default function LoginInput({
    handleChange,
    value,
    labelText,
    labelFor,
    id,
    name,
    type,
    isRequired=false,
    placeholder,
    customClass,
    errorMessage
}){
    return(
      <div className="flex -mx-3 text-left">
        <div className="w-full px-3 mb-3">
          <label htmlFor={labelFor} className="text-xs font-semibold px-1 capitalize">
            {labelText}
          </label>
          <div className="flex">
            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
            <input
              onChange={handleChange}
              value={value}
              id={id}
              name={name}
              type={type}
              required={isRequired}
              className={fixedInputClass+' '+customClass}
              placeholder={placeholder}
            />
          </div>
            <div className="flex text-red-400 text-xs font-semibold px-1">{errorMessage}</div>
        </div>
      </div>
    )
}