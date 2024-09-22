

const Profile = ({userDetails,userStatus}) =>{
 const isOnline = userStatus.is_online;

 


    return(
        <>
        <div id="profile" className="md:w-full min-h-screen relative py-4 px-5">
  <div className="w-full flex flex-col gap-y-4 border-b pb-6">
    <div className="">
      <h2 className="text-xl font-semibold">My Profile</h2>
    </div>
    <div className="w-full flex flex-col justify-center items-center gap-y-4">
      <img
        src={`http://localhost/buzzchat_backend/assets/${userDetails.user_profile}`}
        className="w-20 h-20 rounded-full object-cover"
      />
      <div className="flex flex-col  justify-center items-center w-full">
        <span className="text-xl font-semibold">{userDetails.user_fname} {userDetails.user_lname}</span>
        <span className="text-sm text-gray-500">
        {isOnline ? (
                <span>
                    <i className="bx bxs-circle text-green-500 text-xs" /> Online
                </span>
            ) : (
                <span>
                    <i className="bx bxs-circle text-red-500 text-xs" /> Offline
                </span>
            )}

        </span>
      </div>
    </div>
  </div>
  <div className="mt-5">
    <div className="">
      <p className="text-sm text-gray-500">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem
        eum dicta itaque sapiente repellendus. Libero veritatis vero architecto
        ab, perspiciatis officiis illum impedit, numquam aperiam voluptas magni
        sit molestias tempora!
      </p>
    </div>
    <div className="max-w-md mx-auto my-10">
      <details className="group bg-gray-100 open:bg-gray-200 duration-300 rounded-lg overflow-hidden">
        <summary className="cursor-pointer py-3 px-5 bg-gray-300 text-gray-800 font-semibold flex justify-between items-center">
          <span className="text-sm font-semibold">
            <i className="bx bx-user" /> Profile
          </span>
          <i className="bx bx-chevron-down text-gray-600 group-open:rotate-180 transition-transform duration-300" />
        </summary>
        <div className="px-5 py-4 text-gray-700 flex flex-col gap-y-3">
          <div>
            <h3 className="text-sm text-gray-500">Name</h3>
            <p className="text-sm font-semibold">{userDetails.user_fname} {userDetails.user_lname}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Email</h3>
            <p className="text-sm font-semibold">{userDetails.user_email}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Phone Number</h3>
            <p className="text-sm font-semibold">{userDetails.user_phone}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Country</h3>
            <p className="text-sm font-semibold">{userDetails.country_name}</p>
          </div>
        </div>
      </details>
    </div>
  </div>
</div>

        </>
    )

}

export default Profile