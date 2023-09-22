import ProductCard from "./productCard";

export default function ProductList(){
    return(
        <>
            <div id="ProductList">
                <div className="relative overflow-hidden mb-8">
                    <div className="overflow-hidden border-t border-l border-r border-gray-300 bg-white p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            <ProductCard/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}