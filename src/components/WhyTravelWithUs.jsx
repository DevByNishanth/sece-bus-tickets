import React from 'react'
import safebooking from '../assets/safe-booking1.png'
import transparentPricing from '../assets/transparent-pricing1.png'
import seatBooking from '../assets/chooseSeat2.png'
import reservation from '../assets/reservation1.png'
const WhyTravelWithUs = () => {
    return (
        <>
            <div className="main-container mt-4 bg-[#f1f1e7] py-7 px-6 ">
                <div className="bg-white p-12 rounded-3xl">
                    <div className="grid grid-cols-3 gap-4 px-4">
                        <div className="box relative border-gray-400 p-2 h-[260px]">
                            <div className="content">
                                <h1 className="text-5xl font-bold">Why <br /> travel <br></br> with us</h1>
                                <h1 className='text-md font-medium mt-4'>Enjoy safe, comfortable, and hassle-free journeys with easy booking and reliable service every step of the way.</h1>
                            </div>
                        </div>
                        <div className="box  relative">
                            <img src={safebooking} className="rounded-xl" />
                            <div className="tint absolute rounded-xl inset-0 bg-linear-to-b  from-black/80  via-black/30 to-black/90   "></div>
                            <div className="heading absolute top-5 left-3">
                                <h1 className="text-white text-xl font-semibold">Safe and Secured booking</h1>
                            </div>
                            <div className="descripotion absolute bottom-5 left-3">
                                <h1 className="text-white text-sm ">Secure payments and protected personal information for worry-free booking.</h1>
                            </div>
                        </div>
                        <div className="box  relative">
                            <img src={transparentPricing} className="rounded-xl" />
                            <div className="tint absolute rounded-xl inset-0 bg-linear-to-b  from-black/80  via-black/30 to-black/90   "></div>
                            <div className="heading absolute top-5 left-3">
                                <h1 className="text-white text-xl font-semibold">Transparent pricing</h1>
                            </div>
                            <div className="descripotion absolute bottom-5 left-3">
                                <h1 className="text-white text-sm font-medium">No hidden charges or surprises—just clear pricing you can trust.</h1>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 px-4 mt-4">
                        <div className="box col-span-8 h-[260px] relative">
                            <img src={seatBooking} className="rounded-xl h-full w-full object-cover" />
                            <div className="tint absolute rounded-xl inset-0 bg-linear-to-b  from-black/80  via-black/30 to-black/90   "></div>
                            <div className="heading absolute top-5 left-3">
                                <h1 className="text-white text-xl font-semibold">Choose your perfect seat</h1>
                            </div>
                            <div className="descripotion absolute bottom-5 left-3">
                                <h1 className="text-white text-sm font-medium">Choose the seat that suits you best, whether you prefer a relaxing window view, extra legroom, or your favorite spot with friends. Explore available seats and reserve your perfect place for a comfortable and enjoyable journey.</h1>
                            </div>
                        </div>
                       <div className="box col-span-4 h-[260px] relative">
                            <img src={reservation} className="rounded-xl h-full w-full object-cover" />
                            <div className="tint absolute rounded-xl inset-0 bg-linear-to-b  from-black/80  via-black/30 to-black/90   "></div>
                            <div className="heading absolute top-5 left-3">
                                <h1 className="text-white text-xl font-semibold">Hasslte-free reservation</h1>
                            </div>
                            <div className="descripotion absolute bottom-5 left-3">
                                <h1 className="text-white text-sm font-medium">Enjoy a smooth and hassle-free booking experience with a simple reservation process. Book your bus tickets in just a few clicks, receive instant confirmation.</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WhyTravelWithUs
