function fSubmit(event){
    event.preventDefault();
    var textValue = document.getElementById("tinputField").value;
    var inputValue = document.getElementById("iinputField").value;
     fetch(`/submit?name=${textValue}&stid=${inputValue}`)
     .then(response => response.json())
     .then(data => {
       console.log(data);
       if (data.message === 'Data Added') {
        viewData(); 
      }
    })
     .catch(error => console.log(error));
     document.getElementById("tinputField").value =''
     document.getElementById("iinputField").value =''

    console.log("Submitted name:", textValue);
}

function viewData(event) {
  //event.preventDefault();
  const dataTable = document.getElementById('data-table');
  dataTable.classList.remove('hidden');
  fetch(`/view`)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      data.forEach(row => {
        const newRow = document.createElement('tr');
        const idCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const actionCell = document.createElement('td');

        idCell.textContent = row.id;
        nameCell.textContent = row.name;

        const deleteButton = createDeleteButton(row.id); 
        const editButton = createEditButton(row.id);
        actionCell.appendChild(deleteButton); 
        actionCell.appendChild(editButton); 

        newRow.appendChild(idCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(actionCell); // Append action cell to the row

        tableBody.appendChild(newRow);
      });
    })
    .catch(error => console.log(error));
}

function createDeleteButton(id) {
  const button = document.createElement('button');
  button.textContent = 'Delete';
  button.addEventListener('click', function() {
    deleteData(id);
  });
  return button;
}

function createEditButton(id) {
  const button = document.createElement('button');
  button.textContent = 'Edit';
  button.addEventListener('click', function() {
    editData(id);
  });
  return button;
}

function deleteData(id){

    fetch(`/delete?id=${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data); 
      if (data.message === 'Deletion successful') {
        viewData(); // Call the function to refresh the data
      }
    })
    .catch(error => console.log(error));
}

function editData(id){

  fetch(`/edit?id=${id}`,{method:'PUT'})
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    if (data.message === 'Edit successful') {
      viewData(); // Call the function to refresh the data
    }
  })
  .catch(error => console.log(error));
}
