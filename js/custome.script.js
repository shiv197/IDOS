



(function ($) {

    $(".mobile_menu").click(function () {
        $("#mobileMenuLinks").toggleClass("active_menu");
    });

    $('.propos').click(function () {
        $('body').addClass('dark-theam');
    });

})(jQuery);


// Mobile Menu

function showHideDiv(ele) {

    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
        if (srcElement.style.right != 0) {
            srcElement.style.right = "-100%";
        }
        else {
            srcElement.style.right = 0;
        }
        return
    }
}



function findObjectCoords(mouseEvent) {
    var obj = document.getElementById("project");
    var obj_left = 0;
    var obj_top = 0;
    var xpos;
    var ypos;
    while (obj.offsetParent) {
        obj_left += obj.offsetLeft;
        obj_top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    if (mouseEvent) {
        //FireFox
        xpos = mouseEvent.pageX;
        ypos = mouseEvent.pageY;
    }
    else {
        //IE
        xpos = window.event.x + document.body.scrollLeft - 10;
        ypos = window.event.y + document.body.scrollTop - 10;
    }
    xpos -= obj_left;
    ypos -= obj_top;
    
    document.getElementById("projectImg").style.transform  = "translate(" + xpos + "px, " + ypos + "px)";

}
document.getElementById("project").onmousemove = findObjectCoords;
