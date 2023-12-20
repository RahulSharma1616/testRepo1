import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { locationsAtom } from "../../jotaiStore";

export const useCityOptionsEffect = (
  setCityOptions,
  selectedCountry,
  cityOptionsFunction,
  isMulti = true
) => {
  useEffect(() => {
    setCityOptions(cityOptionsFunction(selectedCountry, isMulti));
  }, [selectedCountry]);
};

export const useLocationSelectors = () => {
  const [locations] = useAtom(locationsAtom);
  const [reverse, setReverse] = useState(false);

  const handleReverseIconClick = () => {
    setReverse(!reverse);
  };

  // set the country options to display
  const countryOptions = locations?.map((location) => ({
    value: location.country,
    label: location.country,
  }));

  // function to handle selected city changes
  function handleCityChange(
    selectedOptions,
    setSelectedCities,
    cityOptions,
    setIsModified = undefined,
  ) {
    console.log("selectedOptions-> ", selectedOptions);
    if (selectedOptions?.some((option) => option.value === "All")) {
      setSelectedCities(cityOptions?.filter((city) => city.value !== "All"));
    } else {
      setSelectedCities(selectedOptions);
    }
    if (typeof setIsModified === "function") {
      setIsModified(true);
    }
  }

  function handleCityChangeSingle(selectedOption, setSelectedCity) {
    setSelectedCity(selectedOption);
  }

  //function to handle selected country change
  function handleCountryChange(
    selectedOption,
    setSelectedCities,
    setSelectedCountry,
    setSelectedCity
  ) {
    setSelectedCountry(selectedOption);
    handleReverseIconClick();
    setSelectedCities([]);
    if(typeof setSelectedCity === 'function')
        setSelectedCity([])
  }

  // Function and hook to update city options according
  //  to the country of the selected holiday for editing
  function cityOptionsFunction(selectedCountry, isMulti) {
    if (!selectedCountry) {
      return [];
    }

    const selectedLocation = locations?.find(
      (location) => location.country === selectedCountry.value
    );

    if (selectedLocation) {
      const cityOptions = selectedLocation.cities?.map((city) => ({
        value: city.label || city,
        label: city.value || city,
      }));

      const filteredCityOptions = cityOptions.filter(
        (city) => city.value !== "All"
      );

      return isMulti ? cityOptions : filteredCityOptions;
    } else {
      return [];
    }
  }

  return {
    countryOptions,
    handleCityChangeSingle,
    handleCityChange,
    handleCountryChange,
    cityOptionsFunction,
    reverse,
    handleReverseIconClick,
  };
};
