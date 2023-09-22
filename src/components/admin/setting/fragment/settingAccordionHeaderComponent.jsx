import { useState } from "react";
import { TECollapse } from "tw-elements-react";
import SettingFormGlobal from "./settingFormGlobal";
import SettingFormScheduller from "./settingFormScheduller";
import SettingFormPagination from './settingFormPagination';

export default function SettingAccordioinHeaderComponent({
    id,
    headTitle,
    showElement,
    formData,
    token,
}){
    const [activeElement, setActiveElement] = useState(showElement);

    const handleClick = (value) => {
        if (value == activeElement) {
            setActiveElement('');
        } else {
            setActiveElement(value);
        }
    };

    const activeClass = (element) => {
        let classStyle = ' text-white group relative flex w-full items-center rounded-none border-0 px-5 py-4 text-left text-base transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white';
        if(element == activeElement){
            classStyle += ' [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]';
        }
        return classStyle;
    }

    const handleFormData = (formData) => {
        switch(formData.ref_id){
            case 'GLOBAL' : 
                return <SettingFormGlobal formData={formData} token={token}/>;
            case 'SCHEDULLER' :
                return <SettingFormScheduller formData={formData} token={token}/>
            default :
                return <SettingFormPagination formData={formData} token={token}/>
        }
    }

    return(
        <>
            <h2 className="mb-0">
                <button
                    className={activeClass(activeElement)}
                    type="button"
                    onClick={() => handleClick(id)}
                    aria-expanded="true"
                    aria-controls="collapseOne"
                >
                    {headTitle}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute right-4 h-6 w-6"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </button>
            </h2>
            <TECollapse
                show={activeElement === id}
                className="!mt-0 !rounded-b-none !shadow-none"
            >
                <div className="px-5 py-4">
                    {handleFormData(formData)}  
                </div>
            </TECollapse>
        </>
    );
}