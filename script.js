// Handle tabs
function openPage(pageName, elmnt) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab_content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Remove the background color of all tablinks/buttons
    nav_buttons = document.getElementsByClassName("nav-item");
    for (i = 0; i < nav_buttons.length; i++) {
        nav_buttons[i].style.backgroundColor = "#eee";
        nav_buttons[i].style.color = "grey";
        nav_buttons[i].style.border = "none";
        nav_buttons[i].style.borderBottom = "0.3em solid black";
    }
    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = "white";
    elmnt.style.color = "black";
    elmnt.style.border = "0.3em solid black";
    elmnt.style.borderBottom = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle collapsibles
    var collapsibleDivs = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < collapsibleDivs.length; i++) {
        collapsibleDivs[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
            content.style.maxHeight = null;
            } else {
            content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }

    // Open the default tab
    // document.getElementById("default_open").click();
}, false);