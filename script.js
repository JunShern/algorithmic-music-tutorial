// Handle tabs
function openPage(pageName, elmnt, locationHash) {
    // Change location hash if we are clicking on the tabs
    var locationHash = locationHash || false;
    if (locationHash) {
        window.location.hash = locationHash;
    }
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
        nav_buttons[i].style.borderBottom = "0.2em solid black";
    }
    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = "white";
    elmnt.style.color = "black";
    elmnt.style.border = "0.2em solid black";
    elmnt.style.borderBottom = "none";
}

function startStopIframe(sketchId, buttonElement) {
    if (document.getElementById(sketchId).querySelector('iframe').src.includes("empty_iframe.html")) {
        // Kill all other iframes
        var iframes = document.querySelectorAll('iframe');
        for (var i=0; i<iframes.length; i++) {
            if (!iframes[i].src.includes("empty_iframe.html")) {
                iframes[i].src = "empty_iframe.html";
            }
        }
        var iframe_buttons = document.querySelectorAll('.iframe-button');
        for (var i=0; i<iframe_buttons.length; i++) {
            // Change button text
            iframe_buttons[i].innerHTML = 'RUN';
            iframe_buttons[i].style.backgroundColor = 'greenyellow';
        }
        // Revive only this one
        document.getElementById(sketchId).querySelector('iframe').src = "sketches/" + sketchId + "/index.html";
        // Change button text
        buttonElement.innerHTML = 'STOP';
        buttonElement.style.backgroundColor = 'lightcoral';
    } else {
        document.getElementById(sketchId).querySelector('iframe').src = "empty_iframe.html";
        // Change button text
        buttonElement.innerHTML = 'RUN';
        buttonElement.style.backgroundColor = 'greenyellow';
    }
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

    // Add scrollwatchers to all sketches
    var sketch_containers = document.querySelectorAll('.full-width');
    for (var i=0; i<sketch_containers.length; i++) {
        var elementWatcher = scrollMonitor.create(sketch_containers[i]);
        elementWatcher.fullyEnterViewport(function() {
            var div = this.watchItem;
            var iframe = div.querySelector('iframe');
            iframe.onload = function() { this.contentWindow.focus() };
            var button = div.querySelector('.iframe-button');
            button.click();
        });
    }

    // Open the default tab
    if (window.location.hash.includes("composition")) {
        openPage("composition_tab", document.getElementById("composition_button"));
    } else {
        openPage("about_time_tab", document.getElementById("time_button"));
    }
}, false);