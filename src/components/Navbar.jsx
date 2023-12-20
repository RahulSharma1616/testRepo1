import { useEffect, useState } from "react";
import logo from "../images/LOGO.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import Modal from "react-modal";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import ChatbotTry from "./ChatbotTry";

export default function Navbar({ handleProfileModal }) {
  const [image, setImage] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [manager, setManager] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (cookies.token) {
      axios({
        method: "get",
        url: "http://localhost:4000/user/profile",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      }).then((response) => {
        setImage(response.data.image);
      });
    }
  }, []);

  useEffect(() => {
    if (cookies.token) {
      axios({
        method: "get",

        url: "http://localhost:4000/user/isManager",

        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      }).then((response) => {
        setManager(response.data.manager);
      });
    }
  }, []);

  useEffect(() => {
    if (cookies.token) {
      axios({
        method: "get",
        url: "http://localhost:4000/user/isAdmin",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      }).then((response) => {
        setAdmin(response.data.isAdmin);
      });
    }
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
    if (typeof handleProfileModal !== "undefined") {
      handleProfileModal(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (typeof handleProfileModal !== "undefined") {
      handleProfileModal(false);
    }
  };

  function handleLogout() {
    removeCookie("token");
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Background overlay color
          },
          content: {
            minWidth: "300px",
            maxWidth: "500px",
            minHeight: "470px",
            maxHeight: "700px",
            width: "80%", // Width of the modal
            left: "50%", // Position from the left
            overflowY: "hidden",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="d-flex justify-content-between">
          <span
            className="h2 mb-2"
            style={{ fontWeight: "350", verticalAlign: "middle" }}
          >
            My Profile
          </span>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={closeModal}
          ></button>
        </div>
        <Profile closeWin={closeModal} />
      </Modal>
      <div className="navbar-container justify-content-between py-2">
        <div className="mx-5">
          <div className="justify-content-between d-flex">
            <Link to="/">
              <div>
                {/* <img className="logo" src="https://www.incedoinc.com/wp-content/uploads/incedo-logo.png" alt="logo" /> */}
                <img className="logo p-0" src={logo} />
              </div>
            </Link>
            {cookies.token && (
              <div className="d-flex">
                <ChatbotTry />
                <div className="dropdown">
                  <img
                    src={image.url}
                    className="dropdown-toggle rounded-circle navbarIcon"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <GiHamburgerMenu
                    // src={image.url}
                    className="dropdown-toggle rounded-circle hamburger"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <ul
                    className="dropdown-menu shadow"
                    style={{
                      width: "270px",
                      textAlign: "center",
                      paddingBottom: "20px",
                      border: "none",
                      marginRight: "-40px !important",
                    }}
                  >
                    <li>
                      <a onClick={openModal} className="dropdown-item" href="#">
                        My Profile
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="/">
                        <a className="dropdown-item smallDropdown text-dark">
                          Home
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link to="/create-timesheet">
                        <a
                          className="dropdown-item smallDropdown text-dark"
                          href=""
                        >
                          Create Timesheet
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link to="/tickets">
                        <a
                          className="dropdown-item smallDropdown text-dark"
                          href=""
                        >
                          Tickets
                        </a>
                      </Link>
                    </li>
                    {admin && (
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    )}
                    {admin && (
                      <li>
                        <Link to="/admin-dashboard">
                          <a
                            className="dropdown-item smallDropdown text-dark"
                            href=""
                          >
                            Admin's Desk
                          </a>
                        </Link>
                      </li>
                    )}
                    {admin && (
                      <li>
                        <Link to="/analytics">
                          <a
                            className="dropdown-item smallDropdown text-dark"
                            href=""
                          >
                            Analytics
                          </a>
                        </Link>
                      </li>
                    )}
                    {admin && (
                      <li>
                        <Link to="/holidays">
                          <a
                            className="dropdown-item smallDropdown text-dark"
                            href=""
                          >
                            Holidays
                          </a>
                        </Link>
                      </li>
                    )}
                    {manager && (
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    )}
                    {manager && (
                      <li>
                        <Link to="/manager-dashboard">
                          <a
                            className="dropdown-item smallDropdown text-dark"
                            href=""
                          >
                            Manager's desk
                          </a>
                        </Link>
                      </li>
                    )}
                    {manager && (
                      <li>
                        <Link to="/tickets-received">
                          <a
                            className="dropdown-item smallDropdown text-dark"
                            href=""
                          >
                            Tickets Received
                          </a>
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link to="/">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={handleLogout}
                          style={{
                            width: "200px",
                            marginLeft: "10px",
                            marginRight: "10px",
                            marginBottom: "-10px",
                          }}
                        >
                          Logout
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
