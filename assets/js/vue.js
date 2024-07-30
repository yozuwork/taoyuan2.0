var app; // 全域變數
var arbox = document.createElement('div');
arbox.id = 'arbox';
document.body.appendChild(arbox);
var step = 0;
var is_notified = false;

document.addEventListener('DOMContentLoaded', function () {
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`Script loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Failed to load script: ${src}`);
                reject();
            };
            document.head.appendChild(script);
        });
    }

    app = new Vue({
        el: '#app',
        data: {
            viewPage: 'home',
            slidesData: [
                '../assets/images/s1.png',
                'https://thumb.ac-illust.com/30/306837819e76342840641fd1d53fd2f9_t.jpeg',
                '../assets/images/s1.png'
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
            }
        },
        watch: {
            viewPage(newPage) {
                if (newPage === 'arpage' || newPage === 'arpage02') {
                    Promise.all([
                        loadScript('https://cdn.jsdelivr.net/gh/aframevr/aframe@1c2407b26c61958baa93967b5412487cd94b290b/dist/aframe-master.min.js'),
                        loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js')
                    ]).then(() => {
                        console.log('AR scripts loaded.');
                        AFRAME.registerComponent('image-tracker-1', {
                            init: function () {
                                console.log("image-tracker-1 init");
                            },
                            tick: function() {
                                if (this.el.object3D.visible == true) {
                                    console.log("image-tracker-1 detected");
                                    arbox.style.display = "block";
                                    step = 2;
                                    app.viewPage = 'poster';
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
                                    } else {
                                        alert("成功辨識封面2");
                                    }
                                }
                            }
                        });
                    }).catch(err => {
                        console.error('Failed to load AR scripts:', err);
                    });
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