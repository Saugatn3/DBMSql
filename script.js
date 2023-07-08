function fSubmit(event){
    event.preventDefault();
    var textValue = document.getElementById("tinputField").value;
    var inputValue = document.getElementById("iinputField").value;
    var addressValue = document.getElementById("ainputField").value;
    var dobValue = document.getElementById("dinputField").value.toLocaleDateString();

     fetch(`/submit?name=${textValue}&stid=${inputValue}&address=${addressValue}&dob=${dobValue}`)
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
     document.getElementById("ainputField").value =''
     document.getElementById("dinputField").value =''
    console.log("Submitted name:", textValue);
}

function toggleData() {
  const dataTable = document.getElementById('data-table');
  const hideButton = document.getElementById('hidebutton');
  const viewButton = document.getElementById('viewbutton');
  if (dataTable.classList.contains('hidden')) {
    dataTable.classList.remove('hidden');
  } else {
    dataTable.classList.add('hidden');
  }
  if (hideButton.classList.contains('hidden')) {
    hideButton.classList.remove('hidden');
  } else {
    hideButton.classList.add('hidden');
  }
  if (viewButton.classList.contains('hidden')) {
    viewButton.classList.remove('hidden');
  } else {
    viewButton.classList.add('hidden');
  }
}

function viewData(event) {
  //event.preventDefault();
  toggleData();
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
        const addressCell = document.createElement('td');
        const dobCell = document.createElement('td');
        const actionCell = document.createElement('td');

        idCell.textContent = row.id;
        nameCell.textContent = row.name;
        addressCell.textContent=row.address;
        const dobDate = new Date(row.dob);
        const formattedDob = dobDate.toLocaleDateString();
        dobCell.textContent = formattedDob;

        const deleteButton = createDeleteButton(row.id); 
        const editButton = createEditButton(row);
        actionCell.appendChild(deleteButton); 
        actionCell.appendChild(editButton); 

        newRow.appendChild(idCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(addressCell);
        newRow.appendChild(dobCell);
        newRow.appendChild(actionCell); 

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

function createEditButton(row) {
  const button = document.createElement('button');
  button.textContent = 'Edit';
  button.addEventListener('click', function() {
    editData(row);
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

function editData(row) {
    const editForm = document.getElementById('edit-form');
    const editIdInput = document.getElementById('edit-id-input');
    const editNameInput = document.getElementById('edit-name-input');
    const editAddressInput = document.getElementById('edit-address-input');
    const editDobInput = document.getElementById('edit-dob-input');
    const mainForm = document.getElementById('main-form');
    const addText = document.getElementsByClassName('addtext')[0];

    editIdInput.value = row.id;
    editNameInput.value = row.name;
    editAddressInput.value = row.address;
    const dobDate = new Date(row.dob);
    const formattedDob = dobDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    editDobInput.value = formattedDob;
    mainForm.classList.add('hidden');
    editForm.classList.remove('hidden');
    addText.textContent='EDIT DATA';
  }

  function saveData() {
    const editIdInput = document.getElementById('edit-id-input').value;
    const editNameInput = document.getElementById('edit-name-input').value;
    const editAddressInput = document.getElementById('edit-address-input').value;
    const editDobInput = document.getElementById('edit-dob-input').value;
  
    const requestData = {
      name: editNameInput,
      address: editAddressInput,
      dob: editDobInput
    };
  
    fetch(`/edit/${editIdInput}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Data Updated') {
          document.getElementById('edit-form').classList.add('hidden');
          viewData();
        }
      })
      .catch(error => console.log(error));
      viewData();
  }
  
