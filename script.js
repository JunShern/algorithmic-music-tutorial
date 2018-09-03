function startStopIframe(sketchId, buttonElement) {
    if (document.getElementById(sketchId).querySelector('iframe').src.includes("empty_iframe.html")) {
        // Kill all other iframes
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            var isNotEmpty = !(iframes[i].src.includes("empty_iframe.html"));
            var isNotBannerFrame = !(iframes[i].classList.length > 0);
            if (isNotEmpty && isNotBannerFrame) {
                iframes[i].src = "empty_iframe.html";
            }
        }
        var iframe_buttons = document.querySelectorAll('.iframe-button');
        for (var i = 0; i < iframe_buttons.length; i++) {
            // Change button text
            iframe_buttons[i].innerHTML = 'RUN';
            iframe_buttons[i].style.backgroundColor = 'greenyellow';
        }
        // Revive only this one
        var sketch_iframe = document.getElementById(sketchId).querySelector('iframe');
        sketch_iframe.src = "sketches/" + sketchId + "/index.html";
        sketch_iframe.contentWindow.focus();
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

document.addEventListener('DOMContentLoaded', function () {
    // Add scrollwatchers to all sketches
    var sketch_containers = document.querySelectorAll('.sketch-container');
    for (var i = 0; i < sketch_containers.length; i++) {
        var elementWatcher = scrollMonitor.create(sketch_containers[i]);
        elementWatcher.enterViewport(function () {
            var div = this.watchItem;
            var button = div.querySelector('.iframe-button');
            button.click();
        });
    }
}, false);