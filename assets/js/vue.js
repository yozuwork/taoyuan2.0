var app; // 全域變數
var arbox = document.createElement('div');
arbox.id = 'arbox';
document.body.appendChild(arbox);
var step = 0;
var is_notified = false;

document.addEventListener('DOMContentLoaded', function () {
    app = new Vue({
        el: '#app',
        data: {
            viewPage: 'home',
            slidesData: [
                'assets/s1.png',
                'https://thumb.ac-illust.com/30/306837819e76342840641fd1d53fd2f9_t.jpeg',
                'assets/s1.png'
            ],
            currentIndex: 0,
            is_viewed: false
        },
        methods: {
            showSlide(index) {
                this.currentIndex = index;
            },
            prevSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.slidesData.length) % this.slidesData.length;
            },
            nextSlide() {
                this.currentIndex = (this.currentIndex + 1) % this.slidesData.length;
            },
            changeViewPage(page) {
                this.viewPage = page;
            },
            nextPage() {
                if (this.is_viewed) {
                    this.changeViewPage('qa01');
                } else {
                    alert('請觀看完影片');
                }
            },
            initAR() {
                if (this.viewPage === 'arpage') {
                    AFRAME.registerComponent('image-tracker-1', {
                        init: function () {
                            console.log("image-tracker-1 init");
                        },
                        tick: function() {
                            if (this.el.object3D.visible == true) {
                                console.log("image-tracker-1 detected");
                                app.viewPage = 'poster';
                                alert("成功辨識封面1");
                            }
                        }
                    });
                } 
                if (this.viewPage === 'arpage02') {
                    AFRAME.registerComponent('image-tracker-2', {
                        init: function () {
                            console.log("image-tracker-2 init");
                        },
                        tick: function() {
                            if (this.el.object3D.visible == true) {
                                console.log("image-tracker-2 detected");
                                app.viewPage = 'home';
                                alert("成功辨識封面2");
                            }
                        }
                    });
                }
            }
        },
        watch: {
            viewPage(newPage) {
                if (newPage === 'arpage' || newPage === 'arpage02') {
                    this.initAR();
                }
            }
        },
        mounted() {
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
                app.is_viewed = true;
            }

            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }
    });
});
