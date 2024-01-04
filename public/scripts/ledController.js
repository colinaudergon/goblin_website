

//Test connecting esp32 to db
async function ledCtrl(){
    try {
        const response = await fetch('/status/led/write', {
            method: 'POST',
            body: "Please change led status",
          });
        const data = await response.json();
        console.log('File uploaded successfully:', data);
    }catch(error){
        console.error(error);
    }
}


//list registered esp32
async function registeredEsp32(){
    try {
        const response = await fetch('/api/registeredDevices')
        const data = await response.json();
        console.log('Registered esp32: ', data);

        const esp32lbl=document.getElementById("registeredEsp32");
        esp32lbl.textContent = data.IP;  

    }catch(error){
        console.error(error);
    }
}


async function addESPToDatabase() {
    try {
        const deviceIP = document.getElementById("esp32_IP").value;
      const deviceName = document.getElementById("esp32_name").value;

      const data = { deviceIP, deviceName};
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      };
      response = await fetch('/api/registeredDevices/register_new', options)
      const result = await response.json();
      console.log("Success:", result);
          }
    catch (error) {
      console.error("Error:", error);
    }
  }