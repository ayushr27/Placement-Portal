import React from 'react'

const Recruiterlogin = () => {
  return (
    <div className='flex min-h-screen'>
        {/* Left Section */}
        <div
        className="w-[40%] text-white flex flex-col p-8 bg-cover bg-center bg-no-repeat bg-blue-800"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <h5 className="mb-6">IIITDM Kurnool Placements</h5>
        <p className="text-4xl mb-4 text-black font-semibold">
          One stop portal for students & companies for placements.
        </p>
        <img
          src="/logo.webp"
          alt="IIITDM Kurnool Logo"
          className="mb-4 mt-16 ml-[130px] w-[250px] h-[250px]"
        />
        <p className="text-sm font-semibold mt-[120px]">Instructions</p>
        <p className="text-sm font-semibold">Login using your provided credentials.</p>
      </div>
    </div>
  )
}

export default Recruiterlogin