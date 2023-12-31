function openAddDevicePage() {
    console.log("its working");
  }


window.onload = function() {
    loadPage('components','Component Stock')
};

// Function to load content dynamically
function loadPage(page,pageTitle) {
    var pagePath = "./pages/" + page;

    // Fetch the content for the specified page
    fetch(pagePath + '.html')
        .then(response => response.text())
        .then(html => {
            // Update the content area with the loaded HTML
            document.getElementById('content').innerHTML = html;

            //put the page name as title
            document.getElementById('pageTitle').textContent = pageTitle;
        })
        .catch(error => console.error('Error loading page:', error));
}


