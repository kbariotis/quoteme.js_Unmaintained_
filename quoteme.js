(function(){

    /*
     * Determine which is your text container tha you
     * want the script to run on click of the mouse.
     *
     * If it runs on whole page it's going to be ugly
     *
     */
    var container            = ".article",
        pathToImg            = "./tw.png",  /* /path/to/tw.png */
        viaParam             = "kbariotis", /* via param on twitter post */
        twShareUrl           = "https://twitter.com/intent/tweet?",
        shareUrl             = "",
        floatElement         = null, /* Anchor Element represents Share button */
        mouseUpXPosition     = null, /* Keep notes about where selection start and ends */
        mouseDownXPosition   = null;

    /* Initialization happens here */
    function init() {

        floatElement = document.createElement("a");
        floatElement.href = "#";
        document.body.appendChild(floatElement);

        styleShareElement();

        bindUIEvents();
    };

    function bindUIEvents() {
        // bindEvent(window, "mouseup", getSelection);
        // bindEvent(window, "mousedown", setMouseDownPosition);
        bindEvent(document.querySelector(container), "mouseup", getSelection);
        bindEvent(document.querySelector(container), "mousedown", setMouseDownPosition);
        bindEvent(floatElement, "click", openPopup);
    };

    /* Keep track of where selection started */
    function setMouseDownPosition(e) {
        mouseDownPosition = e.pageX;
    };

    /* Get selected text, edit it before open Share Pop Up*/
    function getSelection(e) {

        /* Keep track of where selection ended */
        mouseUpPosition = e.pageX;

        var t = document.getSelection();

        if(!t.toString() || e.target.tagName === "A"){
          floatElement.style.display = "none";
          return false;
        }

        var selectedText = t.toString();

        /*
         * First, calculate the length of link and via nickname,
         * then cut the selected on the remaining characters
         */
        var length = parseInt(viaParam.length) +
                     parseInt(document.location.href.length) + 7;
                     /* 7 for the `via` word, some spaces and @*/

        if(parseInt(selectedText.length) + length > 140) {
            /* Remove new lines */
            selectedText = selectedText.substring(0,135 - parseInt(length));
        }

        /* add `...` and `"` */
        selectedText = "\"" + selectedText.replace(/(\r\n|\n|\r)/gm,"") + "...\"";

        /* Glue the pieces together */
        shareUrl = twShareUrl;
        shareUrl += "text=" + encodeURIComponent(selectedText);
        shareUrl += "&via=" + encodeURIComponent(viaParam);
        shareUrl += "&url=" + document.location;

        displayShareButton(t);

    };

    /* Display the Share Button and position it in the screen */
    function displayShareButton(t) {
        floatElementHeight = parseInt(floatElement.style.height);

        floatElement.style.left = (mouseDownPosition + mouseUpPosition)/2
            - floatElementHeight/2 + "px";

        floatElement.style.top = Math.min(
            t.anchorNode.parentElement.offsetTop,
            t.focusNode.parentElement.offsetTop ) - floatElementHeight + "px";

        floatElement.style.display = "block";
    };

    /* Style the Share Button */
    function styleShareElement() {
        floatElement.style.position         = "absolute";
        floatElement.style.display          = "none";
        floatElement.style.width            = "40px";
        floatElement.style.height           = "40px";
        floatElement.style.background       = "rgba(0,0,0,0.5)";
        floatElement.style.backgroundImage  = "url(" + pathToImg + ")";
        floatElement.style.backgroundRepeat = "no-repeat";
        floatElement.style.backgroundPosition = "center";
        floatElement.style.borderRadius     = "4%";
        floatElement.style.pointer          = "cursor";
    };

    /* Create and open a popup */
    function openPopup(e) {
        e.preventDefault();

        var width  = 575,
            height = 400,
            left   = (window.innerWidth - width)  / 2,
            top    = (window.innerHeight - height) / 2,
            url    = shareUrl,
            opts   = 'status=1' +
                     ',width='  + width  +
                     ',height=' + height +
                     ',top='    + top    +
                     ',left='   + left;

        window.open(url, 'twitter', opts);
    };

    /* Events Binding Method */
    function bindEvent(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on'+type, handler);
        }
    };

    return init();

}());