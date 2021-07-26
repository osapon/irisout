// ==UserScript==
// @name         iris out
// @namespace    osa-p.net
// @author       osa <osa@osa-p.net>
// @version      1.0.0
// @homepageURL  https://osa-p.net
// @match        http://*/*
// @match        https://*/*
// @updateURL    https://github.com/osapon/irisout/raw/master/irisout.user.js
// @downloadURL  https://github.com/osapon/irisout/raw/master/irisout.user.js
// @homepageURL  https://github.com/osapon/irisout
// ==/UserScript==

(function() {
  "use strict";
	var mode_set_center = false;
	var body_obj = document.querySelector("body");
	body_obj.insertAdjacentHTML("beforeend", "<div id='korigori' style='z-index:16000000;background-color:rgb(0,0,0,0.3);position:fixed;left:0;top:0;right:0;bottom:0;'></div>");
	var base_obj = document.getElementById('korigori');
	base_obj.insertAdjacentHTML("beforeend", "<div id='korigori_frame' style='z-index:16000001;outline:3000px solid rgb(0,0,0,0.3);position:fixed;left:0;top:0;border-radius:50%;width:100px;height:100px;'></div>");
	base_obj.insertAdjacentHTML("beforeend", "<div id='korigori_guide' style='z-index:16000002;color:#fff;position:fixed;left:0;top:0;display:none;'></div><div id='korigori_balloon_outside' style='z-index:16000003;position:fixed;left:0;top:0;text-align:center;display:none;'><div id='korigori_balloon' class='korigori_balloon korigori_balloon_bottom'></div></div><div id='korigori_ctrl' style='z-index:16000004;background-color:rgb(0,0,0,0.5);position:relative;display:inline-block;border:1px dashed #fff;color:white;'><div id='korigori_ctrlheader' style='cursor:grab;border:1px solid #fff;'>iris out maker</div><div>center:(X:<input type='text' id='centerX' value='' style='width:4em;'>,Y:<input type='text' id='centerY' value='' style='width:4em;'>)<input type='button' id='korigori_set_center' value='set'><br>pause size:<input type='range' id='korigori_size' value='100' max='1000'><br>comment:<input type='text' id='comment' value='' style='min-width:18em;' placeholder='If no comment, there is no balloon.'><br><input type='button' id='korigori_play' value='play'></div></div>");
  var ctrl_obj = document.getElementById('korigori_ctrl');
  dragElement(ctrl_obj);
  var set_center_obj = document.getElementById('korigori_set_center');
  var old_x, old_y;
  set_center_obj.addEventListener('click', function(e) {
    e.stopPropagation();
    if (this.value != 'cancel') {
      this.value = 'cancel';
      old_x = parseInt(document.getElementById('centerX').value);
      old_y = parseInt(document.getElementById('centerY').value);
      base_obj.addEventListener('mousemove', moveSetCenter);
      base_obj.addEventListener('click', clickSetCenter);
    }
    else {
      document.getElementById('centerX').value = old_x;
      document.getElementById('centerY').value = old_y;
      clickSetCenter();
    }
  });
  var size_obj = document.getElementById('korigori_size');
  size_obj.addEventListener('input', setCenter);
  var play_obj = document.getElementById('korigori_play');
  play_obj.addEventListener('click', setStyle);
  
  function moveSetCenter(e) {
    document.getElementById('centerX').value = e.offsetX;
    document.getElementById('centerY').value = e.offsetY;
  }
  function clickSetCenter() {
    set_center_obj.value = 'set';
    base_obj.removeEventListener('mousemove', moveSetCenter);
    base_obj.removeEventListener('click', clickSetCenter);
    setCenter();
  }
  function setCenter() {
    var x = parseInt(document.getElementById('centerX').value);
    var y = parseInt(document.getElementById('centerY').value);
    var r = parseInt(size_obj.value);
    changeSize(x,y,r);
  }
  function changeSize(x, y, r) {
    var frame_obj = document.getElementById('korigori_frame');
    frame_obj.style.left = (x - (r/2)) + 'px';
    frame_obj.style.top = (y - (r/2)) + 'px';
    frame_obj.style.width = r + 'px';
    frame_obj.style.height = r + 'px';
  }
	function setStyle() {
    var frame_obj = document.getElementById('korigori_frame');
    var guide_obj = document.getElementById('korigori_guide');
    frame_obj.classList.remove('korigori_anime');
		var style = document.getElementById('korigori_style');
    if (style) style.remove();
    var x = parseInt(document.getElementById('centerX').value);
    var y = parseInt(document.getElementById('centerY').value);
    var r = parseInt(size_obj.value);
    base_obj.insertAdjacentHTML("afterbegin", "<style id='korigori_style'>.korigori_anime{left:" + (x-1000) + ";top:" + (y-1000) + ";animation-name:korigori_frame_anime;animation-duration:1s;animation-timing-function: ease-out;animation-fill-mode:forwards;}@keyframes korigori_frame_anime {0%{width:2000px;height:2000px;}100%{transform:translateX(" + (1000-(r/2)) + "px) translateY(" + (1000-(r/2)) + "px);width:" + r + "px;height:" + r + "px;}} .korigori_anime_end{left:" + (x-(r/2)) + ";top:" + (y-(r/2)) + ";animation-name:korigori_frame_anime_end;animation-duration:0.5s;animation-timing-function: ease-in;animation-fill-mode:forwards;}@keyframes korigori_frame_anime_end {0%{width:" + r + "px;height:" + r + "px;}100%{transform:translateX(" + (r/2) + "px) translateY(" + (r/2) + "px);width:0px;height:0px;}}.korigori_balloon{position:relative;width:auto;margin:0 auto 40px;padding:20px;background:#ddd;text-align:center;border-radius:8px;display:inline-block;}.korigori_balloon_top::before{content:'';position:absolute;bottom:-28px;left:50%;margin-left:-14px;border:14px solid transparent;border-top-color:#ddd;}.korigori_balloon_bottom::before{content:'';position:absolute;top:-28px;left:50%;margin-left:-14px;border:14px solid transparent;border-bottom-color:#ddd;}</style>");
    frame_obj.addEventListener('animationend', function(){
      if (frame_obj.classList.contains('korigori_anime_end') == false) {
        var comment_obj = document.getElementById('comment');
        if (comment_obj.value) {
          document.getElementById('korigori_balloon').innerHTML = comment_obj.value;
          var outside_obj = document.getElementById('korigori_balloon_outside');
          outside_obj.style.width = '500px';
          outside_obj.style.display = 'block';
          outside_obj.style.left = (x-250) + 'px';
          outside_obj.style.top = (y+(r/2)+30) + 'px';
          document.getElementById('korigori_balloon_outside').style.display = 'block';
        }
        setTimeout(function(){
          frame_obj.classList.add('korigori_anime_end');
          frame_obj.style.left = (x-(r/2)) + 'px';
          frame_obj.style.top = (y-(r/2)) + 'px';
          frame_obj.classList.remove('korigori_anime');
          document.getElementById('korigori_balloon_outside').style.display = 'none';
        }, 2000);
      }
      else if (frame_obj.classList.contains('korigori_anime_end')) {
        setTimeout(function(){
          frame_obj.classList.remove('korigori_anime_end');
          base_obj.style.backgroundColor = "rgb(0,0,0,0.3)";
			    frame_obj.style.outlineColor = "rgb(0,0,0,0.3)";
          ctrl_obj.style.display = 'inline-block';
          guide_obj.style.display = 'none';
        }, 1000);
      }
    });
    ctrl_obj.style.display = 'none';
    base_obj.style.backgroundColor = "rgb(0,0,0,0)";
    frame_obj.style.left = (x - 1000) + 'px';
    frame_obj.style.top = (y - 1000) + 'px';
    frame_obj.style.width = '5000px';
    frame_obj.style.height = '5000px';
    setTimeout(function(){
	    frame_obj.style.outlineColor = "rgb(0,0,0,1)";
      guide_obj.innerHTML = document.title + '<br>' + location.href;
      guide_obj.style.display = 'block';
      frame_obj.classList.add('korigori_anime');
    }, 2000);
  }
  
  function dragElement(ele) {
    var posX = 0, posY = 0, posX2 = 0, posY2 = 0;
    if (document.getElementById(ele.id + "header")) {
      document.getElementById(ele.id + "header").addEventListener('mousedown', dragMouseDown);
    } else {
      ele.addEventListener('mousedown', dragMouseDown);
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      posX2 = e.clientX;
      posY2 = e.clientY;
      document.addEventListener('mouseup', closeDragElement);
      document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
      document.getElementById('korigori_ctrlheader').style.cursor = 'grabbing';
      e = e || window.event;
      e.preventDefault();
      posX = posX2 - e.clientX;
      posY = posY2 - e.clientY;
      posX2 = e.clientX;
      posY2 = e.clientY;
      ele.style.left = (ele.offsetLeft - posX) + "px";
      ele.style.top = (ele.offsetTop - posY) + "px";
    }

    function closeDragElement(e) {
      document.getElementById('korigori_ctrlheader').style.cursor = 'grab';
      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', elementDrag);
    }
  }
  
  
})();
