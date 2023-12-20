// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import Calendar from "react-calendar";
// import Modal from "react-modal";
// import "./holidays.css";

// // Add Modal
// function HolidayInputModal({ isOpen, onRequestClose, onSubmit, holidays }) {
//   // various states required to save holiday
//   const [name, setName] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   // functions to handle events
//   const handleNameChange = (e) => {
//     setName(e.target.value);
//   };

//   const handleOpenCalendar = () => {
//     setIsCalendarOpen(!isCalendarOpen);
//   };

//   const handleDateChange = (selectedDate) => {
//     setDate(selectedDate);
//     setIsCalendarOpen(false);
//   };

//   const handleSubmit = () => {
//     const newHoliday = {
//       name: name,
//       date: date.toISOString(),
//     };
//     // empty name not allowed
//     if (newHoliday.name === "") {
//       alert("Please provide name for the holiday");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to add this holiday?"
//     );
//     if (!confirmed) {
//       return;
//     }

//     onSubmit(newHoliday);

//     setName("");
//     setDate(new Date());
//   };

//   const handleClose = () => {
//     setDate(new Date());
//     setName("");
//     onRequestClose();
//   };
//   // Styling the calendar
//   const tileClassName = ({ date }) => {
//     return holidays.some((holiday) => moment(holiday.date).isSame(date, "day"))
//       ? "holiday-tile"
//       : null;
//   };

//   const tileContent = ({ date }) => {
//     const holiday = holidays.find((h) => moment(h.date).isSame(date, "day"));
//     let truncatedName = "";
//     const words = holiday ? holiday.name.split(" ") : "";
//     if (words !== "") {
//       truncatedName =
//         words.length > 2 ? words.slice(0, 2).join(" ") + "..." : holiday.name;
//     }

//     return holiday ? (
//       <div
//         className="holiday-marker"
//         style={{
//           maxWidth: "100%",
//           whiteSpace: "normal",
//           overflow: "visible",
//           fontSize: "0.5rem",
//           lineHeight: "0.5rem",
//         }}
//       >
//         {truncatedName}
//       </div>
//     ) : null;
//   };
//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onRequestClose={onRequestClose}
//         contentLabel="Add Holiday"
//         shouldCloseOnOverlayClick={false}
//         style={{
//           content: {
//             width: "60%",
//             minWidth: "310px",
//             minHeight: "440px",
//             margin: "auto",
//             overflow: "hidden",
//             marginTop: "-1.4em",
//             paddingTop: "1.5em",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//           },
//           overlay: {
//             backgroundColor: "rgba(0, 0, 0, 0.3)",
//           },
//         }}
//       >
//         <h2
//           className="mb-5"
//           style={{
//             fontWeight: "350",
//             verticalAlign: "middle",
//           }}
//         >
//           Add Holiday
//         </h2>

//         <div
//           className="form-group row"
//           style={{ transform: "scale(0.9)", marginTop: "-20px" }}
//         >
//           <label className="col-2 col-form-label me-2 ms-sm-0">Name:</label>
//           <div className="col-8">
//             <input
//               type="text"
//               className="form-control ms-2 ms-sm-2"
//               value={name}
//               onChange={handleNameChange}
//               style={{ fontSize: "0.85rem" }}
//             />
//           </div>
//         </div>

//         <div
//           className="form-group row"
//           style={{ transform: "scale(0.9)"}}
//         >
//           <label className="col-2 col-form-label me-2 ms-sm-0">
//             Locations:
//           </label>
//           <div className="col-8">
//             <input
//               type="text"
//               className="form-control ms-2 ms-sm-2"
//               value={name}
//               onChange={handleNameChange}
//               style={{ fontSize: "0.85rem" }}
//             />
//           </div>
//         </div>

