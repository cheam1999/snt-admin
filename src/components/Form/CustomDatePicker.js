import React, { useState, useEffect } from "react";

import DatePicker from 'react-datepicker'
import moment from 'moment'

import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = (props) => {

  return (
    <div className="customDatePickerWidth form-group input-group">
      <DatePicker
        placeholderText='Select a date'
        wrapperClassName="input-group"
        className={`form-control ${props.err ? 'is-invalid' : ''}`}
        onChange={(date) => props.onChange(date)}
        // selected={props.value}
        selected={props.value ? props.value : null}
        // selected={moment(props.value)}
        dateFormat="d MMM yyyy"
      />
      {/* <div className="invalid-feedback">{props.err?.message}</div> */}
    </div>
  );
};

export default CustomDatePicker;
