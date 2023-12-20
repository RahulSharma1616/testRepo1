import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-calendar/dist/Calendar.css";
import "./holidays.css";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit } from "react-icons/fi";
import HolidayInputModal from "./HolidayInputModal";
import HolidayEditModal from "./HolidayEditModal";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Modal from "react-modal";
import Navbar from "../Navbar";
import SideNav from "../SideNav";
import { useAtom } from "jotai";
import { allCountriesAtom, locationsAtom } from "../../jotaiStore";

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const holidaysPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editHolidayData, setEditHolidayData] = useState(null);
  const [actionOccured, setActionOccurred] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCountryOption, setSelectedCountryOption] = useState(null);
  const [cookies, setCookie] = useCookies(["token"]);
  const [locations] = useAtom(locationsAtom);
  const [allCountries] = useAtom(allCountriesAtom);

  console.log("locations", locations);

  const handleTabClick = (country) => {
    setSelectedCountry(country);
  };

  const handleProfileModal = (isOpen) => {
    if (isOpen) {
      setIsProfileModalOpen(true);
    } else {
      setIsProfileModalOpen(false);
    }
  };

  function handleEdit(holidayData) {
    setIsEditModalOpen(true);
    setEditHolidayData(holidayData);
  }

  // useEffect(() => {
  //   axios({
  //     method: "get",
  //     url: "http://localhost:4000/holidays/all",
  //     // headers : {
  //     //     Authorizaton : `Bearer ${cookies.token}`
  //     // }
  //   })
  //     .then((response) => {
  //       // setHolidays(response.data);
  //       setAllCountries(
  //         response.data.holidays.map((location) => location.countries)
  //       );
  //     })
  //     .catch((error) => {
  //       console.log("error in getting holidays->", error);
  //     });
  //   // if (actionOccured) {
  //   //   setActionOccurred(false);
  //   // }
  // }, []);
  // [actionOccured]);

  useEffect(() => {
    //Get all the holidays for the selected country
    if (selectedCountry) {
      axios({
        method: "get",
        url: `http://localhost:4000/holidays/${selectedCountry}`,
        headers: {
          Authorizaton: `Bearer ${cookies.token}`,
        },
      })
        .then((response) => {
          setHolidays(response.data);
        })
        .catch((error) => {
          console.log("error in getting holidays->", error);
        });
      if (actionOccured) {
        setActionOccurred(false);
      }
    }
  }, [selectedCountry, actionOccured]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCountry]);

  const indexOfLastHoliday = currentPage * holidaysPerPage;
  const indexOfFirstHoliday = indexOfLastHoliday - holidaysPerPage;
  const currentHolidays = holidays.slice(
    indexOfFirstHoliday,
    indexOfLastHoliday
  );

  //Function to display locations
  const getCitiesString = (locations) => {
    if (!locations || locations.size === 0) {
      return "Location 1,Location 2, Location 3, Location 4, Location 5";
    }

    const citiesArray = [];
    for (const country in locations) {
      locations[country].forEach((city) => citiesArray.push(city));
    }
    // console.log("cities -> ", citiesArray);
    return citiesArray.join(", ");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCountryOption(null);
    setSelectedCities(null);
    setIsModalOpen(false);
  };

  const closeEditModal = () => {
    setSelectedCountryOption(null);
    setSelectedCities([]);
    setIsEditModalOpen(false);
  };

  function handleSubmit(newHoliday) {
    let isDuplicateName = false;
    let isDuplicateDate = false;
    // checking the holiday name or date does not already exists
    holidays.forEach((holiday) => {
      if (holiday.date === newHoliday.date) {
        return (isDuplicateDate = true);
      }
    });

    holidays.forEach((holiday) => {
      if (holiday.name.toLowerCase() === newHoliday.name.toLowerCase()) {
        return (isDuplicateName = true);
      }
    });

    if (isDuplicateDate) {
      alert("Holiday on this day already exists");
      return;
    }

    if (isDuplicateName) {
      alert("Holiday with same name already exists");
      return;
    }
    // make api call to save holiday
    axios
      .post("http://localhost:4000/holidays/save", newHoliday)
      .then(() => {
        toast.success(
          `Holiday "${newHoliday.name}" on ${moment(newHoliday.date).format(
            "DD-MM-YYYY"
          )} is saved`,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 5000,
            className: "custom-toast",
          }
        );
      })
      .catch((error) => {
        console.error("Error adding holiday:", error);
      });
    setActionOccurred(true);
    // setIsModalOpen(false);
    closeModal();
  }
  // handle delete action
  function handleDelete(id) {
    axios
      .delete(`http://localhost:4000/holidays/remove/${id}`)
      .then(() => {
        toast.success("Holiday deleted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          className: "custom-toast",
        });

        setActionOccurred(true);
      })
      .catch((error) => {
        console.error("Error deleting holiday: ", error);
      });
  }
  // handle edit action
  function handleEditHoliday(editedHoliday) {
    axios
      .put(
        `http://localhost:4000/holidays/update/${editedHoliday._id}`,
        editedHoliday
      )
      .then(() => {
        toast.success(`Holiday "${editedHoliday.name}" updated`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
          className: "custom-toast",
        });

        setActionOccurred(true);
        console.log("Holiday updated successfully");
      })
      .catch((error) => {
        console.error("Error updating holiday:", error);
      });
    closeEditModal();
  }

  return (
    <>
      {/* <h1 style={{background:"yellow", color: "blue" }}>{JSON.stringify(locations)}</h1> */}
      <Navbar handleProfileModal={handleProfileModal} />
      <br />
      <div className="pt-3 mt-1">
        <SideNav />
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-2 col-md-1"></div>
          <div className="col-sm-10 col-md-11">
            <h1>Manage Holidays </h1>

            {/* Tabs */}
            <Tabs>
              <TabList>
                {allCountries?.map((country) => (
                  <>
                    {console.log("Jai Mata Di")}
                    <Tab key={country} onClick={() => handleTabClick(country)}>
                      {country}
                    </Tab>
                  </>
                ))}
              </TabList>
              {/* Tab content */}
              {allCountries?.map((country) => (
                <>
                  <TabPanel key={country}>
                    {console.log("hari om")}
                    <table className="table">
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#3f68d9",
                              color: "white",
                            }}
                          >
                            Name
                          </th>
                          <th
                            style={{
                              backgroundColor: "#3f68d9",
                              color: "white",
                            }}
                          >
                            Location
                          </th>
                          <th
                            style={{
                              backgroundColor: "#3f68d9",
                              color: "white",
                            }}
                          >
                            Date
                          </th>
                          <th
                            style={{
                              backgroundColor: "#3f68d9",
                              color: "white",
                            }}
                          >
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Render holidays in table */}
                        {currentHolidays?.map((holiday) => (
                          <tr key={holiday._id}>
                            <td>{holiday.name}</td>
                            <td>{getCitiesString(holiday.locations)}</td>
                            <td>{moment(holiday.date).format("DD-MM-YYYY")}</td>
                            <td>
                              <FiEdit
                                style={{ color: "blue", opacity: "0.5" }}
                                onClick={() => handleEdit(holiday)}
                              />
                            </td>
                          </tr>
                        ))}
                        {/* Render empty rows if rows are less then 6 */}
                        {currentHolidays.length < holidaysPerPage &&
                          Array(holidaysPerPage - currentHolidays.length)
                            .fill()
                            ?.map((_, index) => (
                              <tr key={`empty-${index}`}>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </TabPanel>
                </>
              ))}
            </Tabs>
            {/* Hide add button and pagination buttons when modals are open */}
            {!isModalOpen && !isEditModalOpen && !isProfileModalOpen && (
              <div className="d-flex justify-content-between">
                <div>
                  <button
                    className="btn btn-success btn-sm float-lefts"
                    onClick={openModal}
                  >
                    Add
                  </button>
                </div>
                {/* Pagination logic */}
                <nav>
                  <ul
                    className="pagination"
                    style={{ justifyContent: "flex-end" }}
                  >
                    {Array(Math.ceil(holidays.length / holidaysPerPage))
                      .fill(0)
                      ?.map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            index + 1 === currentPage ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                            style={{
                              height: "1.3rem",
                              fontSize: "0.8rem",
                              padding: "0 0.5rem",
                            }}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>
            )}
            {/* Add holiday modal */}
            <HolidayInputModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              onSubmit={handleSubmit}
              holidays={holidays}
              locations={locations}
              selectedCities={selectedCities}
              selectedCountry={selectedCountryOption}
              setSelectedCities={setSelectedCities}
              setSelectedCountry={setSelectedCountryOption}
            />
            {/* Edit Holiday modal */}
            <HolidayEditModal
              isOpen={isEditModalOpen}
              onRequestClose={closeEditModal}
              holidayData={editHolidayData}
              onEdit={handleEditHoliday}
              onDelete={handleDelete}
              holidays={holidays}
              locations={locations}
              selectedCountry={selectedCountryOption}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              setSelectedCountry={setSelectedCountryOption}
            />
            {/* Toast styling */}
            <ToastContainer
              style={{
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Holidays;

Modal.setAppElement("#root"); // Set the root element for accessibility