//         <div
//           className="form-group row"
//           style={{ marginTop: "5%", transform: "scale(0.9)" }}
//         >
//           <label className="col-2 col-form-label me-2 ms-sm-0">Date:</label>
//           <div className="col-4">
//             <input
//               type="text"
//               className="form-control ms-2 ms-sm-2"
//               value={moment(date).format("DD-MM-YYYY")}
//               style={{ fontSize: "0.85rem" }}
//               readOnly
//             ></input>
//           </div>
//           <div className="col-1">
//             <button
//               className="btn btn-outline-primary btn-sm "
//               onClick={handleOpenCalendar}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 className={`bi bi-calendar-date`}
//                 viewBox="0 0 16 16"
//               >
//                 <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
//                 <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
//               </svg>
//             </button>
//           </div>
//         </div>
//         {/* render calendar on clicking calendar icon */}
//         {isCalendarOpen && (
//           <div
//             className="calendar-container"
//             style={{
//               transform: "scale(0.83)",
//               marginTop: "-19px",
//               marginLeft: "20%",
//             }}
//           >
//             <Calendar
//               value={date}
//               onChange={handleDateChange}
//               tileContent={tileContent}
//               tileClassName={tileClassName}
//             />
//           </div>
//         )}

//         <div
//           className="modal-footer-holiday"
//           style={{
//             padding: "1% 2% 1%",
//             background: "#f0f0f0",
//           }}
//         >
//           <button
//             className="btn btn-sm btn-primary"
//             onClick={handleSubmit}
//             style={{ marginRight: "1%" }}
//           >
//             Submit
//           </button>
//           <button className="btn btn-sm btn-secondary" onClick={handleClose}>
//             Cancel
//           </button>
//         </div>
//       </Modal>
//     </>
//   );
// }

// export default HolidayInputModal;

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import moment from "moment";
import Calendar from "react-calendar";
import "./holidays.css";
import CustomSelect from "./CustomSelect";
import { useLocationSelectors } from "./utils";

