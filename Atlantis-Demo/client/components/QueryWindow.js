import React, { useState, useEffect, useRef } from 'react';
import TypeField from './TypeField';
import DropdownItem from './DropdownItem';
import UsersFields from './UsersFields';
import Plus from '../assets/plus_light.svg';
import PlusHover from '../assets/plus_dark.svg';
const QueryWindow = (props) => {
    const { type, outputFunction } = props; // import props

    const [queryList, setQueryList] = useState(['id']);
    const [availableList, setAvailableList] = useState([]);
    const [plusDropdown, togglePlusDropdown] = useState(false);
    const [usersFields, setUsersFields] = useState(['id']);

    // ______________________________________________________________________ //
    // ________ Functionality to close dropdowns when you click away ________  //
    // ______________________________________________________________________  //

    // Attach "ref = {ref}" to the dropdown
    const ref = useRef(null);

    // Makes it so when you click outside of a dropdown it goes away
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
        togglePlusDropdown(false);
        }
    };

    // Listens for clicks on the greater dom
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
        document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    // ______________________________________________________________________  //
    // ______________ Functionality to initialize drop downs, etc ___________  //
    // ______________________________________________________________________  //

    // Initializes the available fields list
    useEffect(() => {
        setAvailableList(initialAvailableList());
    }, []);

    //__________  Lists of Fields __________  //

    const usersType = [
        { company_id: 'string' },
        // { id: "string" }, // commented out because we're making it an immutable field
        { name: 'string' },
        // { projects_id: 'string' },
    ];

    const companyType = [
        // { id: "string" },
        { name: 'string' },
        { description: 'string' }, 
        // { employees: [{'string'}] },// if field is array, point to the list of fields
    ];

    // Decides whether to populate dropdowns with Company or User fields, based on type prop
    const initialAvailableList = () => {
        if (type === 'Company') return convertIntoList(companyType);
        if (type === 'User') return convertIntoList(usersType);
    };

    // Takes the items list and returns something like: [ id, name, description, users ]
    const convertIntoList = (itemList) => {
        const output = itemList.map((obj) => Object.keys(obj)[0]);
        return output;
    };

    // ________________________________________________________________ //
    // ______________________Buttons Functionality_____________________ //
    // ________________________________________________________________ //


    function deleteItem(item) {
        // Remove item from queryList
        const newList = [...queryList];
        const index = newList.indexOf(item);
        newList.splice(index, 1);
        setQueryList(newList);
        // Add item to availableList
        const newAvailableList = [...availableList];
        newAvailableList.push(item);
        setAvailableList(newAvailableList);
        // Calls a function that prepares the query for actually being sent
        outputFunction(newList, 0, 0);
    }

    //________________Plus button ________________//
    function addItem(item) {
        // Add item to queryList
        const newList = [...queryList];
        newList.push(item);
        setQueryList(newList);
        // Remove item from availableList
        const newAvailablelist = [...availableList];
        const index = newAvailablelist.indexOf(item);
        newAvailablelist.splice(index, 1);
        setAvailableList(newAvailablelist);
        // Close the plus dropdown
        togglePlusDropdown(false);
        // Call a function that prepares the query for actually being sent
        outputFunction(newList, 0, 0);
    }

    // Add item to users field
    // Delete item from users field
    const modifyUsersFields = (item, addOrDelete) => {
        const newFields = [...usersFields];
        if (addOrDelete === 'add') {
        newFields.push(item);
        }
        if (addOrDelete === 'delete') {
        const index = newFields.indexOf(item);
        newFields.splice(index, 1);
        }
        setUsersFields(newFields);
    };

    // Fires when you click plus -- only show plus dropdown if there's something in the list
    const dropPlus = () => {
        if (availableList.length > 0) {
        togglePlusDropdown(!plusDropdown);
        }
    };

    // __________________________________________________________________ //
    // ________________________ RENDER / RETURN _________________________  //
    // __________________________________________________________________  //

    // Prepare some characters
    const ob = '{',
        cb = '}',
        tab = <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>,
        space = <span>&nbsp;</span>;

    // Render the query list to the DOM
    const queriedItems = queryList.map((item, i) => {
        // If querying "users", need to open up a new pair of brackets and recursively call TypeFields to generate users fields
        if (item === 'users') {
        return (
            <div key={i}>
            <div className="queryLine">
                {tab}
                {tab}
                <button className="minus-button" onClick={() => deleteItem(item)}>
                <div className="plus-minus-icons">
                    <img src={Minus} />
                    <img src={MinusHover} className="hover-button" />
                </div>
                </button>
                {space}users{space}
                {ob}
            </div>
            <div className="queryLine">
                <UsersFields
                usersFields={usersFields}
                type={'User'}
                outputFunction={outputFunction}
                modifyUsersFields={modifyUsersFields}
                />
            </div>
            <div className="queryLine">
                {tab}
                {tab}
                {cb}
            </div>
            </div>
        );
        }
        // Else (what normally happens)
        return (
        <TypeField
            item={item}
            key={`${type}Field${i}`}
            deleteItem={deleteItem}
            subQuery={false}
        />
        );
    });

    // Render dropdown menu from the available list
    const dropdown = availableList.map((item, i) => {
        return (
        <DropdownItem func={addItem} item={item} key={`Available${type}${i}`} />
        );
    });

    return (
        <>
        {/* List all the chosen query fields */}
        <div className="queryLinesContainer">{queriedItems}</div>
        {tab}
        {tab}
        {/* Render plus sign, which opens a dropdown */}
        {/* Added {!!availableList.length &&} so that when the availableList's length is 0, it corroses from zero to false so it doesn't render the plus sign */}
        {!!availableList.length && (
            <button className="plus-button" onClick={dropPlus}>
            <div className="plus-minus-icons">
                <img src={Plus} />
                <img src={PlusHover} className="hover-button" />
            </div>
            {plusDropdown && (
                <div className="dropdown-menu" ref={ref}>
                {dropdown}
                </div>
            )}
            </button>
        )}
        </>
     );
    };

    export default QueryWindow;