import React from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const AnimatedMultiSelect = (props) => {

    const customStyles = {
        placeholder: (provided) => ({
            ...provided,
            color: '#939ba2'
        }),

        control: (provided, state) => ({
            ...provided,
            width: "100%",
            minHeight: "calc(2.25rem + 2px)",
            color: "#495057",
            borderRadius: "0.25rem ",
            border: props.err ?
                state.isFocused ?
                    "1px solid #ced4da" :
                    "1px solid #dc3545" :
                "1px solid #ced4da",
        }),

        menuList: (provided) => ({
            ...provided,
            zIndex: 9999
        }),
    }

    return (
        <div className="max-width">
            <Select
                styles={customStyles}
                placeholder="Select item(s)"
                closeMenuOnSelect={false}
                components={animatedComponents}
                className={` ${props.err ? 'is-invalid' : ''}`}
                onChange={(items) => {
                    const arr = items.map(element => element.value).sort((a, b) =>
                        a - b
                    );
                    props.onChange(arr)
                }}
                defaultValue={props.value ? props.options.filter(element =>
                    [...props.value].includes(element.value)
                ) : []}
                isMulti
                options={props.options}
            />
            <div className='custorm-invalid-feedback'>{props.err?.message}</div>
        </div>
    );
};

export default AnimatedMultiSelect;
