var step = 1;
var is_notified = false;
var arbox;

document.addEventListener('DOMContentLoaded', function () {
    arbox = document.querySelector('.arbox');
    

    adjustVideoSize();
});

function adjustVideoSize() {
    var video = document.querySelector('a-scene').querySelector('video');
    if (video) {
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.transform = 'none';
        video.style.zIndex = '99999';
        video.style.border = 'none';
        video.style.objectFit = 'cover'; // 确保视频覆盖整个屏幕
    } else {
        setTimeout(adjustVideoSize, 500);
    }
}



AFRAME.registerComponent('image-tracker-1', {
    init: function () {
        console.log("image-tracker-1 init");
    },
    tick: function() {
        if (this.el.object3D.visible == true) {
            console.log("image-tracker-1 detected");
            arbox.style.display = "block";
            step = 2;
            alert("成功辨識封面1");
        }
    }
});

AFRAME.registerComponent('image-tracker-2', {
    init: function () {
        console.log("image-tracker-2 init");
    },
    tick: function() {
        if (this.el.object3D.visible == true) {
            console.log("image-tracker-2 detected");
            if (step != 2 && !is_notified) {
                is_notified = true;
                alert("請先掃描封面辨識點");
            }else{
                alert("成功辨識封面2");
            }
        }
    }
});