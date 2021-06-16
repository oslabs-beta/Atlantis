import React, { useState, useEffect, useRef } from 'react';
import TypeField from './TypeField.js';
import DropdownItem from './DropdownItem.js';
// imported images

import Plus from '../assets/plus_light.svg';

/*
  - This component renders each field in your query
  - It is called from DemoInput in the container folder
  - It is recursively called when you add the "cities" field in the "countries" query
*/

const UsersFields = (props) => {
  console.log("UsersFields");
  const { usersFields, type, outputFunction, modifyUsersFields } = props; // import props

  const [queryList, setQueryList] = useState(usersFields);
  const [availableList, setAvailableList] = useState([]);
  const [plusDropdown, togglePlusDropdown] = useState(false);

  // ====================================================================== //
  // ======= Functionality to close dropdowns when clicking outside ======= //
  // ====================================================================== //

  // attach "ref = {ref}" to the dropdown
  const ref = useRef(null);

  // makes it so when you click outside of a dropdown it goes away
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      togglePlusDropdown(false);
    }
  };

  // listens for clicks on the body of the dom
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  // =================================== //
  // ======= Other functionality ======= //
  // =================================== //

  // initializes the available fields list based on the initialField prop
  useEffect(() => {
    setAvailableList(convertIntoList(userFields));
  }, []);

  const userType = [
    { user_id: 'string' },
    // { id: "string" }, // commented out because we're making it an immutable field
    { name: 'string' },
   
  ];

  // Takes the items list and returns something like: [ id, name, capital, cities ]
  const convertIntoList = (itemList) => {
    
    const output = itemList.map((obj) => Object.keys(obj)[0]);
    return output;
  };

  // ==================================== //
  // ======= Buttons Functionality ====== //
  // ==================================== //

  //======= Minus button ========//
  function deleteItem(item) {
    // execute a function back in query fields to update list, which in turn will update this component
    console.log("DELTE");
    modifyUsersFields(item, 'delete');

    // remove item from queryList
    const newList = [...queryList];
    const index = newList.indexOf(item);
    newList.splice(index, 1);
    setQueryList(newList);
    // add item to availableList
    const newAvailableList = [...availableList];
    newAvailableList.push(item);
    setAvailableList(newAvailableList);
    // calls a function that prepares the query for actually being sent
    outputFunction(0, newList, 0);
  }

  //======= Plus button ========//
  function addItem(item) {
    console.log("ADD ITEM HIT!")
    modifyUsersFields(item, 'add');

    // add item to queryList
    const newList = [...queryList];
    newList.push(item);
    setQueryList(newList);
    // remove item from availableList
    const newAvailablelist = [...availableList];
    const index = newAvailablelist.indexOf(item);
    newAvailablelist.splice(index, 1);
    setAvailableList(newAvailablelist);
    // close the plus dropdown
    togglePlusDropdown(false);
    // call a function that prepares the query for actually being sent
    outputFunction(0, newList, 0);
    console.log("ADD ITEM exist!")
  }

  // Fires when you click plus -- only show plus dropdown if there's something in the list
  const dropPlus = () => {
    if (availableList.length > 0) {
      togglePlusDropdown(!plusDropdown);
    }
  };

  // =========================== //
  // ===== RENDER / RETURN ===== //
  // =========================== //

  // prepare some characters
  const ob = '{',
    cb = '}',
    tab = <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>,
    space = <span>&nbsp;</span>;

  // Render the query list to the DOM
  const queriedItems = queryList.map((item, i) => {
    return (
      <TypeField
        item={item}
        key={`${type}Field${i}`}
        deleteItem={deleteItem}
        subQuery={true}
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
      {tab}
      {/* Render plus sign, which opens a dropdown */}
      {/* Added {!!availableList.length &&} so that when the availableList's length is 0, it corroses from zero to false so it doesn't render the plus sign */}
      {!!availableList.length && (
        <button className="plus-button" onClick={dropPlus}>
          <div className="plus-minus-icons">
            {/* <img src={Plus} /> */}
            <img src={Plus} className="hover-button" />
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

export default UsersFields;
