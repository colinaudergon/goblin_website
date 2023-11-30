//Server init
const express = require('express');
const app = express();
const port = 3000;

//database init
const Datastore = require('nedb');
const component_database = new Datastore('component_database.db');
component_database.loadDatabase();

//multer init
const multer = require('multer');
// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage: storage });
const upload = multer({ dest: 'uploads/' });
const file_database = new Datastore('file_database.db');

//XLSX init
const xlsx = require('xlsx');

file_database.loadDatabase();

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

// GET endpoint to retrieve all components
app.get('/api/components', (request, response) => {
  console.log("GET request for components");
  // Retrieve all components from the database
  component_database.find({}, (err, components) => {
      if (err) {
          console.error(err);
          response.json({ result: "Error" });
      } else {
          console.log(components);
          response.json(components);
      }
  });
});

// data base register component
app.post('/api/components', (request, response) => {
  try {
    // Fetch the current count of entries in the database
    component_database.count({}, (err, count) => {
      if (err) {
        console.error(err);
        response.json({ result: "Error" });
        return;
      }

      console.log(request.body);

      // Increment the count for the new component
      const data = { entryNumber: count + 1, ...request.body };

      // Insert the new component into the database
      component_database.insert(data);

      response.json({ result: "success" });
    });
  } catch (error) {
    console.log(error);
    response.json({ result: "Error" });
  }
});

app.post('/api/components/edit', (request, response) => {
  console.log("EDIT REQUEST!!!")
  try {
    const componentId = request.body.componentId;
    const updatedData = request.body.updatedData;

    const compdName =request.body.compName ;
    const compBuyer = request.body.compBuyer;
    const compQty = request.body.compQty;
    const compPrice =request.body.compPrice;
    const compPurchaseDate = request.body.compPurchaseDate;
    const compLoc =request.body.compLoc; // Modify as needed
    const compType = request.body.compType;
    const compSupplierNbr = request.body.compSupplierNbr;
    const compSupplier = request.body.compSupplier;
    const compDatasheet = request.body.compDatasheet; // Modify as needed
    const compDesc = request.body.compDesc;

    // Construct the component object
    const component = {
      compdName,
      compBuyer,
      compQty,
      compPrice,
      compPurchaseDate,
      compLoc,
      compType,
      compSupplierNbr,
      compSupplier,
      compDatasheet,
      compDesc,
    };

    // Find the corresponding component by ID and update its values
    component_database.update({ _id: componentId }, { $set: component }, {}, (err, numUpdated) => {
      if (err) {
        console.error(err);
        response.json({ result: "Error" });
        return;
      }

      console.log(`${numUpdated} component(s) updated successfully`);

      response.json({ result: "success" });
    });
  } catch (error) {
    console.log(error);
    response.json({ result: "Error" });
  }
});


//data base register component list  
app.post('/api/upload', upload.single('file'), (request, response) => {
  console.log("I have a file upload request!");

  try {
      const file = request.file;

      const commandNbr = request.body.commandNbr;
      const supplier = request.body.supplier;
      const commandBuyer = request.body.commandBuyer;
      const purchaseDate = request.body.purchaseDate;
     
      response.json({ result: "success" });
      
      fileExtension = file.originalname.split(".");
      switch(fileExtension[1]){
        case "xls":
          console.log(fileExtension[1]);
          file_database.insert(file);
          handleXlsx(file,commandBuyer,purchaseDate,supplier);
          break;
        case "csv":
          console.log(fileExtension[1]);
          file_database.insert(file);
          handleCsv(file);
          break;
          default:
            break;
      }

  } catch (error) {
      console.error(error);
      response.json({ result: "Error" });
  }
});

// const data = {compName,compBuyer,compQty,compPrice,compPurchaseDate,compLoc,compType,compSupplierNbr,compSupplier,compDatasheet,compDesc};
function handleXlsx(file,commandBuyer,purchaseDate,supplier) {
  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Fetch the current count of entries in the component database
  component_database.count({}, (err, count) => {
    if (err) {
      console.error(err);
      return;
    }

    // Iterate through each row in the sheetData
    sheetData.forEach(row => {
      // Extract values from the row (modify as needed based on your XLSX structure)
      const compName = row['Mfr. No:'];
      const compBuyer = commandBuyer;
      const compQty = row['Order Qty.'];
      const compPrice = row['Price (CHF)'];
      const compPurchaseDate = purchaseDate;
      const compLoc = 'none'; // Modify as needed
      const compType = 'none'; // Modify as needed
      const compSupplier = supplier;
      const compSupplierNbr = row['Mouser No:'];
      const compDatasheet = 'none'; // Modify as needed
      const compDesc = row['Desc.:'];

      // Construct the component object
      const component = {
        entryNumber: count + 1,
        compName,
        compBuyer,
        compQty,
        compPrice,
        compPurchaseDate,
        compLoc,
        compType,
        compSupplier,
        compSupplierNbr,
        compDatasheet,
        compDesc,
      };

      // Increment the count for the next component
      count++;

      // Insert the component into the database
      component_database.insert(component);

      console.log(component);
    });
  });
}

function handleCsv(file){
  file_database.insert(file);
}