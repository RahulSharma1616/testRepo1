import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Select, { components } from "react-select";

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  onIconClick,
  isMulti,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const Control = ({ children, ...props }) => {
    const { reverseIcon, onIconClick } = props.selectProps;

    const handleMouseOver = (e) => {
      e.target.style.opacity = "1";
    };

    const handleMouseLeave = (e) => {
      e.target.style.opacity = "0.5";
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const style = {
      cursor: "pointer",
      marginLeft: "5px",
      marginBottom: "5px",
      opacity: isFocused ? "0.9" : "0.65",
      transition: "opacity 0.4s",
    };

    return (
      <>
        <components.Control {...props}>
          <span
            onMouseDown={onIconClick}
            style={style}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {reverseIcon}
          </span>
          {children}
        </components.Control>
      </>
    );
  };

  const styles = {
    control: (css) => ({ ...css, paddingLeft: "1rem" }),
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      fontSize: "0.85rem",
      maxHeight: "65px",
      overflow: "auto",
      borderRadius: "6px",
      border: state.isFocused ? "0.1px solid #80bdff" : "1px solid #ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
        : "none",
      "&:hover": {},
    }),
  };

  return (
    <>
      <Select
        {...(onIconClick && { reverseIcon: <FiArrowLeft /> })}
        {...(onIconClick && { onIconClick: onIconClick })}
        {...(!onIconClick && { styles: styles })}
        {...(onIconClick
          ? { name: "selectCities" }
          : { name: "selectCountry" })}
        components={{ Control }}
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        styles={customStyles}
      />
    </>
  );
};

export default CustomSelect;
