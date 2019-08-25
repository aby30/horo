/* jQuery tubular plugin
|* by Sean McCambridge
|* http://www.seanmccambridge.com/tubular
|* version: 1.0
|* updated: October 1, 2012
|* since 2010
|* licensed under the MIT License
|* Enjoy.
|*
|* Thanks,
|* Sean */

;(function ($, window) {

    // test for feature support and return if failure

    // defaults
    var defaults = {
        ratio: 16/9, // usually either 4/3 or 16/9 -- tweak as needed
        videoId: 'ZCAnLxRvNNc', // toy robot in space is a good default, no?
        mute: true,
        repeat: true,
        width: $(window).width(),
        wrapperZIndex: 99,
        playButtonClass: 'tubular-play',
        pauseButtonClass: 'tubular-pause',
        muteButtonClass: 'tubular-mute',
        volumeUpClass: 'tubular-volume-up',
        volumeDownClass: 'tubular-volume-down',
        increaseVolumeBy: 10,
        start: 0
    };

    // methods

    var tubular = function(node, options) { // should be called on the wrapper div
        var options = $.extend({}, defaults, options),
            $body = $("#"+node.id) // cache body node
            $node = $(node); // cache wrapper node
            var listOfVideos = document.getElementsByClassName('video');

        // build container
        var tubularContainer = '<div id="' + $body +  '"style="overflow: hidden; width: 100%; height: 100%"><div id="tubular-player" style="max-width: 100%;max-height: 100%;"></div></div><div id="tubular-shield" style="width: 100%; height: 100%; z-index: 2; "></div>';

        // set up css prereq's, inject tubular container and set up wrapper defaults
        $('html,body').css({'width': '100%', 'height': '100%'});
        $body.prepend(tubularContainer);
        $node.css({position: 'relative', 'z-index': options.wrapperZIndex});

        window.playersArr = [];
        window.onYouTubeIframeAPIReady = function() {
          if(typeof listOfVideos === 'undefined')
             return;

          for(var i = 0; i < listOfVideos.length;i++) {
            var aPlayer = listOfVideos[i];
            var aPlayerId = $(aPlayer).attr('id');
            var newPlayer = createPlayer(aPlayerId);
            playersArr.push(newPlayer);
          }
        }
        function createPlayer(playerInfo) {

            return new YT.Player(playerInfo, {
               width: options.width,
               height: Math.ceil(options.width / options.ratio),
               videoId: $body[0].attributes.data.nodeValue,
               playerVars: {
                   controls: 0,
                   showinfo: 0,
                   modestbranding: 1,
                   wmode: 'transparent',
                   rel: 0
               },
               events: {
                   'onReady': onPlayerReady,
                   'onStateChange': onPlayerStateChange
               }
            });
        }

        window.onPlayerReady = function(e) {
            resize();
            if (options.mute) e.target.mute();
            e.target.seekTo(options.start);
            e.target.pauseVideo();
        }

        window.onPlayerStateChange = function(state) {
            if (state.data === 0 && options.repeat) { // video ended and repeat option is set true
                player.seekTo(options.start); // restart
            }
        }

        // resize handler updates width, height and offset of player after resize/init
        var resize = function() {
            var width = $(window).width(),
                pWidth, // player width, to be defined
                height = $(window).height(),
                pHeight, // player height, tbd
                $tubularPlayer = $('#tubular-player');

            // when screen aspect ratio differs from video, video must center and underlay one dimension

            if (width / options.ratio < height) { // if new video height < window height (gap underneath)
                pWidth = Math.ceil(height * options.ratio); // get new player width
                $tubularPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); // player width is greater, offset left; reset top
            } else { // new video width < window width (gap to right)
                pHeight = Math.ceil(width / options.ratio); // get new player height
                $tubularPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); // player height is greater, offset top; reset left
            }

        }

        // events
        $(window).on('resize.tubular', function() {
            resize();
        })

        $('.videoContainer').on('mouseover', function(e) { // play button
            $('#' + this.id).children(".videoOverlay").css("opacity", "0");
            e.preventDefault();
            var cstmVideoId = $('#' + this.id).children(".video")[0].attributes.data.nodeValue;
            var videoContainerId = $('#' + this.id).children(".video")[0].id;
            for (i = 0; i <= playersArr.length; i++) {
              if (this.children[1].id == playersArr[i].a.id) {
                playersArr[i].loadVideoById({videoId:cstmVideoId, suggestedQuality: 'small'});
                break;
              }
            }
        }).on('mouseleave', function(e) { // pause button
            $('#' + this.id).children(".videoOverlay").css("opacity", "1");
            e.preventDefault();
            for (i = 0; i <= playersArr.length; i++) {
              if (this.children[1].id == playersArr[i].a.id) {
                playersArr[i].pauseVideo();
                break;
              }
            }
        }).on('click', '.' + options.muteButtonClass, function(e) { // mute button
            e.preventDefault();
            (player.isMuted()) ? player.unMute() : player.mute();
        }).on('click', '.' + options.volumeDownClass, function(e) { // volume down button
            e.preventDefault();
            var currentVolume = player.getVolume();
            if (currentVolume < options.increaseVolumeBy) currentVolume = options.increaseVolumeBy;
            player.setVolume(currentVolume - options.increaseVolumeBy);
        }).on('click', '.' + options.volumeUpClass, function(e) { // volume up button
            e.preventDefault();
            if (player.isMuted()) player.unMute(); // if mute is on, unmute
            var currentVolume = player.getVolume();
            if (currentVolume > 100 - options.increaseVolumeBy) currentVolume = 100 - options.increaseVolumeBy;
            player.setVolume(currentVolume + options.increaseVolumeBy);
        })
    }

    // load yt iframe js api

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // create plugin

    $.fn.tubular = function (options) {
        return this.each(function () {
            if (!$.data(this, 'tubular_instantiated')) { // let's only run one
                $.data(this, 'tubular_instantiated',
                tubular(this, options));
            }
        });
    }

})(jQuery, window);