function HolidayInputModal({
  isOpen,
  onRequestClose,
  onSubmit,
  holidays,
  locations,
  selectedCities,
  setSelectedCities,
  selectedCountry,
  setSelectedCountry,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    cityOptionsFunction,
    countryOptions,
    handleCityChange,
    handleCountryChange,
    handleReverseIconClick,
    reverse,
  } = useLocationSelectors();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOpenCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const handleSubmit = () => {
    if (!selectedCountry || selectedCities.length === 0) {
      alert("Please select locations for the holiday");
      return;
    }

    const locations = {};
    locations[selectedCountry.value] = selectedCities?.map(
      (city) => city.value
    );

    const newHoliday = {
      name: name,
      date: date.toISOString(),
      locations: locations,
    };

    if (newHoliday.name === "") {
      alert("Please provide a name for the holiday");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to add this holiday?"
    );
    if (!confirmed) {
      return;
    }

    console.log("newHoliday", newHoliday);

    onSubmit(newHoliday);

    setName("");
    setDate(new Date());
    setSelectedCountry(null);
    setSelectedCities([]);
  };

  const handleClose = () => {
    setName("");
    setDate(new Date());
    setSelectedCountry(null);
    setSelectedCities([]);
    onRequestClose();
  };

  // const handleCountryChange = (selectedOption) => {
  //   setSelectedCountry(selectedOption);
  //   setSelectedCities([]); // Reset cities when the country changes
  // };

  // const handleReverseIconClick = () => {
  //   setSelectedCountry(null);
  //   setSelectedCities([]);
  // };

  // const handleCityChange = (selectedOptions) => {
  //   if (selectedOptions.some((option) => option.value === "All")) {
  //     setSelectedCities(cityOptions.filter((city) => city.value !== "All"));
  //   } else {
  //     setSelectedCities(selectedOptions);
  //   }
  // };

  // const countryOptions = locations?.map((location) => ({
  //   value: location.country,
  //   label: location.country,
  // }));

  const [cityOptions, setCityOptions] = useState([]);

  // const cityOptionsFunction = (selectedCountry) => {
  //   if (!selectedCountry) {
  //     return [];
  //   }

  //   const selectedLocation = locations.find(
  //     (location) => location.country === selectedCountry.value
  //   );

  //   if (selectedLocation) {
  //     const cityOptions = selectedLocation.cities?.map((city) => ({
  //       value: city,
  //       label: city,
  //     }));
  //     return cityOptions;
  //   } else {
  //     return [];
  //   }
  // };

  useEffect(() => {
    setCityOptions(cityOptionsFunction(selectedCountry));
  }, [selectedCountry]);

  // Styling the calendar
  const tileClassName = ({ date }) => {
    return holidays.some((holiday) => moment(holiday.date).isSame(date, "day"))
      ? "holiday-tile"
      : null;
  };

  const tileContent = ({ date }) => {
    const holiday = holidays.find((h) => moment(h.date).isSame(date, "day"));
    let truncatedName = "";
    const words = holiday ? holiday.name.split(" ") : "";
    if (words !== "") {
      truncatedName =
        words.length > 2 ? words.slice(0, 2).join(" ") + "..." : holiday.name;
    }

    return holiday ? (
      <div
        className="holiday-marker"
        style={{
          maxWidth: "100%",
          whiteSpace: "normal",
          overflow: "visible",
          fontSize: "0.5rem",
          lineHeight: "0.5rem",
        }}
      >
        {truncatedName}
      </div>
    ) : null;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Add Holiday"
        shouldCloseOnOverlayClick={false}
        style={{
          content: {
            width: "60%",
            minWidth: "310px",
            margin: "auto",
            overflow: "hidden",
            marginTop: "1.2em",
            paddingTop: "1.5em",
            height: "440px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <h2
          className="mb-5"
          style={{ fontWeight: "350", verticalAlign: "middle" }}
        >
          Add Holiday
        </h2>
        <div style={{ transform: "scale(0.9)" }}>
          <div
            className="form-group row"
            style={{ marginTop: "-30px", marginBottom: "-3px" }}
          >
            <label className="col-3 col-md-2 col-form-label me-2 mb-1 ms-sm-0">
              Occasion:
            </label>
            <div className="col-8">
              <input
                type="text"
                className="form-control ms-2 ms-sm-2"
                value={name}
                onChange={handleNameChange}
                style={{ fontSize: "0.85rem" }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-3 col-md-2 col-form-label me-3 ms-sm-0 mt-1">
              Locations:
            </label>
            <div className="col-8">
              {!reverse ? (
                <CustomSelect
                  value={selectedCities}
                  onChange={(selectedOptions) =>
                    handleCityChange(
                      selectedOptions,
                      setSelectedCities,
                      cityOptions
                    )
                  }
                  options={cityOptions}
                  placeholder="Select Cities"
                  onIconClick={handleReverseIconClick}
                  isMulti
                />
              ) : (
                <CustomSelect
                  value={selectedCountry}
                  onChange={(selectedOption) =>
                    handleCountryChange(
                      selectedOption,
                      setSelectedCities,
                      setSelectedCountry
                    )
                  }
                  options={countryOptions}
                  placeholder="Select Country"
                />
              )}
            </div>
          </div>
          <div
            className="form-group row mt-1"
            style={{ transform: "scale(1)" }}
          >
            <label className="col-3 col-md-2 col-form-label me-2 ms-sm-0">
              Date:
            </label>
            <div className="col-4 me-3 me-sm-0">
              <input
                type="text"
                className="form-control ms-2 ms-sm-2"
                value={moment(date).format("DD-MM-YYYY")}
                style={{ fontSize: "0.85rem", minWidth: "95px" }}
                readOnly
              />
            </div>
            <div className="col-1">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleOpenCalendar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className={`bi bi-calendar-date`}
                  viewBox="0 0 16 16"
                >
                  <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </button>
            </div>
            {/* Calendar component */}
            {isCalendarOpen && (
              <div className="custom-calendar">
                <Calendar
                  value={date}
                  onChange={handleDateChange}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer-holiday">
          <button
            className="btn btn-sm btn-primary me-1"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}

export default HolidayInputModal;
