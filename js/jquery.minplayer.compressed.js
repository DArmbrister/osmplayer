/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com 
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{volumeVertical:false});jQuery.media.ids=jQuery.extend(jQuery.media.ids,{currentTime:"#mediacurrenttime",totalTime:"#mediatotaltime",playPause:"#mediaplaypause",seekUpdate:"#mediaseekupdate",seekProgress:"#mediaseekprogress",seekBar:"#mediaseekbar",seekHandle:"#mediaseekhandle",volumeUpdate:"#mediavolumeupdate",volumeBar:"#mediavolumebar",volumeHandle:"#mediavolumehandle",mute:"#mediamute"});jQuery.fn.mediacontrol=function(b){if(this.length===0){return null;}return new (function(e,c){c=jQuery.media.utils.getSettings(c);this.display=e;var f=this;this.formatTime=(c.template&&c.template.formatTime)?c.template.formatTime:function(j){j=j?j:0;var k=0;var h=0;var g=0;g=Math.floor(j/3600);j-=(g*3600);h=Math.floor(j/60);j-=(h*60);k=Math.floor(j%60);var i="";if(g){i+=String(g);i+=":";}i+=(h>=10)?String(h):("0"+String(h));i+=":";i+=(k>=10)?String(k):("0"+String(k));return{time:i,units:""};};this.setToggle=function(h,i){var g=i?".on":".off";var j=i?".off":".on";if(h){h.find(g).show();h.find(j).hide();}};var d=this.formatTime(0);this.duration=0;this.volume=-1;this.prevVolume=0;this.percentLoaded=0;this.playState=false;this.muteState=false;this.allowResize=true;this.currentTime=e.find(c.ids.currentTime).text(d.time);this.totalTime=e.find(c.ids.totalTime).text(d.time);this.display.find("a.mediaplayerlink").each(function(){var g=a(this).attr("href");a(this).medialink(c,function(h){h.preventDefault();f.display.trigger(h.data.id);},{id:g.substr(1),obj:a(this)});});this.playPauseButton=e.find(c.ids.playPause).medialink(c,function(g,h){f.playState=!f.playState;f.setToggle(h,f.playState);f.display.trigger("controlupdate",{type:(f.playState?"pause":"play")});});this.seekUpdate=e.find(c.ids.seekUpdate).css("width",0);this.seekProgress=e.find(c.ids.seekProgress).css("width",0);this.seekBar=e.find(c.ids.seekBar).mediaslider(c.ids.seekHandle,false);this.seekBar.display.bind("setvalue",function(g,h){f.updateSeek(h);f.display.trigger("controlupdate",{type:"seek",value:(h*f.duration)});});this.seekBar.display.bind("updatevalue",function(g,h){f.updateSeek(h);});this.updateSeek=function(g){this.seekUpdate.css("width",(g*this.seekBar.trackSize));this.currentTime.text(this.formatTime(g*this.duration).time);};this.setVolume=function(g){if(this.volumeBar){if(c.volumeVertical){this.volumeUpdate.css({marginTop:(this.volumeBar.handlePos+this.volumeBar.handleMid+this.volumeBar.handleOffset),height:(this.volumeBar.trackSize-this.volumeBar.handlePos)});}else{this.volumeUpdate.css("width",(g*this.volumeBar.trackSize));}}};this.volumeUpdate=e.find(c.ids.volumeUpdate);this.volumeBar=e.find(c.ids.volumeBar).mediaslider(c.ids.volumeHandle,c.volumeVertical,c.volumeVertical);if(this.volumeBar){this.volumeBar.display.bind("setvalue",function(g,h){f.setVolume(h);f.display.trigger("controlupdate",{type:"volume",value:h});});this.volumeBar.display.bind("updatevalue",function(g,h){f.setVolume(h);f.volume=h;});}this.mute=e.find(c.ids.mute).medialink(c,function(g,h){f.muteState=!f.muteState;f.setToggle(h,f.muteState);f.setMute(f.muteState);});this.setMute=function(g){this.prevVolume=(this.volumeBar.value>0)?this.volumeBar.value:this.prevVolume;this.volumeBar.updateValue(g?0:this.prevVolume);this.display.trigger("controlupdate",{type:"mute",value:g});};this.setProgress=function(g){if(this.seekProgress){this.seekProgress.css("width",(g*(this.seekBar.trackSize+this.seekBar.handleSize)));}};this.onResize=function(h,g){if(this.allowResize){if(this.seekBar){this.seekBar.onResize(h,g);}this.setProgress(this.percentLoaded);}};this.onMediaUpdate=function(g){switch(g.type){case"paused":this.playState=true;this.setToggle(this.playPauseButton.display,this.playState);break;case"playing":this.playState=false;this.setToggle(this.playPauseButton.display,this.playState);break;case"stopped":this.playState=true;this.setToggle(this.playPauseButton.display,this.playState);break;case"progress":this.percentLoaded=g.percentLoaded;this.setProgress(this.percentLoaded);break;case"meta":case"update":this.timeUpdate(g.currentTime,g.totalTime);if(this.volumeBar){this.volumeBar.updateValue(g.volume);}break;default:break;}};this.reset=function(){this.totalTime.text(this.formatTime(0).time);if(this.seekBar){this.seekBar.updateValue(0);}};this.timeUpdate=function(g,h){this.duration=h;this.totalTime.text(this.formatTime(h).time);if(h&&!this.seekBar.dragging){this.seekBar.updateValue(g/h);}};this.timeUpdate(0,0);})(this,b);};window.onDailymotionPlayerReady=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onReady();};jQuery.media.playerTypes=jQuery.extend(jQuery.media.playerTypes,{dailymotion:function(b){return(b.search(/^http(s)?\:\/\/(www\.)?dailymotion\.com/i)===0);}});jQuery.fn.mediadailymotion=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.videoFile=null;this.meta=false;this.loaded=false;this.ready=false;this.createMedia=function(i,k){this.videoFile=i;this.ready=false;var h=(e.id+"_media");var j=Math.floor(Math.random()*1000000);var l="http://www.dailymotion.com/swf/"+i.path+"?rand="+j+"&amp;enablejsapi=1&amp;playerapiid="+h;jQuery.media.utils.insertFlash(this.display,l,h,this.display.width(),this.display.height(),{},e.wmode,function(m){g.player=m;g.loadPlayer();});};this.loadMedia=function(h){if(this.player){this.loaded=false;this.meta=false;this.videoFile=h;d({type:"playerready"});this.player.loadVideoById(this.videoFile.path,0);}};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){window[e.id+"StateChange"]=function(h){g.onStateChange(h);};window[e.id+"PlayerError"]=function(h){g.onError(h);};this.player.addEventListener("onStateChange",e.id+"StateChange");this.player.addEventListener("onError",e.id+"PlayerError");d({type:"playerready"});this.player.loadVideoById(this.videoFile.path,0);}};this.onStateChange=function(i){var h=this.getPlayerState(i);if(!(!this.meta&&h=="stopped")){d({type:h});}if(!this.loaded&&h=="buffering"){this.loaded=true;d({type:"paused"});if(e.autostart){this.playMedia();}}if(!this.meta&&h=="playing"){this.meta=true;d({type:"meta"});}};this.onError=function(i){var h="An unknown error has occured: "+i;if(i==100){h="The requested video was not found.  ";h+="This occurs when a video has been removed (for any reason), ";h+="or it has been marked as private.";}else{if((i==101)||(i==150)){h="The video requested does not allow playback in an embedded player.";}}console.log(h);d({type:"error",data:h});};this.getPlayerState=function(h){switch(h){case 5:return"ready";case 3:return"buffering";case 2:return"paused";case 1:return"playing";case 0:return"complete";case -1:return"stopped";default:return"unknown";}return"unknown";};this.setSize=function(i,h){this.player.setSize(i,h);};this.playMedia=function(){d({type:"buffering"});this.player.playVideo();};this.pauseMedia=function(){this.player.pauseVideo();};this.stopMedia=function(){this.player.stopVideo();};this.seekMedia=function(h){d({type:"buffering"});this.player.seekTo(h,true);};this.setVolume=function(h){this.player.setVolume(h*100);};this.getVolume=function(){return(this.player.getVolume()/100);};this.getDuration=function(){return this.player.getDuration();};this.getCurrentTime=function(){return this.player.getCurrentTime();};this.getBytesLoaded=function(){return this.player.getVideoBytesLoaded();};this.getBytesTotal=function(){return this.player.getVideoBytesTotal();};this.getEmbedCode=function(){return this.player.getVideoEmbedCode();};this.getMediaLink=function(){return this.player.getVideoUrl();};this.hasControls=function(){return true;};this.showControls=function(h){};this.setQuality=function(h){};this.getQuality=function(){return"";};})(this,c,b);};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{volume:80,autostart:false,streamer:"",embedWidth:450,embedHeight:337,wmode:"transparent",forceOverflow:false,quality:"default",repeat:false});jQuery.fn.mediadisplay=function(b){if(this.length===0){return null;}return new (function(d,c){this.settings=jQuery.media.utils.getSettings(c);this.display=d;var e=this;this.volume=0;this.player=null;this.preview="";this.reflowInterval=null;this.updateInterval=null;this.progressInterval=null;this.playQueue=[];this.playIndex=0;this.playerReady=false;this.loaded=false;this.mediaFile=null;this.hasPlaylist=false;this.width=0;this.height=0;if(this.settings.forceOverflow){this.display.parents().css("overflow","visible");}this.setSize=function(g,f){this.width=g?g:this.width;this.height=f?f:this.height;this.display.css({height:this.height,width:this.width});if(this.playerReady&&this.width&&this.height){this.player.player.width=this.width;this.player.player.height=this.height;this.player.setSize(g,this.height);}};this.reset=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);clearTimeout(this.reflowInterval);this.playQueue.length=0;this.playQueue=[];this.playIndex=0;this.playerReady=false;this.mediaFile=null;};this.resetContent=function(){this.display.empty();this.display.append(this.template);};this.getPlayableMedia=function(j){var h=null;var f=j.length;while(f--){var g=new jQuery.media.file(j[f],this.settings);if(!h||(g.weight<h.weight)){h=g;}}return h;};this.getMediaFile=function(f){if(f){var g=typeof f;if(((g==="object")||(g==="array"))&&f[0]){f=this.getPlayableMedia(f);}}return f;};this.addToQueue=function(f){if(f){this.playQueue.push(this.getMediaFile(f));}};this.loadFiles=function(f){if(f){this.playQueue.length=0;this.playQueue=[];this.playIndex=0;this.addToQueue(f.intro);this.addToQueue(f.commercial);this.addToQueue(f.prereel);this.addToQueue(f.media);this.addToQueue(f.postreel);}return(this.playQueue.length>0);};this.playNext=function(){if(this.playQueue.length>this.playIndex){this.loadMedia(this.playQueue[this.playIndex]);this.playIndex++;}else{if(this.settings.repeat){this.playIndex=0;this.playNext();}else{if(this.hasPlaylist){this.reset();}else{this.loaded=false;this.settings.autostart=false;this.playIndex=0;this.playNext();}}}};this.loadMedia=function(f){if(f){f=new jQuery.media.file(this.getMediaFile(f),this.settings);this.stopMedia();if(!this.mediaFile||(this.mediaFile.player!=f.player)){this.player=null;this.playerReady=false;if(f.player){this.player=this.display["media"+f.player](this.settings,function(g){e.onMediaUpdate(g);});}if(this.player){this.player.createMedia(f,this.preview);this.startReflow();}}else{if(this.player){this.player.loadMedia(f);}}this.mediaFile=f;this.onMediaUpdate({type:"initialize"});}};this.onMediaUpdate=function(g){switch(g.type){case"playerready":this.playerReady=true;clearTimeout(this.reflowInterval);this.player.setVolume(0);this.player.setQuality(this.settings.quality);this.startProgress();break;case"buffering":this.startProgress();break;case"stopped":clearInterval(this.progressInterval);clearInterval(this.updateInterval);break;case"paused":clearInterval(this.updateInterval);break;case"playing":this.startUpdate();break;case"progress":var f=this.getPercentLoaded();jQuery.extend(g,{percentLoaded:f});if(f>=1){clearInterval(this.progressInterval);}break;case"update":case"meta":jQuery.extend(g,{currentTime:this.player.getCurrentTime(),totalTime:this.getDuration(),volume:this.player.getVolume(),quality:this.getQuality()});break;case"complete":this.playNext();break;}if(g.type=="playing"&&!this.loaded){if(this.settings.autoLoad&&!this.settings.autostart){setTimeout(function(){e.player.setVolume((e.settings.volume/100));e.player.pauseMedia();e.settings.autostart=true;e.loaded=true;},100);}else{this.loaded=true;this.player.setVolume((this.settings.volume/100));this.display.trigger("mediaupdate",g);}}else{this.display.trigger("mediaupdate",g);}};this.reflowPlayer=function(){var f={marginLeft:parseInt(this.display.css("marginLeft"),10),height:this.display.css("height")};var g=(f.marginLeft>=0);this.display.css({marginLeft:(g?(f.marginLeft+1):0),height:(g?f.height:0)});setTimeout(function(){e.display.css(f);},1);};this.startReflow=function(){clearTimeout(this.reflowInterval);this.reflowInterval=setTimeout(function(){e.reflowPlayer();},2000);};this.startProgress=function(){if(this.playerReady){clearInterval(this.progressInterval);this.progressInterval=setInterval(function(){e.onMediaUpdate({type:"progress"});},500);}};this.startUpdate=function(){if(this.playerReady){clearInterval(this.updateInterval);this.updateInterval=setInterval(function(){if(e.playerReady){e.onMediaUpdate({type:"update"});}},1000);}};this.stopMedia=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);clearTimeout(this.reflowInterval);if(this.playerReady){this.player.stopMedia();}};this.mute=function(f){if(f){this.volume=this.player.getVolume();this.player.setVolume(0);}else{this.player.setVolume(this.volume);}};this.getPercentLoaded=function(){var g=this.player.getBytesLoaded();var f=this.mediaFile.bytesTotal?this.mediaFile.bytesTotal:this.player.getBytesTotal();return f?(g/f):0;};this.showControls=function(f){if(this.playerReady){this.player.showControls(f);}};this.hasControls=function(){if(this.player){return this.player.hasControls();}return false;};this.getDuration=function(){if(!this.mediaFile.duration){this.mediaFile.duration=this.player.getDuration();}return this.mediaFile.duration;};this.getQuality=function(){if(!this.mediaFile.quality){this.mediaFile.quality=this.player.getQuality();}return this.mediaFile.quality;};this.setSize(this.display.width(),this.display.height());})(this,b);};window.onFlashPlayerReady=function(b){jQuery.media.players[b].node.player.media.player.onReady();};window.onFlashPlayerUpdate=function(c,b){jQuery.media.players[c].node.player.media.player.onMediaUpdate(b);};window.onFlashPlayerDebug=function(b){console.log(b);};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{flashPlayer:"./flash/mediafront.swf",skin:"default",config:"nocontrols"});jQuery.fn.mediaflash=function(c,b){return new (function(f,e,d){e=jQuery.media.utils.getSettings(e);this.display=f;var g=this;this.player=null;this.videoFile=null;this.preview="";this.ready=false;this.translate={mediaConnected:"connected",mediaBuffering:"buffering",mediaPaused:"paused",mediaPlaying:"playing",mediaStopped:"stopped",mediaComplete:"complete",mediaMeta:"meta"};this.createMedia=function(j,l){this.videoFile=j;this.preview=l;this.ready=false;var i=(e.id+"_media");var k=Math.floor(Math.random()*1000000);var m=e.flashPlayer+"?rand="+k;var h={config:e.config,id:e.id,file:j.path,skin:e.skin,autostart:(e.autostart||!e.autoLoad)};if(j.stream){h.stream=j.stream;}if(e.debug){h.debug="1";}jQuery.media.utils.insertFlash(this.display,m,i,this.display.width(),this.display.height(),h,e.wmode,function(n){g.player=n;g.loadPlayer();});};this.loadMedia=function(h){if(this.player){this.videoFile=h;this.player.loadMedia(h.path,h.stream);d({type:"playerready"});}};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){d({type:"playerready"});}};this.onMediaUpdate=function(h){d({type:this.translate[h]});};this.playMedia=function(){this.player.playMedia();};this.pauseMedia=function(){this.player.pauseMedia();};this.stopMedia=function(){this.player.stopMedia();};this.seekMedia=function(h){this.player.seekMedia(h);};this.setVolume=function(h){this.player.setVolume(h);};this.getVolume=function(){return this.player.getVolume();};this.getDuration=function(){return this.player.getDuration();};this.getCurrentTime=function(){return this.player.getCurrentTime();};this.getBytesLoaded=function(){return this.player.getMediaBytesLoaded();};this.getBytesTotal=function(){return this.player.getMediaBytesTotal();};this.hasControls=function(){return true;};this.showControls=function(h){this.player.showPlugin("controlBar",h);this.player.showPlugin("playLoader",h);};this.getEmbedCode=function(){var h={config:"config",id:"mediafront_player",file:this.videoFile.path,image:this.preview,skin:e.skin};if(this.videoFile.stream){h.stream=this.videoFile.stream;}return jQuery.media.utils.getFlash(e.flashPlayer,"mediafront_player",e.embedWidth,e.embedHeight,h,e.wmode);};this.setQuality=function(h){};this.getQuality=function(){return"";};this.setSize=function(i,h){};this.getMediaLink=function(){return"This video currently does not have a link.";};})(this,c,b);};jQuery.fn.mediahtml5=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.bytesLoaded=0;this.bytesTotal=0;this.mediaType="";this.getPlayer=function(h,m){var j=e.id+"_"+this.mediaType;var l="<"+this.mediaType+' style="position:absolute" id="'+j+'"';l+=(this.mediaType=="video")?' width="'+this.display.width()+'px" height="'+this.display.height()+'px"':"";l+=m?' poster="'+m+'"':"";if(typeof h==="array"){l+=">";var k=h.length;while(k--){l+='<source src="'+h[k].path+'" type="'+h[k].mimetype+'">';}}else{l+=' src="'+h.path+'">Unable to display media.';}l+="</"+this.mediaType+">";this.display.append(l);return this.display.find("#"+j).eq(0)[0];};this.createMedia=function(h,i){jQuery.media.utils.removeFlash(this.display,e.id+"_media");this.display.children().remove();this.mediaType=this.getMediaType(h);this.player=this.getPlayer(h,i);this.player.addEventListener("abort",function(){d({type:"stopped"});},true);this.player.addEventListener("loadstart",function(){d({type:"ready"});},true);this.player.addEventListener("loadedmetadata",function(){d({type:"meta"});},true);this.player.addEventListener("ended",function(){d({type:"complete"});},true);this.player.addEventListener("pause",function(){d({type:"paused"});},true);this.player.addEventListener("play",function(){d({type:"playing"});},true);this.player.addEventListener("error",function(){d({type:"error"});},true);this.player.addEventListener("progress",function(j){g.bytesLoaded=j.loaded;g.bytesTotal=j.total;},true);this.player.autoplay=true;this.player.autobuffer=true;d({type:"playerready"});};this.loadMedia=function(h){this.createMedia(h);};this.getMediaType=function(h){var i=(typeof h==="array")?h[0].extension:h.extension;switch(i){case"ogg":case"ogv":case"mp4":case"m4v":return"video";case"oga":case"mp3":return"audio";}return"video";};this.playMedia=function(){this.player.play();};this.pauseMedia=function(){this.player.pause();};this.stopMedia=function(){this.pauseMedia();this.player.src="";};this.seekMedia=function(h){this.player.currentTime=h;};this.setVolume=function(h){this.player.volume=h;};this.getVolume=function(){return this.player.volume;};this.getDuration=function(){return this.player.duration;};this.getCurrentTime=function(){return this.player.currentTime;};this.getBytesLoaded=function(){return this.bytesLoaded;};this.getBytesTotal=function(){return this.bytesTotal;};this.setQuality=function(h){};this.getQuality=function(){return"";};this.hasControls=function(){return false;};this.showControls=function(h){};this.setSize=function(i,h){};this.getEmbedCode=function(){return"This media cannot be embedded.";};this.getMediaLink=function(){return"This media currently does not have a link.";};})(this,c,b);};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{logo:"logo.png",logoWidth:49,logoHeight:15,logopos:"sw",logox:5,logoy:5,link:"http://www.mediafront.org",file:"",image:"",timeout:2000,autoLoad:true});jQuery.media.ids=jQuery.extend(jQuery.media.ids,{busy:"#mediabusy",preview:"#mediapreview",play:"#mediaplay",media:"#mediadisplay",control:"#mediacontrol"});jQuery.fn.minplayer=function(b){if(this.length===0){return null;}return new (function(d,e){e=jQuery.media.utils.getSettings(e);this.display=d;var g=this;this.autoLoad=e.autoLoad;this.controller=null;this.activeController=null;this.busy=d.find(e.ids.busy);this.busyImg=this.busy.find("img");this.busyWidth=this.busyImg.width();this.busyHeight=this.busyImg.height();this.play=d.find(e.ids.play);this.play.bind("click",function(){g.togglePlayPause();});this.playImg=this.play.find("img");this.playWidth=this.playImg.width();this.playHeight=this.playImg.height();this.preview=null;this.usePlayerControls=false;this.busyFlags=0;this.busyVisible=false;this.playVisible=false;this.previewVisible=false;this.controllerVisible=true;this.hasMedia=false;this.playing=false;this.width=this.display.width();this.height=this.display.height();this.showElement=function(j,h,i){if(j&&!this.usePlayerControls){if(h){j.show(i);}else{j.hide(i);}}};this.showPlay=function(h,i){if(this.playVisible!=h){this.playVisible=h;this.showElement(this.play,h,i);}};this.showBusy=function(k,h,j){if(h){this.busyFlags|=(1<<k);}else{this.busyFlags&=~(1<<k);}var i=(this.busyFlags>0);if(this.busyVisible!=i){this.busyVisible=i;this.showElement(this.busy,this.busyVisible,j);}};this.showPreview=function(h,i){if(this.previewVisible!=h){this.previewVisible=h;if(this.preview){this.showElement(this.preview.display,h,i);}}};this.showController=function(h,i){if(this.controllerVisible!=h){this.controllerVisible=h;if(this.controller){this.showElement(this.controller.display,h,i);}}};this.onControlUpdate=function(h){if(this.media){if(this.media.playerReady){switch(h.type){case"play":this.media.player.playMedia();break;case"pause":this.media.player.pauseMedia();break;case"seek":this.media.player.seekMedia(h.value);break;case"volume":this.media.player.setVolume(h.value);break;case"mute":this.media.mute(h.value);break;}}else{if((this.media.playQueue.length>0)&&!this.media.mediaFile){this.autoLoad=true;this.playNext();}}if(e.template&&e.template.onControlUpdate){e.template.onControlUpdate(h);}}};this.fullScreen=function(h){if(e.template.onFullScreen){e.template.onFullScreen(h);}};this.onPreviewLoaded=function(){this.previewVisible=true;};this.onMediaUpdate=function(h){switch(h.type){case"paused":this.playing=false;this.showPlay(true);this.showBusy(1,false);break;case"update":case"playing":this.playing=true;this.showPlay(false);this.showBusy(1,false);this.showPreview((this.media.mediaFile.type=="audio"));break;case"initialize":this.playing=false;this.showPlay(true);this.showBusy(1,this.autoLoad);this.showPreview(true);break;case"buffering":this.showPlay(true);this.showBusy(1,true);this.showPreview((this.media.mediaFile.type=="audio"));break;}if(this.controller){this.controller.onMediaUpdate(h);}if(this.activeController){this.activeController.onMediaUpdate(h);}if(e.template&&e.template.onMediaUpdate){e.template.onMediaUpdate(h);}};this.addController=function(i,h){if(i){i.display.bind("controlupdate",i,function(j,k){g.activeController=j.data;g.onControlUpdate(k);});if(h&&!this.activeController){this.activeController=i;}}return i;};this.media=this.display.find(e.ids.media).mediadisplay(e);if(this.media){this.media.display.bind("mediaupdate",function(h,i){g.onMediaUpdate(i);});}this.controller=this.addController(this.display.find(e.ids.control).mediacontrol(e),false);if(jQuery.media.controllers[e.id]){var f=jQuery.media.controllers[e.id];var c=f.length;while(c--){this.addController(f[c],true);}}this.setSize=function(l,j){this.width=l?l:this.width;this.height=j?j:this.height;if(this.width&&this.height){this.setLogoPos();if(this.preview){this.preview.resize(this.width,this.height);}var i=Math.ceil((this.width-this.busyWidth)/2);var m=Math.ceil((this.height-this.busyHeight)/2);this.busy.css({width:this.width,height:this.height});this.busyImg.css({marginLeft:i,marginTop:m});var h=Math.ceil((this.width-this.playWidth)/2);var k=Math.ceil((this.height-this.playHeight)/2);this.play.css({width:this.width,height:this.height});this.playImg.css({marginLeft:h,marginTop:k});if(this.media){this.media.display.css({width:this.width,height:this.height});this.media.setSize(this.width,this.height);}}};this.showPlayerController=function(h){if(this.media&&this.media.hasControls()){this.usePlayerControls=h;if(h){this.busy.hide();this.play.hide();if(this.preview){this.preview.display.hide();}if(this.controller){this.controller.display.hide();}}else{this.showBusy(1,((this.busyFlags&2)==2));this.showPlay(this.playVisible);this.showPreview(this.previewVisible);this.showController(this.controllerVisible);}this.media.showControls(h);}};if(this.media){this.display.prepend('<div class="medialogo"></div>');this.logo=this.display.find(".medialogo").mediaimage(e.link);this.logo.display.css({position:"absolute",zIndex:490});this.logo.width=e.logoWidth;this.logo.height=e.logoHeight;this.logo.loadImage(e.logo);}this.setLogoPos=function(){if(this.logo){var i=parseInt(this.media.display.css("marginTop"),0);var h=parseInt(this.media.display.css("marginLeft"),0);var k=(e.logopos=="se"||e.logopos=="sw")?(i+this.height-this.logo.height-e.logoy):i+e.logoy;var j=(e.logopos=="ne"||e.logopos=="se")?(h+this.width-this.logo.width-e.logox):h+e.logox;this.logo.display.css({marginTop:k,marginLeft:j});}};this.onResize=function(i,h){if(this.controller){this.controller.onResize(i,h);}this.setSize(this.width+i,this.height+h);};this.reset=function(){this.hasMedia=false;this.playing=false;if(this.controller){this.controller.reset();}if(this.activeController){this.activeController.reset();}this.showBusy(1,this.autoLoad);if(this.media){this.media.reset();}};this.togglePlayPause=function(){if(this.media){if(this.media.playerReady){if(this.playing){this.showPlay(true);this.media.player.pauseMedia();}else{this.showPlay(false);this.media.player.playMedia();}}else{if((this.media.playQueue.length>0)&&!this.media.mediaFile){this.autoLoad=true;this.playNext();}}}};this.loadImage=function(h){this.preview=d.find(e.ids.preview).mediaimage();if(this.preview){this.preview.resize(this.width,this.height);this.preview.display.bind("imageLoaded",function(){g.onPreviewLoaded();});this.preview.loadImage(h);if(this.media){this.media.preview=h;}}};this.clearImage=function(){if(this.preview){this.preview.clear();}};this.loadFiles=function(h){this.reset();if(this.media&&this.media.loadFiles(h)&&this.autoLoad){this.media.playNext();}};this.playNext=function(){if(this.media){this.media.playNext();}};this.loadMedia=function(h){this.reset();if(this.media){this.media.loadMedia(h);}};if(e.file){this.loadMedia(e.file);}if(e.image){this.loadImage(e.image);}})(this,b);};window.onVimeoReady=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onReady();};window.onVimeoFinish=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onFinished();};window.onVimeoLoading=function(c,b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onLoading(c);};window.onVimeoPlay=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onPlaying();};window.onVimeoPause=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onPaused();};jQuery.media.playerTypes=jQuery.extend(jQuery.media.playerTypes,{vimeo:function(b){return(b.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i)===0);}});jQuery.fn.mediavimeo=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.videoFile=null;this.ready=false;this.bytesLoaded=0;this.bytesTotal=0;this.currentVolume=1;this.createMedia=function(j,l){this.videoFile=j;this.ready=false;var i=(e.id+"_media");var h={clip_id:this.getId(j.path),width:this.display.width(),height:this.display.height(),js_api:"1",js_onLoad:"onVimeoReady",js_swf_id:i};var k=Math.floor(Math.random()*1000000);var m="http://vimeo.com/moogaloop.swf?rand="+k;jQuery.media.utils.insertFlash(this.display,m,i,this.display.width(),this.display.height(),h,e.wmode,function(n){g.player=n;g.loadPlayer();});};this.getId=function(i){var h=/^http[s]?\:\/\/(www\.)?vimeo\.com\/([0-9]+)/i;return(i.search(h)==0)?i.replace(h,"$2"):i;};this.loadMedia=function(h){this.bytesLoaded=0;this.bytesTotal=0;this.createMedia(h);};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){this.player.api_addEventListener("onFinish","onVimeoFinish");this.player.api_addEventListener("onLoading","onVimeoLoading");this.player.api_addEventListener("onPlay","onVimeoPlay");this.player.api_addEventListener("onPause","onVimeoPause");d({type:"playerready"});this.playMedia();}};this.onFinished=function(){d({type:"complete"});};this.onLoading=function(h){this.bytesLoaded=h.bytesLoaded;this.bytesTotal=h.bytesTotal;};this.onPlaying=function(){d({type:"playing"});};this.onPaused=function(){d({type:"paused"});};this.playMedia=function(){d({type:"buffering"});this.player.api_play();};this.pauseMedia=function(){this.player.api_pause();};this.stopMedia=function(){this.pauseMedia();this.player.api_unload();};this.seekMedia=function(h){this.player.api_seekTo(h);};this.setVolume=function(h){this.currentVolume=h;this.player.api_setVolume((h*100));};this.getVolume=function(){return this.currentVolume;};this.getDuration=function(){return this.player.api_getDuration();};this.getCurrentTime=function(){return this.player.api_getCurrentTime();};this.getBytesLoaded=function(){return this.bytesLoaded;};this.getBytesTotal=function(){return this.bytesTotal;};this.setQuality=function(h){};this.getQuality=function(){return"";};this.hasControls=function(){return true;};this.showControls=function(h){};this.setSize=function(i,h){};this.getEmbedCode=function(){return"This video cannot be embedded.";};this.getMediaLink=function(){return"This video currently does not have a link.";};})(this,c,b);};window.onYouTubePlayerReady=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onReady();};jQuery.media.playerTypes=jQuery.extend(jQuery.media.playerTypes,{youtube:function(b){return(b.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i)===0);}});jQuery.fn.mediayoutube=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.videoFile=null;this.loaded=false;this.ready=false;this.qualities=[];this.createMedia=function(i,k){this.videoFile=i;this.ready=false;var h=(e.id+"_media");var j=Math.floor(Math.random()*1000000);var l="http://www.youtube.com/apiplayer?rand="+j+"&amp;version=3&amp;enablejsapi=1&amp;playerapiid="+h;jQuery.media.utils.insertFlash(this.display,l,h,this.display.width(),this.display.height(),{},e.wmode,function(m){g.player=m;g.loadPlayer();});};this.getId=function(i){var h=/^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;return(i.search(h)==0)?i.replace(h,"$2"):i;};this.loadMedia=function(h){if(this.player){this.loaded=false;this.videoFile=h;d({type:"playerready"});this.player.loadVideoById(this.getId(this.videoFile.path),0,e.quality);}};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){window[e.id+"StateChange"]=function(h){g.onStateChange(h);};window[e.id+"PlayerError"]=function(h){g.onError(h);};window[e.id+"QualityChange"]=function(h){g.quality=h;};this.player.addEventListener("onStateChange",e.id+"StateChange");this.player.addEventListener("onError",e.id+"PlayerError");this.player.addEventListener("onPlaybackQualityChange",e.id+"QualityChange");this.qualities=this.player.getAvailableQualityLevels();d({type:"playerready"});this.player.loadVideoById(this.getId(this.videoFile.path),0);}};this.onStateChange=function(i){var h=this.getPlayerState(i);d({type:h});if(!this.loaded&&h=="playing"){this.loaded=true;d({type:"meta"});}};this.onError=function(i){var h="An unknown error has occured: "+i;if(i==100){h="The requested video was not found.  ";h+="This occurs when a video has been removed (for any reason), ";h+="or it has been marked as private.";}else{if((i==101)||(i==150)){h="The video requested does not allow playback in an embedded player.";}}console.log(h);d({type:"error",data:h});};this.getPlayerState=function(h){switch(h){case 5:return"ready";case 3:return"buffering";case 2:return"paused";case 1:return"playing";case 0:return"complete";case -1:return"stopped";default:return"unknown";}return"unknown";};this.setSize=function(i,h){};this.playMedia=function(){d({type:"buffering"});this.player.playVideo();};this.pauseMedia=function(){this.player.pauseVideo();};this.stopMedia=function(){this.player.stopVideo();};this.seekMedia=function(h){d({type:"buffering"});this.player.seekTo(h,true);};this.setVolume=function(h){this.player.setVolume(h*100);};this.setQuality=function(h){this.player.setPlaybackQuality(h);};this.getVolume=function(){return(this.player.getVolume()/100);};this.getDuration=function(){return this.player.getDuration();};this.getCurrentTime=function(){return this.player.getCurrentTime();};this.getQuality=function(){return this.player.getPlaybackQuality();};this.getEmbedCode=function(){return this.player.getVideoEmbedCode();};this.getMediaLink=function(){return this.player.getVideoUrl();};this.getBytesLoaded=function(){return this.player.getVideoBytesLoaded();};this.getBytesTotal=function(){return this.player.getVideoBytesTotal();};this.hasControls=function(){return false;};this.showControls=function(h){};})(this,c,b);};})(jQuery);