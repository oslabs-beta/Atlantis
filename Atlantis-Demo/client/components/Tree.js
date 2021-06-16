import React from "react";

import Tree from "react-tree-graph";

const data = {
  name: "Client",
  children: [
    {
      name: "GraphQL",
      description: "Request Response sent on single endpoint, only receiving what you asked for",
      free: true,
      children: [
        {
          name: "Server",
          description:
            "where the magic happens",
          free: true,
          children: [
            {
              name: "Atlantis Cache",
              description:
                "greatest npm package released",
              free: true,
              children: [
                {
                  name: "Pub/Sub",
                  description:
                    "single source of truth broker takes care of distributing new info",
                  free: true,
                  children: [
                    {
                      name: "Companies",
                      description:
                        "table",
                     
                      free: true
                    },
                    {
                      name: "Employees",
                      description:
                        "table",
                      free: true
                    },
                    {
                      name: "Projects",
                      description: "table",
                      free: true
                    }
                  ]
                }
              ]
            },
            {
              name: "Database",
              description:
                "For maximum flexibility, custom coding is the way to go. These libraries will lend a hand.",
              free: true
            }
          ]
        }
      ]
    }
  ]
};
// {
//   name: "Atlantis Cache",
//   gProps: {
//     onClick: (event, node) => alert(`Own Clicked ${node}!`),
//     onContextMenu: (event, node) => alert(`Own Right Clicked ${node}!`)
//   }
// },
// {
//   name: "Database",
//   gProps: {
//     onDoubleClick: (event, node) =>
//       alert(`Own onDoubleClick Clicked ${node}!`)
//   }
//}

//   ]
// };

function onClick(event, nodeKey) {
  alert(`Left clicked ${nodeKey}`);
}

function onRightClick(event, nodeKey) {
  event.preventDefault();
  alert(`Right clicked ${nodeKey}`);
}

let clicks = [];
let timeout;
let samenode;

function singleClick(event, node) {
  alert(`single click ${node}`);
}

function doubleClick(event, node) {
  alert(`doubleClick ${node}`);
}

function clickHandler(event, node) {
  event.preventDefault();
  clicks.push(new Date().getTime());
  window.clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    if (
      clicks.length > 1 &&
      clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250
    ) {
      doubleClick(event, node);
    } else {
      singleClick(event, node);
    }
  }, 250);
}

function mouseDown(event, node) {
  samenode = node;
  console.log(`mouse click down ${node}!`);
}

function mouseUp(event, node) {
  console.log(`mouse click up ${node}!`);
  if (samenode && samenode !== node) {
    alert(`${samenode} moved to ${node}`);
  }
}

export default function App() {
  return (
    <div className="tree-div">
    
      <h1>Follow the Data</h1>
        <h2>Flow of Request sent from Client to Server</h2>
      <Tree
        className="tree"
        data={data}
        height={200}
        width={600}
        margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
        gProps={{
          onClick: clickHandler,
          onContextMenu: onRightClick,
          onMouseDown: mouseDown,
          onMouseUp: mouseUp
        }}
        animated
        svgProps={{
          className: "custom",
          transform: 'rotate(90)'
        }}
      />
    </div>
  );
}
