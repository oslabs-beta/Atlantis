import React, { useState, useEffect } from 'react';
import MinusDark from '../assets/minus_dark.svg'
import MinusHover from '../assets/minus_light.svg'
// import images
// import MinusHover fro

/* 
  component that renders each string-type field in our query
*/

const TypeField = (props) => {
  const { item, deleteItem, subQuery } = props;

  // Below is so that we don't render the minus button for the id field
  const [itemIsId, setItemIsId] =useState(false);
  useEffect(() => {
    if (item === 'id') setItemIsId(true);
  }, [itemIsId]);

  const tab = <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>,
    space = <span>&nbsp;</span>;

  // note: the "subQuery" tags are conditionally rendered only when we're in the cities field INSIDE the countries query
  return (
    <>
      <div className="queryLine">
        {tab}
        {tab}
        {subQuery && <>{tab}</>}
        {/* Generate minus button */}
        {/* Added {itemIsId && <>{space}{space}</>} so all the items are aligned vertically */}
        {itemIsId && (
          <>
            {space}
            {space}
          </>
        )}
        {!itemIsId && (
          <button className="minus-button" onClick={() => deleteItem(item)}>
            <div className="plus-minus-icons">
              <img src={MinusDark} />
              <img src={MinusHover} className="hover-button" />
            </div>
          </button>
        )}
        {space}
        {item}
      </div>
    </>
  );
};

export default TypeField;
