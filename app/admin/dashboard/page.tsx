import Image from "next/image";


export default function Dashboard() {
    return (
       <div className="flex text-black bg-bright-egg-white">
            <div className="px-8 mt-24 flex flex-col gap-y-6 w-full">
                <div className="grid grid-cols-4 gap-2 md:gap-4 xl:gap-6 w-full">
                    <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Total user</span>
                            <span className='font-semibold text-3xl text-black '>12.345</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalusers.svg" alt="users_total" width={60} height={60}/>
                        </div>
                    </div>
                    <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Total orders</span>
                            <span className='font-semibold text-3xl text-black '>67.890</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalorders.svg" alt="orders_total" width={60} height={60}/>
                        </div>
                    </div>
                    <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Total revenue</span>
                            <span className='font-semibold text-xl text-black mt-1'>Rp 9.876.524</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalsales.svg" alt="sales_total" width={60} height={60}/>
                        </div>
                    </div>
                    <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Orders pending</span>
                            <span className='font-semibold text-3xl text-black '>13</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalpending.svg" alt="order-oending" width={60} height={60}/>
                        </div>
                    </div>
                    
                </div>


                <div className='h-80 bg-white rounded-xl flex justify-center items-center p-4'>
                    some cool graph
                </div>

                
                <div className='h-200 bg-white rounded-xl flex p-8 flex-col gap-y-4'>
                    <span className="text-2xl text-gray-600 font-semibold">Sales Details</span>
                    <div className="grid grid-cols-6 gap-x-22 text-sm font-medium bg-gray-100 rounded-xl h-12 w-full p-4">
                        <span>Product name</span>
                        <span className="ml-8">Location</span>
                        <span className="ml-8 text-nowrap">Date - time</span>
                        <span className="ml-20">Amount</span>
                        <span>Total</span>
                        <span className="ml-6">Status</span>
                    </div>
                    <div className="grid grid-cols-6 gap-x-22 text-sm border-b border-gray-100 w-full pb-4 px-4 items-center">
                        <div className="flex items-center gap-x-2 text-nowrap">
                            <Image src="/uploads/puyuhpotong.png" alt="Puyuh potong" width={40} height={40}/>
                            <span>Puyuh potong</span>
                        </div>
                        <span className="w-[15ch] line-clamp-2 ml-8">Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kecamatan Bogor Tengah</span>
                        <span className="text-sm text-nowrap ml-8">01/05/2025 - 12.00 AM</span>
                        <span className="ml-20">20</span>
                        <span>Rp 600.000</span>
                        <span className="bg-[#00B69B] text-white text-center font-semibold rounded-3xl flex items-center justify-center py-1">Delivered</span>
                    </div>
                </div>
            </div>
           
        </div>
    );
}