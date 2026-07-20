import React from 'react'

const page = () => {
  return (
    <>
        <section>
            <div className="successfull-content site-container pt-[120px] md:pt-[200px] pb-[80px] md:pb-[120px] flex flex-col items-center">
                <div className="successfull-header flex flex-col items-center mb-12">
                       <div className="successfull-icon mb-4">
                    <img src="/ICONS/check.png" alt="Successfull" className="w-20 h-20" />
                </div>
                <div className="successfull-text flex flex-col items-center justify-center text-center">
                    <h3 className='text-[36px] md:text-[76px] font-medium w-full md:w-[60%]'>Booking Request Submitted Successfully</h3>
                    <p className='text-[16px] md:text-[20px] font-regular w-full md:w-[50%] mt-2'>Your booking request has been received. Our team will review the request and confirm availability shortly.</p>
                    <span className="booking-id px-[20px] py-[8px] md:px-[32px] md:py-[16px] bg-[#E1FF83] rounded-[30px] mt-6">
                        <p className='text-[16px] md:text-[20px] font-medium text-black'>Booking ID: #BK10245</p>
                    </span>
                </div>
                </div>
             

                <div className="booking-details w-full md:w-[60%] border p-[24px] md:p-[40px] rounded-[30px]">
                    <div className="booking-details-heading mb-5">
                        <h4 className='text-[26px] font-semibold'>Booking Details</h4>
                    </div>
                    <div className="booking-details-flex flex flex-col md:flex-row md:justify-between">
                        <div className="booking-details-left flex flex-col gap-4 md:gap-6">
                            <div className="booking-details-left-item">
                                <span className='text-[14px] md:text-[18px] font-regular'>Service Name</span>
                                <h6 className='text-[16px] md:text-[22px] font-medium text-black'>Swimming Pool</h6>
                            </div>

                            <div className="booking-details-left-item">
                                <span className='text-[14px] md:text-[18px] font-regular'>Booking Date</span>
                                <h6 className='text-[16px] md:text-[22px] font-medium text-black'>March 18, 2026</h6>
                            </div>

                            <div className="booking-details-left-item">
                                <span className='text-[14px] md:text-[18px] font-regular'>Customer Name</span>
                                <h6 className='text-[16px] md:text-[22px] font-medium text-black'>Alex Johnson</h6>
                            </div>
                            
                        </div>

                           <div className="booking-details-right flex flex-col gap-4 md:gap-6 md:text-right">
                            <div className="booking-details-right-item">
                                <span className='text-[14px] md:text-[18px] font-regular'>Booking Status</span>
                                <h6 className='text-[16px] md:text-[22px] font-medium text-[#FF9000]'>Pending Admin Approval</h6>
                            </div>

                            <div className="booking-details-right-item">
                                <span className='text-[14px] md:text-[18px] font-regular'>Time Slot</span>
                                <h6 className='text-[16px] md:text-[22px] font-medium text-black'>10:00 AM - 12:00 PM</h6>
                            </div>

                            <div className="booking-details-right-item">
                                <span className='text-[14px] md:text-[18px] font-regular'>Contact Number</span>
                                <h6 className='text-[16px] md:text-[22px] font-medium text-black'>+1 (555) 123-4567</h6>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default page