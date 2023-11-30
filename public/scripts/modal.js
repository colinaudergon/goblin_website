// JavaScript functions popup
let isModalOpen = false;

function openPopup(id) {
    document.getElementById(id).style.display = "block";
    isModalOpen = true;
}



// function closePopup() {
//     const closer = document.querySelector('.modal')
//     popup= document.getElementById(closer.id);
//     console.log(closer.id);
//     popup.style.display = "none";
//     isModalOpen = false;
// }

function closePopup() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.style.display = "none";
    });
    isModalOpen = false;
}

// Close the popup if the user clicks outside the modal
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {      
        console.log(event.target.id);
        if(event.target.id == modal.id){ 
            closePopup();
        }
    });

};

//Test the esc key, if esc is pressed, closes the popup
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', function (event) {
      if (isModalOpen && event.key === 'Escape') {
        closePopup();
      }
    });
  });