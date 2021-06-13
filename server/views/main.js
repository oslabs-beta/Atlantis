const buttonAdd = document.getElementById('task-button');
const inputField = document.getElementById('task');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM!');
  const Taskdiv = document.createElement('div');
  Taskdiv.innerHTML = 'from the JS script';
  Taskdiv.id = 'task-div';
  document.body.append(Taskdiv);
});

// when query clicked
console.log('HELLO');
document.getElementById('query-button').addEventListener('click', () => {
  const query = document.getElementById('task');
  const queryValue = query.value;
  // assign the value of the input to body so we can send it to the DB.
  const body = { query: queryValue };
  console.log(body);
  fetch('http://localhost:3000/atlantis/', {
    method: 'POST',
    headers: { 'Content-Type': 'Application/JSON' },
    body: JSON.stringify(body),
  }).then((res) => {
    console.log('Post fetch is successful', res);
    return res.json();
  });
});
