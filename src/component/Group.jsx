import { useState,useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Group = ({userDetails,showModal, onMessageClick}) =>{
   
  const userId = userDetails.user_id;
  const [groups,setGroups]=useState([]);
  const [search,setSearch]=useState("");
  const [filteredGroup,setFilteredGroups]=useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
 
    useEffect(()=>{

      const fetchGroups = async () =>{

       try{
        if(userId){

          const response = await axios.get(`http://localhost/buzzchat_backend/action/fetch_groups.php?user_id=${userId}`)
            const res=response.data;
            setGroups(res);
            setFilteredGroups(groups.filter(group =>
              group.group_name.toLowerCase().includes(search.toLowerCase())
          ));
        }
       }finally{
        setIsLoading(false)
       }
   
      }

      fetchGroups()
    })    


    return(
        <>
          <div id="group" className="md:w-full min-h-screen relative py-4 ">
  <div
    className="flex flex-col gap-y-5  sticky top-0 left-0 mb-5 px-5"
    style={{ backgroundColor: "#f7f7fb" }}
  >
    <div className="w-full flex flex-row justify-between items-center">
      <h3 className="text-xl font-semibold">Groups</h3>
      <button type="button" id="modalbutton" onClick={showModal} title="Create group">
        <i className="bx bx-group text-2xl text-gray-500" />
      </button>
    </div>
    <div className="w-full">
      <form action="#" onSubmit={(e)=>e.preventDefault()} method="post" className="w-full">
        <input
          type="search"
          className="w-full rounded-sm focus:outline-none p-3 text-sm"
          name="search-group"
          id="search-group"
          placeholder="Search Groups"
          style={{ backgroundColor: "lavender" }}
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </form>
    </div>
  </div>
  <div className="w-full h-calc flex flex-col overflow-y-scroll scroll-bar px-5 ">
    {isLoading ? (
       <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
        <Oval
       height={40}
       width={40}
       color="#007BFF"
       visible={true}
       ariaLabel="oval-loading"
       secondaryColor="#007BFF"
       strokeWidth={2}
       strokeWidthSecondary={2}
   />
   <h3>Fetching groups...</h3>
       </div>
    ) : (
      <>
            {groups.length === 0 ? (
              <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
                <svg
                    className="w-12 h-12 mb-2 fill-current text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <h3>Group list is empty</h3>
              </div>
             ) : (
              <>
                {filteredGroup.length === 0 ? (
                                <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
                                <svg
                                    className="w-12 h-12 mb-2 fill-current text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                </svg>
                                <h3>No group found</h3>
                              </div>
                ) : (
                   filteredGroup.map(group=>(
                    <a
                    href="#"
                    className="w-full h-16 flex flex-row items-center group-link rounded-sm px-2"
                    key={group.group_id}
                    onClick={(e)=>onMessageClick(e,group.group_id)}
                  >
                  <div className="flex items-center justify-center w-16">
                    <img
                      src={`http://localhost/buzzchat_backend/assets/${group.group_profile}`}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
      
                    <div className="w-full h-16 flex flex-row items-center justify-between px-6">
                      <h3 className="font-semibold text-sm text-gray-600">{(group.group_name).length >= 20 ? (group.group_name).slice(0,20)+".." : group.group_name}</h3>
                      {group.unread_count !== 0 && (
                        <p className="inline-flex items-center justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        {group.unread_count}
                      </p>
                      )}
                    </div>
                  </a>
                  ))
                )}
              </>
            )}
      </>)}
  </div>
        </div>

        </>
    )
}

export default Group;