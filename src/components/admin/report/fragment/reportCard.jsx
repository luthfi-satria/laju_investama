import { Link, Route, Routes, useLocation } from "react-router-dom";
import ReportProdukTerjual from "./reportProdukTerjual";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportKredit from "./reportKredit";
import ReportInvestasi from "./reportInvestasi";
import ReportHome from "./reportHome";

export default function ReportCard({
    axiosRequest,
    errorHandler,
}){
    const location = useLocation().pathname.split('/');
    const tabMenu = [
        {
            title: (<FontAwesomeIcon icon={'home'}/>),
            url: ''
        },
        {
            title: 'produk terjual',
            url: 'produk'
        },
        {
            title: 'kredit',
            url: 'kredit',
        },
        {
            title: 'Omset',
            url: 'Omset'
        }
    ]
    return (
        <>
            <div className="grid">
                <div
                    className="px-2 py-2 rounded-md mt-10 min-h-screen overflow-auto"
                >
                    <div>
                        {tabMenu.map((items, key) => (
                            <Link key={key}
                                to={items.url}
                                className={`inline-block px-4 py-2 text-white capitalize font-semibold border-l border-t ${key == tabMenu.length - 1 ? 'border-r rounded-tr-md' :''} border-l-white border-t-white border-r-white ${location[3] == items.url ? 'bg-teal-700' : 'hover:bg-teal-700'}`}
                            >
                                {items.title}
                            </Link>
                        ))}
                    </div>
                    <div className="relative w-full border border-white px-4 py-4 rounded-r-lg">
                        <Routes>
                            <Route path="" element={<ReportHome
                                axiosRequest={axiosRequest}
                                errorHandler={errorHandler}
                            />} />
                            <Route path="produk" element={<ReportProdukTerjual
                                axiosRequest={axiosRequest}
                                errorHandler={errorHandler}
                            />} />
                            <Route path="kredit" element={<ReportKredit
                                axiosRequest={axiosRequest}
                                errorHandler={errorHandler}
                            />} />
                            <Route path="omset" element={<ReportInvestasi
                                axiosRequest={axiosRequest}
                                errorHandler={errorHandler}
                            />} />
                        </Routes>
                    </div>
                </div>
            </div>        
        </>
    );
}