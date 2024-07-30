let is_viewed = false;

// 这个函数模拟设置 `is_viewed` 为 true，当视频观看完毕时调用
function markAsViewed() {
    is_viewed = true;
}

document.getElementById('nextPage').addEventListener('click', function() {
    if (is_viewed) {
        window.location.href = 'qa01.html';
    } else {
        alert('請觀看完影片');
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var iframe1 = document.getElementById('youtubeVideo1');
    var iframe2 = document.getElementById('youtubeVideo2');
    var player1, player2;
    var video1Completed = false;
    var video2TimeWatched = false;

    function onYouTubeIframeAPIReady() {
        player1 = new YT.Player(iframe1, {
            events: {
                'onStateChange': onPlayerStateChange1
            }
        });

        player2 = new YT.Player(iframe2, {
            events: {
                'onStateChange': onPlayerStateChange2
            }
        });
    }

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function onPlayerStateChange1(event) {
        if (event.data == YT.PlayerState.ENDED) {
            video1Completed = true;
            checkBothVideosCompleted();
        }
    }

    function onPlayerStateChange2(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            setTimeout(checkVideo2Time, 30000); // 30秒
        }
    }

    function checkVideo2Time() {
        if (player2.getCurrentTime() >= 30) {
            video2TimeWatched = true;
            checkBothVideosCompleted();
        }
    }

    function checkBothVideosCompleted() {
        if (video1Completed && video2TimeWatched) {
            showPopup();
        }
    }

    function showPopup() {
        alert("第一部影片播放完畢，且第二部影片已經觀看30秒！");
        is_viewed = true;
    }

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
});