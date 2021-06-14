const buttonAdd = document.getElementById('task-button');
const inputField = document.getElementById('task');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM!');
  const Taskdiv = document.createElement('div');
  Taskdiv.innerHTML = 'from the JS script';
  Taskdiv.id = 'task-div';
  document.body.append(Taskdiv);
  document.getElementById('query-button').addEventListener('click', () => {
    const query = document.getElementById('task');
    const queryValue = query.value;
    // assign the value of the input to body so we can send it to the DB.
    const body = { query: queryValue };
    console.log(body);
    fetch('/atlantis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
    .then(data=> console.log("data found in cache", data));
  });
  
});
