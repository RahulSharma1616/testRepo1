import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import Modal from "react-modal";
import CustomSelect from "./CustomSelect";
import { useCityOptionsEffect, useLocationSelectors } from "./utils";

// Edit Modal
const HolidayEditModal = ({
  isOpen,
  onRequestClose,
  holidayData,
  onEdit,
  onDelete,
  holidays,
  locations,
  selectedCities,
  selectedCountry,
  setSelectedCities,
  setSelectedCountry,
}) => {
  // various states to edit holiday
  const [name, setName] = useState(holidayData ? holidayData.name : "");
  const [date, setDate] = useState(
    holidayData ? new Date(holidayData.date) : new Date()
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [defaultValueForCities, setDefaultValueForCities] = useState(null);

  const {
    cityOptionsFunction,
    countryOptions,
    handleCityChange,
    handleCountryChange,
    handleReverseIconClick,
    reverse,
  } = useLocationSelectors();

  // functions to handle events
  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsModified(true);
  };

  //function to toggle the calendar visibility
  const handleOpenCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // function to handle date change
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
    setIsModified(true);
  };

  //function to handle the submit (edit event)
  const handleEdit = () => {
    const editedHoliday = {
      _id: holidayData._id,
      name: name,
      date: date.toISOString(),
      locations: {
        [selectedCountry.value]: selectedCities.map((city) => city.value),
      },
    };
    const confirmed = window.confirm(
      "Are you sure you want to update this holiday?"
    );
    if (!confirmed) {
      return;
    }
    onEdit(editedHoliday);
  };

  //function to handle deletion
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this holiday?"
    );
    if (confirmed) {
      onDelete(holidayData._id);
      onRequestClose();
    }
  };

  //function to define content for each date tile on calendar
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

  //function to define css class name for date tiles on calendar
  const tileClassName = ({ date }) =>
    holidays.some((holiday) => moment(holiday.date).isSame(date, "day"))
      ? "holiday-tile"
      : null;

  // // set the country options to display
  // const countryOptions = locations.map((location) => ({
  //   value: location.country,
  //   label: location.country,
  // }));

  // // function to handle selected city changes
  // const handleCityChange = (selectedOptions) => {
  //   // console.log("selectedOptions-> ", selectedOptions);
  //   if (selectedOptions.some((option) => option.value === "All")) {
  //     setSelectedCities(cityOptions.filter((city) => city.value !== "All"));
  //   } else {
  //     setSelectedCities(selectedOptions);
  //   }
  //   // console.log("selectedCities-> ", selectedCities);
  //   setIsModified(true);
  // };

  // //function to handle selected country change
  // const handleCountryChange = (selectedOption) => {
  //   setSelectedCountry(selectedOption);
  //   handleReverseIconClick();
  //   setSelectedCities([]);
  // };

  // const handleReverseIconClick = () => {
  //   setReverse(!reverse);
  // };

  // // Function and hook to update city options according
  // //  to the country of the selected holiday for editing
  // const cityOptionsFunction = () => {
  //   if (!selectedCountry) {
  //     return [];
  //   }

  //   const selectedLocation = locations.find(
  //     (location) => location.country === selectedCountry.value
  //   );

  //   if (selectedLocation) {
  //     const cityOptions = selectedLocation.cities.map((city) => ({
  //       value: city.label || city,
  //       label: city.value || city,
  //     }));
  //     return cityOptions;
  //   } else {
  //     return [];
  //   }
  // };
  useCityOptionsEffect(setCityOptions, selectedCountry, cityOptionsFunction);

  // Set Default values of the city that are
  // already selected
  useEffect(() => {
    if (selectedCities) {
      const defaultValue = selectedCities.flat().map((city) => ({
        label: city.label || city,
        value: city.value || city,
      }));

      setDefaultValueForCities(defaultValue);
    } else setDefaultValueForCities([]);
  }, [selectedCities]);

  // Get selected holiday data
  useEffect(() => {
    setName(holidayData ? holidayData.name : "");
    setDate(holidayData ? new Date(holidayData.date) : new Date());
    if (holidayData) {
      const country = Object.keys(holidayData.locations)[0];

      setSelectedCountry(country ? { label: country, value: country } : []);
    }
    setSelectedCities(holidayData ? Object.values(holidayData.locations) : []);
    setIsModified(false);
  }, [holidayData]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Holiday"
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
        Edit Holiday
      </h2>
      <div style={{ transform: "scale(0.9)" }}>
        <div className="form-group row" style={{ marginTop: "-30px" }}>
          <label className="col-3 col-md-2 col-form-label me-2 pe-3 ms-sm-0">
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
          <label className="col-3 col-md-2 col-form-label me-3 ms-sm-0">
            Locations:
          </label>
          
          <div className="col-8">
            {!reverse ? (
              <CustomSelect
                value={defaultValueForCities}
                onChange={(selectedOptions) =>
                  handleCityChange(
                    selectedOptions,
                    setSelectedCities,
                    cityOptions,
                    setIsModified,
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
                onChange={(selectedOptions) =>
                  handleCountryChange(
                    selectedOptions,
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
          className="form-group row"
          style={{
            transform: "scale(1)",
          }}
        >
          <label className="col-3 col-md-2 col-form-label me-2 ms-sm-0">
            Date:
          </label>
          <div className="col-4 me-3 me-sm-0 mt-1">
            <input
              type="text"
              className="form-control ms-2"
              value={moment(date).format("DD-MM-YYYY")}
              style={{ fontSize: "0.85rem", minWidth: "95px" }}
              readOnly
            ></input>
          </div>
          <div className="col-1 mt-1">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleOpenCalendar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                fill="currentColor"
                className="bi bi-calendar-date"
                viewBox="0 0 16 16"
              >
                <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
              </svg>
            </button>
          </div>
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
      <div
        className="modal-footer-holiday"
        style={{ padding: "1% 2% 1%", background: "#f0f0f0" }}
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={handleEdit}
          style={{ marginRight: "1%" }}
          disabled={!isModified}
        >
          Update
        </button>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="btn btn-outline-dark btn-sm"
          onClick={onRequestClose}
          style={{ marginLeft: "1%" }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default HolidayEditModal;
