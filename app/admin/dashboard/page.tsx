'use client'

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState } from 'react'; // if not already imported


const OrderMap = dynamic(() => import('@/app/_components/OrderMap'), {
  ssr: false
});

const orders = [
  // 3 orders on 2025-05-01
  { id: '1', address: 'Jl. Raya Pajajaran No.1, Bogor Tengah', lat: -6.595, lng: 106.816, customerName: '', products: [], status: 'Completed', date: '2025-05-01' },
  { id: '2', address: 'Jl. Suryakencana No.10, Bogor Tengah', lat: -6.613, lng: 106.799, customerName: '', products: [], status: 'Processing', date: '2025-05-01' },
  { id: '3', address: 'Jl. Pandu Raya No.5, Bogor Utara', lat: -6.570, lng: 106.806, customerName: '', products: [], status: 'Completed', date: '2025-05-01' },
  // 1 order on 2025-05-04
  { id: '4', address: 'Jl. Raya Cilebut No.8, Tanah Sareal', lat: -6.573, lng: 106.782, customerName: '', products: [], status: 'Processing', date: '2025-05-04' },
  // 4 orders on 2025-05-07
  { id: '5', address: 'Jl. Raya Tajur No.20, Bogor Timur', lat: -6.635, lng: 106.830, customerName: '', products: [], status: 'Completed', date: '2025-05-07' },
  { id: '6', address: 'Jl. Raya Sukasari No.15, Bogor Timur', lat: -6.617, lng: 106.822, customerName: '', products: [], status: 'Processing', date: '2025-05-07' },
  { id: '7', address: 'Jl. Raya Ciomas No.3, Ciomas', lat: -6.646, lng: 106.770, customerName: '', products: [], status: 'Completed', date: '2025-05-07' },
  { id: '8', address: 'Jl. Raya Laladon No.7, Dramaga', lat: -6.570, lng: 106.726, customerName: '', products: [], status: 'Processing', date: '2025-05-07' },
  // 2 orders on 2025-05-10
  { id: '9', address: 'Jl. Raya Cibinong No.12, Cibinong', lat: -6.485, lng: 106.853, customerName: '', products: [], status: 'Completed', date: '2025-05-10' },
  { id: '10', address: 'Jl. Raya Parung No.2, Parung', lat: -6.441, lng: 106.741, customerName: '', products: [], status: 'Processing', date: '2025-05-10' },
  // 5 orders on 2025-05-15
  { id: '11', address: 'Jl. Raya Batutulis No.1, Bogor Selatan', lat: -6.629, lng: 106.803, customerName: '', products: [], status: 'Completed', date: '2025-05-15' },
  { id: '12', address: 'Jl. Pahlawan No.9, Bogor Selatan', lat: -6.637, lng: 106.803, customerName: '', products: [], status: 'Processing', date: '2025-05-15' },
  { id: '13', address: 'Jl. Empang No.3, Bogor Selatan', lat: -6.626, lng: 106.799, customerName: '', products: [], status: 'Completed', date: '2025-05-15' },
  { id: '14', address: 'Jl. Cipaku Indah No.5, Bogor Selatan', lat: -6.646, lng: 106.803, customerName: '', products: [], status: 'Processing', date: '2025-05-15' },
  { id: '15', address: 'Jl. Raya Mulyaharja No.2, Bogor Selatan', lat: -6.661, lng: 106.803, customerName: '', products: [], status: 'Completed', date: '2025-05-15' },
  // 1 order on 2025-05-20
  { id: '16', address: 'Jl. Raya Cikaret No.10, Cibinong', lat: -6.509, lng: 106.836, customerName: '', products: [], status: 'Processing', date: '2025-05-20' },
  // 3 orders on 2025-05-25
  { id: '17', address: 'Jl. Raya Sholeh Iskandar No.1, Tanah Sareal', lat: -6.573, lng: 106.782, customerName: '', products: [], status: 'Completed', date: '2025-05-25' },
  { id: '18', address: 'Jl. Raya Cemplang No.8, Bogor Barat', lat: -6.561, lng: 106.741, customerName: '', products: [], status: 'Processing', date: '2025-05-25' },
  { id: '19', address: 'Jl. Raya Gunung Batu No.5, Bogor Barat', lat: -6.573, lng: 106.785, customerName: '', products: [], status: 'Completed', date: '2025-05-25' },
  // 2 orders on 2025-06-01
  { id: '20', address: 'Jl. Raya Ciawi No.3, Ciawi', lat: -6.693, lng: 106.900, customerName: '', products: [], status: 'Processing', date: '2025-06-01' },
  { id: '21', address: 'Jl. Raya Gadog No.2, Ciawi', lat: -6.693, lng: 106.900, customerName: '', products: [], status: 'Completed', date: '2025-06-01' },
  // 4 orders on 2025-06-10
  { id: '22', address: 'Jl. Raya Sukaraja No.7, Sukaraja', lat: -6.532, lng: 106.849, customerName: '', products: [], status: 'Processing', date: '2025-06-10' },
  { id: '23', address: 'Jl. Raya Cileungsi No.4, Cileungsi', lat: -6.412, lng: 106.959, customerName: '', products: [], status: 'Completed', date: '2025-06-10' },
  { id: '24', address: 'Jl. Raya Bojonggede No.6, Bojonggede', lat: -6.496, lng: 106.821, customerName: '', products: [], status: 'Processing', date: '2025-06-10' },
  { id: '25', address: 'Jl. Raya Kemang No.9, Kemang', lat: -6.496, lng: 106.786, customerName: '', products: [], status: 'Completed', date: '2025-06-10' },
];

export default function Dashboard() {
    const [statusFilter, setStatusFilter] = useState('all');
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


                
                <div className="h-120 bg-white rounded-xl p-4 relative">
                    <div className="absolute bottom-5 left-5 z-50 shadow-2xl">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-48 bg-white"
                        >
                            <option value="all">Filter order (All)</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="w-full h-full relative z-0">
                        <OrderMap
                            orders={
                                statusFilter === 'all'
                                    ? orders
                                    : orders.filter((order) => order.status === statusFilter)
                            }
                        />
                    </div>
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