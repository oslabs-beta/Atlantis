import React from 'react';

/*
  A reusable component for all dropdowns in the query
*/

const DropdownItem = (props) => {
  console.log("hitting a dropdown item!");
  const { func, item } = props;
  return (
    <>
      <div className="dropdown-items" onClick={() => func(item)}>
        {item}
      </div>
    </>
  );
};

export default DropdownItem;
