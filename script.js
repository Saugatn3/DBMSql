function fSubmit(event){
    event.preventDefault();
    var textValue = document.getElementById("tinputField").value;
    var inputValue = document.getElementById("iinputField").value;
     fetch(`/submit?name=${textValue}&stid=${inputValue}`)
     .then(response => response.text())
     .then(data => {
       console.log(data);
    })
     .catch(error => console.log(error));
     document.getElementById("tinputField").value =''
     document.getElementById("iinputField").value =''

    console.log("Submitted name:", textValue);
}

function viewData(event){
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

            idCell.textContent = row.id;
            nameCell.textContent = row.name;

            newRow.appendChild(idCell);
            newRow.appendChild(nameCell);

            tableBody.appendChild(newRow);
          });
        })
        .catch(error => console.log(error));
   }
