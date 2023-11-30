window.addEventListener("load", (event) => {
  fetchComponents();
});

//Turn to async?
function fetchComponents() {
  fetch('/api/components')
    .then(response => response.json())
    .then(components => {
      let tableBody = document.querySelector('#componentTable tbody');
      tableBody.innerHTML = '';
      components.forEach(component => {
        const row = document.createElement('tr');
        // Populate the row with component properties
        // compSupplierNbr
        row.innerHTML = `<td>${component.entryNumber} </td>
                         <td>${component.compName}</td>
                         <td>${component.compType}</td>
                         <td>${component.compQty}</td>
                         <td>${component.compBuyer}</td>
                         <td>${component.compSupplier}</td>
                         <td>${component.compSupplierNbr}</td>
                         <td>${component.compPurchaseDate}</td>
                         <td>${component.compDatasheet}</td>
                         <td>${component.compPrice}</td>
                         <th style="text-align: center;">${(component.compQty * parseFloat(component.compPrice.match(/\d+\.\d+/)[0])).toFixed(2)}</th>
                         <td><button class="ellipsisbtn" onclick="openEditPopup('${component._id}','${component.compName}','${component.compType}','${component.compQty}','${component.compBuyer}','${component.compPurchaseDate}','${component.compDatasheet}','${component.compPrice}','${component.compDesc}','${component.compSupplierNbr}','${component.compSupplier}')"> <i class="fa fa-ellipsis-v"></i></button></td>`;

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching components:', error));
}

//

//TODO: IMPLEMENT THIS FUNCTION
function searchComponents() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("componentSearchBar");
  filter = input.value.toUpperCase();
  table = document.getElementById("deviceTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


function openEditPopup(componentId, componentName, componentType, componentQty, componentBuyer, componentPurchaseDate, componentDatasheet, componentPrice, componentDesc, compSupplierNbr, componentSupplier) {

  console.log('Open edit popup for component ID:', componentId);

  openPopup("edit");

  //Set title with component name
  const title = document.getElementById("editComponentModalTitle");
  title.textContent = "Edit component: " + componentName;

  const nameInput = document.getElementById("edit_component_name");
  const typeDropDown = document.getElementById("edit_typeOfComponent");
  const buyerDropdown = document.getElementById("edit_component_buyer");
  const qtyInput = document.getElementById("edit_component_quantity");
  const purchDateInput = document.getElementById("edit_component_purchase_date");
  const priceInput = document.getElementById("edit_component_price");
  const datashInput = document.getElementById("edit_component_datasheet");
  const supplyerNbr = document.getElementById("edit_component_supplier_number");
  const supplierDropdown = document.getElementById("edit_component_supplier");
  const description = document.getElementById("edit_component_desc");
  // Not used yet
  // const locationEdit = document.getElementById("edit_component_location");

  nameInput.value = componentName;
  //Set component datasheet
  datashInput.value = componentDatasheet;
  //Set component price
  priceInput.value = componentPrice;
  //Set component purchase date
  purchDateInput.value = componentPurchaseDate;
  //set component qty:
  qtyInput.value = componentQty;
  //set supplyer number
  supplyerNbr.value = compSupplierNbr
  //Set description:
  if (componentDesc) {
    description.value = componentDesc;
  }
  //set component buyer:
  for (let i = 0; i < buyerDropdown.options.length; i++) {
    if (buyerDropdown.options[i].value === componentBuyer) {
      buyerDropdown.options[i].selected = true;
      break;
    }
  }
  //set component type
  for (let i = 0; i < typeDropDown.options.length; i++) {
    if (typeDropDown.options[i].value === componentType) {
      typeDropDown.options[i].selected = true;
      break;
    }
  }
  //set component supplier
  for (let i = 0; i < supplierDropdown.options.length; i++) {
    if (supplierDropdown.options[i].value === componentSupplier) {
      supplierDropdown.options[i].selected = true;
      break;
    }
  }

  const editButton = document.querySelector('.submitBtn');
  editButton.setAttribute('data-component-id', componentId);

}

async function addComponentToDatabase() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  try {
    const compName = document.getElementById("component_name").value;
    const compBuyer = document.getElementById("component_buyer").value;
    const compQty = document.getElementById("component_quantity").value;
    const compPrice = document.getElementById("component_price").value;
    const compPurchaseDate = document.getElementById("component_purchase_date").value;
    const compLoc = document.getElementById("component_location").value;
    const compType = document.getElementById("typeOfComponent").value;
    const compSupplier = document.getElementById("component_supplier").value;
    const compSupplierNbr = document.getElementById("component_supplier_number").value;
    const compDatasheet = document.getElementById("component_datasheet").value;
    const compDesc = document.getElementById("component_desc").value;

    const data = { compName, compBuyer, compQty, compPrice, compPurchaseDate, compLoc, compType, compSupplierNbr, compSupplier, compDatasheet, compDesc };
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    };
    response = await fetch('/api/components', options)
    const result = await response.json();
    console.log("Success:", result);
    fetchComponents();
  }
  catch (error) {
    console.error("Error:", error);
  }
}

async function addComponentListToDatabase() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  try {

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const commandNbr = document.getElementById("command_number").value;
      const supplier = document.getElementById("command_supplier").value;
      const commandBuyer = document.getElementById("command_buyer").value;
      const commandDate = document.getElementById("command_purchase_date").value;

      console.log(document.getElementById("command_buyer").value);

      formData.append('commandNbr', commandNbr);
      formData.append('supplier', supplier);
      formData.append('commandBuyer', commandBuyer);
      formData.append('purchaseDate', commandDate);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('File uploaded successfully:', data);
      // Handle the response from the server
      fetchComponents();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editComponentInDatabase(componentId) {
  try {
    const compName = document.getElementById("edit_component_name").value;
    const compBuyer = document.getElementById("edit_component_buyer").value;
    const compQty = document.getElementById("edit_component_quantity").value;
    const compPrice = document.getElementById("edit_component_price").value;
    const compPurchaseDate = document.getElementById("edit_component_purchase_date").value;
    const compLoc = document.getElementById("edit_component_location").value;
    const compType = document.getElementById("edit_typeOfComponent").value;
    const compSupplier = document.getElementById("edit_component_supplier").value;
    const compSupplierNbr = document.getElementById("edit_component_supplier_number").value;
    const compDatasheet = document.getElementById("edit_component_datasheet").value;
    const compDesc = document.getElementById("edit_component_desc").value;

    const data = { componentId, compName, compBuyer, compQty, compPrice, compPurchaseDate, compLoc, compType, compSupplierNbr, compSupplier, compDatasheet, compDesc };
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    };
    response = await fetch('/api/components/edit', options)
    const result = await response.json();
    console.log("Success:", result);
    fetchComponents();
  } catch (error) {
    console.error("Error:", error);
  }
}

function edit() {
  const componentId = document.querySelector('.submitBtn').getAttribute('data-component-id');
  editComponentInDatabase(componentId);
}


