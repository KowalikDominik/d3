import React from "react";
import "./button.css";

const Spinner = () => {
  return <div className="lds-dual-ring"></div>;
};
const Button = ({ text, loading, onClick }) => {
  return (
    <button className="btn" onClick={onClick && onClick}>
      {loading ? <Spinner /> : null}
      {text}
    </button>
  );
};

export default Button;
