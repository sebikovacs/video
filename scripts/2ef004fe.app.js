var app=angular.module("videoLoop",["ngRoute","ngTouch","monospaced.mousewheel","LocalForageModule"]).config(["$routeProvider","$localForageProvider",function(a,b){"use strict";b.config({driver:"asyncStorage"}),a.when("/",{templateUrl:"views/videoloop.html",controller:"MainCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]);app.run(function(){}),app.controller("MainCtrl",["$rootScope","$scope","$routeParams","$location","$timeout","$q","$localForage",function(a,b,c,d,e,f,g){"use strict";var h=$("video")[0];b.notPlaying=!0,b.currentProgress=0,b.currentVideoName="",b.rangeProgressTick=$(".range-progress-tick"),b.videoFiles=localStorage.getItem("videoFiles")?JSON.parse(localStorage.getItem("videoFiles")):[],b.tracks=[],b.rangeProgressTickHeight=58*b.tracks.length>210?210:58*b.tracks.length,b.$watch("selectedTrack.startTime",function(){b.save()}),b.$watch("selectedTrack.endTime",function(){b.save()}),b.$watch("selectedTrack.loop",function(){b.save()}),b.$watch("selectedTrack.speed",function(){b.save()}),b.$watch("selectedTrack.description",function(){b.save()}),b.save=function(){var a=JSON.parse(localStorage.getItem("videoFiles"));for(var c in a)a[c].name==b.currentVideoName&&(a[c].tracks=b.tracks);localStorage.setItem("videoFiles",angular.toJson(a))},b.AddTrack=function(){b.track={startTime:0,endTime:0,loop:0,speed:1,description:""},b.tracks.push(b.track),b.save()},b.SelectTrack=function(a){b.itemIndex=a,b.selectedTrack=b.tracks[a],h.currentTime=b.selectedTrack.startTime,b.showCurrentTime(h.currentTime),b.Pause()},b.Play=function(){h.playbackRate=b.selectedTrack.speed,h.play(),b.notPlaying=!1},b.Pause=function(){h.pause(),b.notPlaying=!0},b.selectedTrack=b.tracks[0],b.itemIndex=0,b.showCurrentTime=function(a){var c=b.inc*a;c=Math.round(100*c)/100,e(function(){b.currentProgress=c+"px"},0)},$(h).on("timeupdate",function(){b.notPlaying||(b.showCurrentTime(h.currentTime),Math.floor(h.currentTime)==Math.floor(b.selectedTrack.endTime)&&(h.currentTime=b.selectedTrack.startTime,b.selectedTrack.loop>0?b.selectedTrack.loop=b.selectedTrack.loop-1:h.pause()))}),b.fileModel={},b.fileModel.fileread=null,b.videoFiles=JSON.parse(localStorage.getItem("videoFiles"))||[],b.showUploadInput=!0,b.$watch("fileModel.fileread",function(){b.AddVideo()}),b.AddVideo=function(){if(b.fileModel.fileread){b.showUploadInput=!1;var a=new FileReader;a.onload=function(a){g.setItem(b.fileModel.fileread.name,a.target.result).then(function(){var a={name:b.fileModel.fileread.name,tracks:[]},c={startTime:0,endTime:0,loop:0,speed:1,description:"Track"};a.tracks.push(c),b.videoFiles.push(a),localStorage.setItem("videoFiles",JSON.stringify(b.videoFiles)),b.fileUpload=!1,e(function(){b.SelectVideo(b.fileModel.fileread.name)},500)})},a.readAsDataURL(b.fileModel.fileread)}},b.SelectVideo=function(a){b.videoStartSpinner=!0,g.getItem(a).then(function(c){c&&(h.src=c),b.currentVideoName=a,$("video").on("loadeddata",function(){b.videoStartSpinner=!1,b.ShowTracks(a),$(this).show(),$(".branding").hide(),b.$apply()})})},b.ShowTracks=function(a){var c=JSON.parse(localStorage.getItem("videoFiles"));for(var d in c)c[d].name==a&&(b.tracks=c[d].tracks,b.$apply())},b.DeleteVideo=function(a){g.getItem(a).then(function(){b.videoFiles.indexOf(a);localStorage.setItem("videoFiles",JSON.stringify(b.videoFiles))})},b.ShowFileUploader=function(){b.fileUpload=!0,b.showUploadInput=!0}}]),app.directive("range",["$timeout",function(a){"use strict";return{require:"ngModel",template:'<a href="" class="fa fa-trash-o" ng-click="Delete()"></a>              <h5 ng-click="ShowField()" ng-show="nofield">{{ngModel.description}}</h5>              <input type="text" name="" ng-hide="nofield" ng-blur="HideField()" class="description" ng-model="ngModel.description" />              <div class="range-holder">                  <div class="range-track"></div>                  <div class="range-selection" style="left: {{ngModel.rangeSelection.left}}; width: {{ngModel.rangeSelection.width}}"></div>                  <div class="range-handle left-handle" style="left: {{ngModel.handle1}}"></div>                  <div class="range-handle right-handle" style="left: {{ngModel.handle2}}"></div>                </div>                <div class="playback-control">                  <div class="playback-group">                    <span class="pb-label">Loops:</span>                    <a href="" class="fa fa-minus-square" ng-click="MinusLoop()"></a>                    <span class="val" msd-wheel="ManageLoop($event, $delta, $deltaX, $deltaY)">{{ngModel.loop}}</span>                    <a href="" class="fa fa-plus-square" ng-click="PlusLoop()"></a>                  </div>                  <div class="playback-group">                    <span class="pb-label">Speed:</span>                    <a href="" class="fa fa-minus-square" ng-click="MinusSpeed()"></a>                    <span class="val" msd-wheel="ManageSpeed($event, $delta, $deltaX, $deltaY)">{{ngModel.speed * 100}}%</span>                    <a href="" class="fa fa-plus-square" ng-click="PlusSpeed()"></a>                  </div>                </div>              </div>',scope:{ngModel:"=",ngTracks:"="},link:function(b,c){b.nofield=!0,b.ngModel.description?b.ngModel.description:b.ngModel.description="Track name",b.ShowField=function(){b.nofield=!1},b.HideField=function(){b.nofield=!0},b.Delete=function(){var a=b.ngTracks.indexOf(b.ngModel);b.ngTracks.splice(a,1),localStorage.setItem("tracks",JSON.stringify(b.ngTracks))},b.MinusLoop=function(){b.ngModel.loop>0&&b.ngModel.loop--},b.PlusLoop=function(){b.ngModel.loop++},b.MinusSpeed=function(){if(b.ngModel.speed>.1){var a=b.ngModel.speed-.1;b.ngModel.speed=Math.round(100*a)/100}},b.PlusSpeed=function(){if(b.ngModel.speed<1){var a=b.ngModel.speed+.1;b.ngModel.speed=Math.round(100*a)/100}},b.ManageLoop=function(a,c){a.preventDefault(),c>0?b.ngModel.loop++:b.ngModel.loop>0&&b.ngModel.loop--},b.ManageSpeed=function(a,c){if(a.preventDefault(),c>0){if(b.ngModel.speed<1){var d=b.ngModel.speed+.1;b.ngModel.speed=Math.round(100*d)/100}}else if(b.ngModel.speed>0){var d=b.ngModel.speed-.1;b.ngModel.speed=Math.round(100*d)/100}},$.fn.rangeSelector=function(c){var d,e=$(this),f=e.find(".range-track"),g=e.find(".range-selection"),h=(g.width(),e.find(".range-handle:first"),e.find(".range-handle:last"),c.video),i=!1,j=0,k=[0,0],l=c.duration||120,m=window.setInterval(function(){h[0].readyState>0&&(l=h[0].duration,s(),clearInterval(m))},100),n=function(a){var b=a.pageX,c=f.offset().left+f[0].offsetWidth,d=f.offset().left;j=Math.min(Math.max(d,b),c)-f.offset().left},o=function(a){var b=f.width()/l,c=parseInt(a/b);return c},p=function(a){i&&(n(a),0==d&&k[1]<j?(k[0]=k[1],d=1):1==d&&k[0]>j&&(k[1]=k[0],d=0),k[d]=j,h[0].currentTime=o(j),t())},q=function(){i=!1},r=function(a){i=!0,n(a);var b=Math.abs(j-k[0]),c=Math.abs(j-k[1]);d=c>b?0:1,k[d]=j,h[0].currentTime=o(j),t(),e.on({mousemove:p})},s=function(){var a=f.width()/l;b.ngModel.handle1=parseInt(b.ngModel.startTime*a)+"px",b.ngModel.handle2=parseInt(b.ngModel.endTime*a)+"px",b.ngModel.rangeSelection={left:b.ngModel.startTime*a+"px",width:b.ngModel.endTime*a-b.ngModel.startTime*a+"px"},k[0]=parseInt(b.ngModel.startTime*a),k[1]=parseInt(b.ngModel.endTime*a)},t=function(){var c=f.width()/l;b.ngModel.handle1=k[0]+"px",b.ngModel.handle2=k[1]+"px",b.ngModel.rangeSelection={left:k[0]+"px",width:k[1]-k[0]+"px"},a(function(){b.ngModel.startTime=parseInt(k[0]/c),b.ngModel.endTime=parseInt(k[1]/c)})};e.on({mousedown:r,mouseup:q})},$(c).find(".range-holder").rangeSelector({video:$("video")})}}}]),app.directive("fileread",[function(){"use strict";return{scope:{fileread:"="},link:function(a,b){b.bind("change",function(b){a.$apply(function(){a.fileread=b.target.files[0]})})}}}]),angular.module("videoLoop").run(["$templateCache",function(a){"use strict";a.put("views/videoloop.html",'<div class="main-col">\n  <div class="video-wrap">\n    \n    <div class="video">\n      <div class="branding">\n        <img src="images/logo1.png" alt="">\n        <p class="tagline">move at your own speed</p>\n        <p class="select">Start looping by <span ng-show="{{tracks.length}}">uploading</span> <span ng-hide="{{tracks.length}}">selecting</span> a video <span class="fa fa-arrow-right"></span></p>\n      </div>\n      <i class="fa fa-spinner fa-spin" ng-show="videoStartSpinner"></i>\n      <video id="demo" src="{{videoFileUrl}}" ></video>\n    </div>\n  </div>\n\n  <section class="track-select">\n    <div class="tools">\n      <div class="video-controls">\n        <a href="" ng-click="Play()" class="" ng-show="notPlaying"><i class="fa fa-play"></i></a>\n        <a href="" ng-click="Pause()" class="" ng-hide="notPlaying"><i class="fa fa-pause"></i></a>\n      </div>\n      <div class="time">\n        <span>{{selectedTrack.startTime}}"</span>-<span>{{selectedTrack.endTime}}"</span>\n      </div>\n    </div>\n    \n    <a href="" ng-click="AddTrack()" class="btn add-track">Add track</a>\n    <div class="range-progress">\n      <div class="range-progress-tick" style="height:{{rangeProgressTickHeight}}px;left: {{currentProgress}}"></div>\n    </div>\n    <div class="tracks-wrap">\n      <ul class="tracks">\n        <li ng-repeat="item in tracks track by $index" ng-click="SelectTrack($index)" ng-class="{\'active\': $index == itemIndex}">\n          <div range ng-model="item" ng-tracks="tracks"></div>\n        </li>\n      </ul>\n    </div>\n  </section>\n</div>\n<aside>\n  <a href="" class="btn upload-file-btn" ng-click="ShowFileUploader()">Upload a video file</a>\n  <div class="upload-file" ng-show="fileUpload">\n    <i class="fa fa-spinner fa-spin" ng-hide="showUploadInput"></i>\n    <input \n      type="file" \n      name="" \n      class="file-input" \n      fileread="fileModel.fileread"\n      ng-show="showUploadInput"\n       />\n  </div>\n  <ul class="video-files">\n    <li ng-repeat="videoFile in videoFiles track by $index">\n      <a href="" ng-click="SelectVideo(videoFile.name)">\n        {{videoFile.name}}\n      </a>\n      <a href="" \n          class="delete" \n          ng-click="DeleteVideo(videoFile.name); $event.stopPropagation()">\n          &times;\n        </a>\n    </li>\n  </ul>\n</aside>\n')}]);