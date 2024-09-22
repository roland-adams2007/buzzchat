import Logout from "./Logout";

const Nav = ({ updateStatus, showTab, activeTab, activeGroup, activeContact }) => {
  return (
    <div
      className={`fixed min-h-16 lg:h-full bottom-0 left-0 w-full lg:relative lg:w-20 flex flex-row lg:flex-col lg:gap-x-4 justify-center lg:justify-between py-2 bg-white z-50 px-2 ${activeGroup || activeContact ? 'hidden' : 'block'} lg:flex`}
      style={{ boxShadow: "1px 0px 10px lightgrey" }}
    >
      <div className="h-auto lg:flex justify-center w-full hidden item-center">
        <img src="assets/images/bee.png" className="w-12 h-12" alt="" />
      </div>
      <div
        className="w-full h-auto flex flex-row lg:flex-col justify-between lg:justify-center item-center gap-4"
        style={{ alignItems: "center" }}
      >
        <a
        title="Profile"
          href="#profile"
          onClick={(e) => { e.preventDefault(); showTab('profile'); }}
          id="profile-link"
          className={`rounded-md p-2 icon-link ${activeTab === 'profile' ? 'icon-link2' : ''}`}
        >
          <i className="bx bx-user md:text-3xl" />
        </a>
        <a
        title="Chats"
          href="#chat"
          onClick={(e) => { e.preventDefault(); showTab('chat'); }}
          id="chat-link"
          className={`rounded-md p-2 icon-link ${activeTab === 'chat' ? 'icon-link2' : ''}`}
        >
          <i className="bx bx-message-square-dots text-2xl md:text-3xl" />
        </a>
        <a
        title="Groups"
          href="#group"
          onClick={(e) => { e.preventDefault(); showTab('group'); }}
          id="group-link"
          className={`rounded-md p-2 icon-link ${activeTab === 'group' ? 'icon-link2' : ''}`}
        >
          <i className="bx bx-group text-2xl md:text-3xl" />
        </a>
        <a
        title="Contacts"
          href="#contact"
          onClick={(e) => { e.preventDefault(); showTab('contact'); }}
          id="contact-link"
          className={`rounded-md p-2 icon-link ${activeTab === 'contact' ? 'icon-link2' : ''}`}
        >
          <i className="bx bxs-user-detail text-2xl md:text-3xl" />
        </a>
        <a
        title="Setting"
          href="#setting"
          onClick={(e) => { e.preventDefault(); showTab('setting'); }}
          id="setting-link"
          className={`rounded-md p-2 icon-link ${activeTab === 'setting' ? 'icon-link2' : ''}`}
        >
          <i className="bx bx-cog text-2xl md:text-3xl" />
        </a>
      </div>
      <div
        className="w-1/5 lg:w-full h-auto flex flex-row lg:flex-col justify-end lg:justify-center item-center gap-6"
        style={{ alignItems: "center" }}
      >
        <Logout updateStatus={updateStatus} />
      </div>
    </div>
  );
};

export default Nav;
