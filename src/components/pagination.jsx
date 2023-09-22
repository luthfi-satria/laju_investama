import {useMemo} from 'react';

const Pagination = ({
    loading, 
    limit, 
    setPerPage, 
    page, 
    setPage, 
    maxData
}) => {
  const pageNum = useMemo(() => Math.ceil(maxData / limit), [maxData, limit])
  const pageList = useMemo(() => {
    const result= [];
    if (pageNum === 0) return result
    const normalizedPage = Math.min(pageNum, Math.max(0, page))
    if (pageNum < 8)
      for (let i = 1; i <= pageNum; i++) {
        result.push(i)
      }
    else {
      if (normalizedPage > 4) result.push(1, undefined, Math.min(normalizedPage, pageNum - 3) - 1)
      else result.push(1, 2, 3, 4)
      if (normalizedPage + 3 < pageNum) {
        if (normalizedPage > 4) result.push(normalizedPage)
        result.push(Math.max(normalizedPage, 4) + 1, undefined, pageNum)
      } else result.push(pageNum - 3, pageNum - 2, pageNum - 1, pageNum)
    }
    return result
  }, [pageNum, page]);

  return (
    <div className='block sm:flex items-center justify-between px-4 py-3 sm:px-6'>
      <div className='mb-4 w-md-auto w-100 align-items-center'>
        <div className="block sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className='position-relative mr-2'>
                <select
                    id="opt_pagination"
                    className='block sm:w-full rounded-md border-0 px-1.5 py-1 text-gray-500 sm:max-w-xs sm:text-sm sm:leading-6'
                    autoComplete='off'
                    value={limit}
                    onChange={setPerPage}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div className=''>
                <p className='text-sm'>
                    Menampilkan 
                    <span className='px-2'>
                        {(page - 1) * limit + 1}
                    </span>
                    /
                    <span className='px-2'>
                        {Math.min(maxData, (page) * limit + 1)}{' '}
                    </span>
                    dari
                    <span className='px-2'>{maxData} entri</span>
                </p>
            </div>
        </div>
      </div>
      {pageList.length > 0 ? (
        <div className='block relative sm:flex sm:flex-1 clear-both h-16'>
            <nav className="absolute right-2 bottom-5 isolate inline-flex rounded-md shadow-sm" aria-label="Pagination">
                <button 
                    disabled={page == 1 ? true: false}
                    onClick={() => setPage(1)}
                    className={`${page == 1 ? 'opacity-50 cursor-not-allowed': ''} relative inline-flex items-center rounded-l-md px-2 py-2 text-white ring-1 ring-inset ring-gray-300 hover:bg-teal-500 focus:z-20 focus:outline-offset-0 page-item previous`}
                    >
                        <span className="sr-only">First</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                        </svg>

                </button>
                <button 
                    disabled={page == 1 ? true: false}
                    onClick={() => setPage(page - 1)}
                    className={`${page == 1 ? 'opacity-50 cursor-not-allowed': ''} relative inline-flex items-center px-2 py-2 text-white ring-1 ring-inset ring-gray-300 hover:bg-teal-500 focus:z-20 focus:outline-offset-0 page-item previous`}
                    >
                        <span className="sr-only">Previous</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>

                </button>
                {/* pageNumber */}
                    {pageList.map((x, i) =>
                        x === undefined ? (
                        <button 
                            disabled={true} 
                            className='page-item disabled cursor-not-allowed' 
                            key={`${i}-dot`}
                        >
                            ...
                        </button>
                        ) : (
                            <button key={x} 
                                onClick={() => setPage(x)}
                                disabled={page === x ? true : false}
                                className={`page-item ${page === x ? 'bg-teal-500 cursor-not-allowed' : ''} relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-teal-500 focus:z-20 focus:outline-offset-0`}
                            >
                                {x}
                            </button>
                        )
                    )}
                {/* endPageNumber */}
                <button 
                    disabled={page === pageNum ? true : false}
                    onClick={()=> setPage(page + 1)}
                    className={`${page === pageNum ? 'opacity-50 cursor-not-allowed' : ''} relative inline-flex items-center px-2 py-2 text-white ring-1 ring-inset ring-gray-300 hover:bg-teal-500 focus:z-20 focus:outline-offset-0`}
                >
                    <span className="sr-only">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                <button 
                    disabled={page === Math.ceil(maxData/limit) ? true : false}
                    onClick={()=> setPage(Math.ceil(maxData/limit))}
                    className={`${page === Math.ceil(maxData/limit) ? 'opacity-50 cursor-not-allowed' : ''} relative inline-flex items-center rounded-r-md px-2 py-2 text-white ring-1 ring-inset ring-gray-300 hover:bg-teal-500 focus:z-20 focus:outline-offset-0`}
                >
                    <span className="sr-only">Last</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                    </svg>

                </button>
            </nav>
        </div>
      ) : null}
    </div>
  )
}

export default Pagination
