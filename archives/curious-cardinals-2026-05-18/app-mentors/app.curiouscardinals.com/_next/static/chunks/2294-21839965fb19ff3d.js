(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2294],{54125:function(e){e.exports=function(){var e={80:function(e,t,i){e.exports=i(728).default},728:function(e,t,i){"use strict";i.d(t,{default:function(){return tx}});var a=i(48),r=i.n(a),n=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})},s=function(){return("000000"+(2176782336*Math.random()<<0).toString(36)).slice(-6)},o=function(e){return e&&void 0!==e.nodeName?(e.muxId||(e.muxId=e.id||s()),e.muxId):e},l=function(e){e&&void 0!==e.nodeName?e=o(t=e):t=document.querySelector(e);var t,i=t&&t.nodeName?t.nodeName.toLowerCase():"";return[t,e,i]},d=i(640),u=i.n(d),c=u().methodFactory;u().methodFactory=function(e,t,i){var a=c(e,t,i);return function(){for(var e=["[mux]"],t=0;t<arguments.length;t++)e.push(arguments[t]);a.apply(void 0,e)}},u().setLevel(u().getLevel());var h=u();function m(){return"1"===(r().doNotTrack||r().navigator&&r().navigator.doNotTrack)}var p={now:function(){var e=r().performance,t=e&&e.timing,i=t&&t.navigationStart;return Math.round("number"==typeof i&&"function"==typeof e.now?i+e.now():Date.now())}},v=function(e){return b(e)[0]},b=function(e){if("string"!=typeof e||""===e)return["localhost"];var t,i=(e.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/)||[])[4];return i&&(t=(i.match(/[^\.]+\.[^\.]+$/)||[])[0]),[i,t]},E={exists:function(){var e=r().performance;return void 0!==(e&&e.timing)},domContentLoadedEventEnd:function(){var e=r().performance,t=e&&e.timing;return t&&t.domContentLoadedEventEnd},navigationStart:function(){var e=r().performance,t=e&&e.timing;return t&&t.navigationStart}};function f(e,t,i){i=void 0===i?1:i,e[t]=e[t]||0,e[t]+=i}var g=["x-request-id","cf-ray","x-amz-cf-id","x-akamai-request-id"],_=["x-cdn","content-type"].concat(g);function y(e){var t={};return(e=e||"").trim().split(/[\r\n]+/).forEach(function(e){if(e){var i=e.split(": "),a=i.shift();a&&(_.indexOf(a.toLowerCase())>=0||0===a.toLowerCase().indexOf("x-litix-"))&&(t[a]=i.join(": "))}}),t}function A(e){if(e){var t=g.find(function(t){return void 0!==e[t]});return t?e[t]:void 0}}var T=function(e){var t={};for(var i in e){var a=e[i];-1!==a["DATA-ID"].search("io.litix.data.")&&(t[a["DATA-ID"].replace("io.litix.data.","")]=a.VALUE)}return t};function k(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function w(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?k(Object(i),!0).forEach(function(t){var a;a=i[t],t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):k(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var I=function(e){if(!e)return{};var t=E.navigationStart(),i=e.loading,a=i?i.start:e.trequest,r=i?i.first:e.tfirst,n=i?i.end:e.tload;return{bytesLoaded:e.total,requestStart:Math.round(t+a),responseStart:Math.round(t+r),responseEnd:Math.round(t+n)}},S=function(e){if(e&&"function"==typeof e.getAllResponseHeaders)return y(e.getAllResponseHeaders())};function L(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function D(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?L(Object(i),!0).forEach(function(t){var a;a=i[t],t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):L(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var R=function(e,t){if(!e||"function"!=typeof e.getRequests)return{};var i=e.getRequests({state:"executed"});if(0===i.length)return{};var a,r=i[i.length-1],n=v(r.url),s=r.url,o=r.bytesLoaded,l=new Date(r.requestStartDate).getTime(),d=new Date(r.firstByteDate).getTime(),u=new Date(r.requestEndDate).getTime(),c=isNaN(r.duration)?0:r.duration,h="function"==typeof t.getMetricsFor?t.getMetricsFor(r.mediaType).HttpList:t.getDashMetrics().getHttpRequests(r.mediaType);return h.length>0&&(a=y(h[h.length-1]._responseHeaders||"")),{requestStart:l,requestResponseStart:d,requestResponseEnd:u,requestBytesLoaded:o,requestResponseHeaders:a,requestMediaDuration:c,requestHostname:n,requestUrl:s,requestId:a?A(a):void 0}},M=function(e,t){var i=t.getQualityFor(e),a=t.getCurrentTrackFor(e).bitrateList;return a?{currentLevel:i,renditionWidth:a[i].width||null,renditionHeight:a[i].height||null,renditionBitrate:a[i].bandwidth}:{}},C=function(e){var t;return null===(t=e.match(/.*codecs\*?="(.*)"/))||void 0===t?void 0:t[1]};function O(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var x=0,N=function(){var e,t;function i(){!function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,i)}return e=[{key:"on",value:function(e,t,i){return t._eventEmitterGuid=t._eventEmitterGuid||++x,this._listeners=this._listeners||{},this._listeners[e]=this._listeners[e]||[],i&&(t=t.bind(i)),this._listeners[e].push(t),t}},{key:"off",value:function(e,t){var i=this._listeners&&this._listeners[e];i&&i.forEach(function(e,a){e._eventEmitterGuid===t._eventEmitterGuid&&i.splice(a,1)})}},{key:"one",value:function(e,t,i){var a=this;t._eventEmitterGuid=t._eventEmitterGuid||++x;var r=function r(){a.off(e,r),t.apply(i||this,arguments)};r._eventEmitterGuid=t._eventEmitterGuid,this.on(e,r)}},{key:"emit",value:function(e,t){var i=this;if(this._listeners){t=t||{};var a=this._listeners["before*"]||[],r=this._listeners[e]||[],n=this._listeners["after"+e]||[],s=function(t,a){(t=t.slice()).forEach(function(t){t.call(i,{type:e},a)})};s(a,t),s(r,t),s(n,t)}}}],O(i.prototype,e),t&&O(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function P(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var U=function(){var e;function t(e){var i=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,t),this.pm=e,this._playbackHeartbeatInterval=null,this._playheadShouldBeProgressing=!1,e.on("playing",function(){i._playheadShouldBeProgressing=!0}),e.on("play",this._startPlaybackHeartbeatInterval.bind(this)),e.on("playing",this._startPlaybackHeartbeatInterval.bind(this)),e.on("adbreakstart",this._startPlaybackHeartbeatInterval.bind(this)),e.on("adplay",this._startPlaybackHeartbeatInterval.bind(this)),e.on("adplaying",this._startPlaybackHeartbeatInterval.bind(this)),e.on("seeking",this._startPlaybackHeartbeatInterval.bind(this)),e.on("devicewake",this._startPlaybackHeartbeatInterval.bind(this)),e.on("viewstart",this._startPlaybackHeartbeatInterval.bind(this)),e.on("rebufferstart",this._startPlaybackHeartbeatInterval.bind(this)),e.on("pause",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("ended",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("viewend",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("error",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("aderror",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("adpause",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("adended",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("adbreakend",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("seeked",function(){e.data.player_is_paused?i._stopPlaybackHeartbeatInterval():i._startPlaybackHeartbeatInterval()}),e.on("timeupdate",function(){null!==i._playbackHeartbeatInterval&&e.emit("playbackheartbeat")}),e.on("devicesleep",function(t,a){null!==i._playbackHeartbeatInterval&&(r().clearInterval(i._playbackHeartbeatInterval),e.emit("playbackheartbeatend",{viewer_time:a.viewer_time}),i._playbackHeartbeatInterval=null)})}return P(t.prototype,[{key:"_startPlaybackHeartbeatInterval",value:function(){var e=this;null===this._playbackHeartbeatInterval&&(this.pm.emit("playbackheartbeat"),this._playbackHeartbeatInterval=r().setInterval(function(){e.pm.emit("playbackheartbeat")},this.pm.playbackHeartbeatTime))}},{key:"_stopPlaybackHeartbeatInterval",value:function(){this._playheadShouldBeProgressing=!1,null!==this._playbackHeartbeatInterval&&(r().clearInterval(this._playbackHeartbeatInterval),this.pm.emit("playbackheartbeatend"),this._playbackHeartbeatInterval=null)}}]),e&&P(t,e),Object.defineProperty(t,"prototype",{writable:!1}),t}();function B(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var W=(e5=function e(t){var i=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,e),t.on("viewinit",function(){i.viewErrored=!1}),t.on("error",function(e,a){try{var r=t.errorTranslator({player_error_code:a.player_error_code,player_error_message:a.player_error_message,player_error_context:a.player_error_context});r?(t.data.player_error_code=r.player_error_code||a.player_error_code,t.data.player_error_message=r.player_error_message||a.player_error_message,t.data.player_error_context=r.player_error_context||a.player_error_context,i.viewErrored=!0):(delete t.data.player_error_code,delete t.data.player_error_message,delete t.data.player_error_context)}catch(e){t.mux.log.warn("Exception in error translator callback.",e),i.viewErrored=!0}})},e3&&B(e5.prototype,e3),e4&&B(e5,e4),Object.defineProperty(e5,"prototype",{writable:!1}),e5);function V(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var q=function(){var e,t;function i(e){(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,i),this.pm=e,this._watchTimeTrackerLastCheckedTime=null,e.on("playbackheartbeat",this._updateWatchTime.bind(this)),e.on("playbackheartbeatend",this._clearWatchTimeState.bind(this))}return e=[{key:"_updateWatchTime",value:function(e,t){var i=t.viewer_time;null===this._watchTimeTrackerLastCheckedTime&&(this._watchTimeTrackerLastCheckedTime=i),f(this.pm.data,"view_watch_time",i-this._watchTimeTrackerLastCheckedTime),this._watchTimeTrackerLastCheckedTime=i}},{key:"_clearWatchTimeState",value:function(e,t){this._updateWatchTime(e,t),this._watchTimeTrackerLastCheckedTime=null}}],V(i.prototype,e),t&&V(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function H(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var F=function(){var e,t;function i(e){var t=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,i),this.pm=e,this._playbackTimeTrackerLastPlayheadPosition=-1,this._lastTime=p.now(),this._isAdPlaying=!1,this._callbackUpdatePlaybackTime=null;var a=this._startPlaybackTimeTracking.bind(this);e.on("playing",a),e.on("adplaying",a),e.on("seeked",a);var r=this._stopPlaybackTimeTracking.bind(this);e.on("playbackheartbeatend",r),e.on("seeking",r),e.on("adplaying",function(){t._isAdPlaying=!0}),e.on("adended",function(){t._isAdPlaying=!1}),e.on("adpause",function(){t._isAdPlaying=!1}),e.on("adbreakstart",function(){t._isAdPlaying=!1}),e.on("adbreakend",function(){t._isAdPlaying=!1}),e.on("adplay",function(){t._isAdPlaying=!1}),e.on("viewinit",function(){t._playbackTimeTrackerLastPlayheadPosition=-1,t._lastTime=p.now(),t._isAdPlaying=!1,t._callbackUpdatePlaybackTime=null})}return e=[{key:"_startPlaybackTimeTracking",value:function(){null===this._callbackUpdatePlaybackTime&&(this._callbackUpdatePlaybackTime=this._updatePlaybackTime.bind(this),this._playbackTimeTrackerLastPlayheadPosition=this.pm.data.player_playhead_time,this.pm.on("playbackheartbeat",this._callbackUpdatePlaybackTime))}},{key:"_stopPlaybackTimeTracking",value:function(){this._callbackUpdatePlaybackTime&&(this._updatePlaybackTime(),this.pm.off("playbackheartbeat",this._callbackUpdatePlaybackTime),this._callbackUpdatePlaybackTime=null,this._playbackTimeTrackerLastPlayheadPosition=-1)}},{key:"_updatePlaybackTime",value:function(){var e=this.pm.data.player_playhead_time,t=p.now(),i=-1;this._playbackTimeTrackerLastPlayheadPosition>=0&&e>this._playbackTimeTrackerLastPlayheadPosition?i=e-this._playbackTimeTrackerLastPlayheadPosition:this._isAdPlaying&&(i=t-this._lastTime),i>0&&i<=1e3&&f(this.pm.data,"view_content_playback_time",i),this._playbackTimeTrackerLastPlayheadPosition=e,this._lastTime=t}}],H(i.prototype,e),t&&H(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function $(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var j=function(){var e,t;function i(e){(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,i),this.pm=e;var t=this._updatePlayheadTime.bind(this);e.on("playbackheartbeat",t),e.on("playbackheartbeatend",t),e.on("timeupdate",t),e.on("destroy",function(){e.off("timeupdate",t)})}return e=[{key:"_updateMaxPlayheadPosition",value:function(){this.pm.data.view_max_playhead_position=void 0===this.pm.data.view_max_playhead_position?this.pm.data.player_playhead_time:Math.max(this.pm.data.view_max_playhead_position,this.pm.data.player_playhead_time)}},{key:"_updatePlayheadTime",value:function(e,t){var i=this,a=function(){i.pm.currentFragmentPDT&&i.pm.currentFragmentStart&&(i.pm.data.player_program_time=i.pm.currentFragmentPDT+i.pm.data.player_playhead_time-i.pm.currentFragmentStart)};if(t&&t.player_playhead_time)this.pm.data.player_playhead_time=t.player_playhead_time,a(),this._updateMaxPlayheadPosition();else if(this.pm.getPlayheadTime){var r=this.pm.getPlayheadTime();void 0!==r&&(this.pm.data.player_playhead_time=r,a(),this._updateMaxPlayheadPosition())}}}],$(i.prototype,e),t&&$(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function K(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var Y=(e7=function e(t){if(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,e),!t.disableRebufferTracking){var i,a=function(e,t){r(t),i=void 0},r=function(e){if(i){var a=e.viewer_time-i;f(t.data,"view_rebuffer_duration",a),i=e.viewer_time,t.data.view_rebuffer_duration>3e5&&(t.emit("viewend"),t.send("viewend"),t.mux.log.warn("Ending view after rebuffering for longer than ".concat(3e5,"ms, future events will be ignored unless a programchange or videochange occurs.")))}t.data.view_watch_time>=0&&t.data.view_rebuffer_count>0&&(t.data.view_rebuffer_frequency=t.data.view_rebuffer_count/t.data.view_watch_time,t.data.view_rebuffer_percentage=t.data.view_rebuffer_duration/t.data.view_watch_time)};t.on("playbackheartbeat",function(e,t){return r(t)}),t.on("rebufferstart",function(e,r){i||(f(t.data,"view_rebuffer_count",1),i=r.viewer_time,t.one("rebufferend",a))}),t.on("viewinit",function(){i=void 0,t.off("rebufferend",a)})}},e8&&K(e7.prototype,e8),e6&&K(e7,e6),Object.defineProperty(e7,"prototype",{writable:!1}),e7);function G(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var Q=function(){var e,t;function i(e){var t=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,i),this.pm=e,e.disableRebufferTracking||e.disablePlayheadRebufferTracking||(this._lastCheckedTime=null,this._lastPlayheadTime=null,this._lastPlayheadTimeUpdatedTime=null,e.on("playbackheartbeat",this._checkIfRebuffering.bind(this)),e.on("playbackheartbeatend",this._cleanupRebufferTracker.bind(this)),e.on("seeking",function(){t._cleanupRebufferTracker(null,{viewer_time:p.now()})}))}return e=[{key:"_checkIfRebuffering",value:function(e,t){if(this.pm.seekingTracker.isSeeking||this.pm.adTracker.isAdBreak||!this.pm.playbackHeartbeat._playheadShouldBeProgressing)this._cleanupRebufferTracker(e,t);else if(null!==this._lastCheckedTime){if(this._lastPlayheadTime===this.pm.data.player_playhead_time){var i=t.viewer_time-this._lastPlayheadTimeUpdatedTime;"number"==typeof this.pm.sustainedRebufferThreshold&&i>=this.pm.sustainedRebufferThreshold&&(this._rebuffering||(this._rebuffering=!0,this.pm.emit("rebufferstart",{viewer_time:this._lastPlayheadTimeUpdatedTime}))),this._lastCheckedTime=t.viewer_time}else this._cleanupRebufferTracker(e,t,!0)}else this._prepareRebufferTrackerState(t.viewer_time)}},{key:"_clearRebufferTrackerState",value:function(){this._lastCheckedTime=null,this._lastPlayheadTime=null,this._lastPlayheadTimeUpdatedTime=null}},{key:"_prepareRebufferTrackerState",value:function(e){this._lastCheckedTime=e,this._lastPlayheadTime=this.pm.data.player_playhead_time,this._lastPlayheadTimeUpdatedTime=e}},{key:"_cleanupRebufferTracker",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(this._rebuffering)this._rebuffering=!1,this.pm.emit("rebufferend",{viewer_time:t.viewer_time});else{if(null===this._lastCheckedTime)return;var a=this.pm.data.player_playhead_time-this._lastPlayheadTime,r=t.viewer_time-this._lastPlayheadTimeUpdatedTime;"number"==typeof this.pm.minimumRebufferDuration&&a>0&&r-a>this.pm.minimumRebufferDuration&&(this._lastCheckedTime=null,this.pm.emit("rebufferstart",{viewer_time:this._lastPlayheadTimeUpdatedTime}),this.pm.emit("rebufferend",{viewer_time:this._lastPlayheadTimeUpdatedTime+r-a}))}i?this._prepareRebufferTrackerState(t.viewer_time):this._clearRebufferTrackerState()}}],G(i.prototype,e),t&&G(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function Z(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var z=function(){var e;function t(e){var i=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,t),this.pm=e,e.on("viewinit",function(){var t=e.data,a=t.view_id;if(!t.view_program_changed){var r=function(t,r){var n=r.viewer_time;"playing"===t.type&&void 0===e.data.view_time_to_first_frame?i.calculateTimeToFirstFrame(n||p.now(),a):"adplaying"===t.type&&(void 0===e.data.view_time_to_first_frame||i._inPrerollPosition())&&i.calculateTimeToFirstFrame(n||p.now(),a)};e.one("playing",r),e.one("adplaying",r),e.one("viewend",function(){e.off("playing",r),e.off("adplaying",r)})}})}return Z(t.prototype,[{key:"_inPrerollPosition",value:function(){return void 0===this.pm.data.view_content_playback_time||this.pm.data.view_content_playback_time<=1e3}},{key:"calculateTimeToFirstFrame",value:function(e,t){t===this.pm.data.view_id&&(this.pm.watchTimeTracker._updateWatchTime(null,{viewer_time:e}),this.pm.data.view_time_to_first_frame=this.pm.data.view_watch_time,(this.pm.data.player_autoplay_on||this.pm.data.video_is_autoplay)&&this.NAVIGATION_START&&(this.pm.data.view_aggregate_startup_time=this.pm.data.view_start+this.pm.data.view_watch_time-this.NAVIGATION_START))}}]),e&&Z(t,e),Object.defineProperty(t,"prototype",{writable:!1}),t}();function X(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var J=(e9=function e(t){var i=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,e),t.on("viewinit",function(){i._lastPlayheadPosition=-1}),["pause","rebufferstart","seeking","error","adbreakstart","hb"].forEach(function(e){t.on(e,function(){if(i._lastPlayheadPosition>=0&&t.data.player_playhead_time>=0&&i._lastPlayerWidth>=0&&i._lastSourceWidth>0&&i._lastPlayerHeight>=0&&i._lastSourceHeight>0){var e=t.data.player_playhead_time-i._lastPlayheadPosition;if(e<0)return void(i._lastPlayheadPosition=-1);var a=Math.min(i._lastPlayerWidth/i._lastSourceWidth,i._lastPlayerHeight/i._lastSourceHeight),r=Math.max(0,a-1),n=Math.max(0,1-a);t.data.view_max_upscale_percentage=Math.max(t.data.view_max_upscale_percentage||0,r),t.data.view_max_downscale_percentage=Math.max(t.data.view_max_downscale_percentage||0,n),f(t.data,"view_total_content_playback_time",e),f(t.data,"view_total_upscaling",r*e),f(t.data,"view_total_downscaling",n*e)}i._lastPlayheadPosition=-1})}),["playing","hb"].forEach(function(e){t.on(e,function(){i._lastPlayheadPosition=t.data.player_playhead_time,i._lastPlayerWidth=t.data.player_width,i._lastPlayerHeight=t.data.player_height,i._lastSourceWidth=t.data.video_source_width,i._lastSourceHeight=t.data.video_source_height})})},te&&X(e9.prototype,te),tt&&X(e9,tt),Object.defineProperty(e9,"prototype",{writable:!1}),e9);function ee(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var et=(ti=function e(t){var i=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,e),this.isSeeking=!1;var a=-1,r=function(){var e=p.now(),r=(t.data.viewer_time||e)-(a||e);f(t.data,"view_seek_duration",r),t.data.view_max_seek_time=Math.max(t.data.view_max_seek_time||0,r),i.isSeeking=!1,a=-1};t.on("seeking",function(e,n){Object.assign(t.data,n),i.isSeeking&&n.viewer_time-a<=2e3?a=n.viewer_time:(i.isSeeking&&r(),i.isSeeking=!0,a=n.viewer_time,f(t.data,"view_seek_count",1),t.send("seeking"))}),t.on("seeked",function(){r()}),t.on("viewend",function(){i.isSeeking&&(r(),t.send("seeked")),i.isSeeking=!1,a=-1})},ta&&ee(ti.prototype,ta),tr&&ee(ti,tr),Object.defineProperty(ti,"prototype",{writable:!1}),ti);function ei(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var a,r,n=[],s=!0,o=!1;try{for(i=i.call(e);!(s=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);s=!0);}catch(e){o=!0,r=e}finally{try{s||null==i.return||i.return()}finally{if(o)throw r}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return ea(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?ea(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ea(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,a=Array(t);i<t;i++)a[i]=e[i];return a}function er(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var en=function(e,t){e.push(t),e.sort(function(e,t){return e.viewer_time-t.viewer_time})},es=["adbreakstart","adrequest","adresponse","adplay","adplaying","adpause","adended","adbreakend","aderror","adclicked","adskipped"],eo=function(){var e,t;function i(e){var t=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,i),this.pm=e,e.on("viewinit",function(){t.isAdBreak=!1,t._currentAdRequestNumber=0,t._currentAdResponseNumber=0,t._adRequests=[],t._adResponses=[],t._adHasPlayed=!1,t._wouldBeNewAdPlay=!0,t._prerollPlayTime=void 0}),es.forEach(function(i){return e.on(i,t._updateAdData.bind(t))});var a=function(){t.isAdBreak=!1};e.on("adbreakstart",function(){t.isAdBreak=!0}),e.on("play",a),e.on("playing",a),e.on("viewend",a),e.on("adrequest",function(i,a){a=Object.assign({ad_request_id:"generatedAdRequestId"+t._currentAdRequestNumber++},a),en(t._adRequests,a),f(e.data,"view_ad_request_count"),t.inPrerollPosition()&&(e.data.view_preroll_requested=!0,t._adHasPlayed||f(e.data,"view_preroll_request_count"))}),e.on("adresponse",function(i,a){a=Object.assign({ad_request_id:"generatedAdRequestId"+t._currentAdResponseNumber++},a),en(t._adResponses,a);var r=t.findAdRequest(a.ad_request_id);r&&f(e.data,"view_ad_request_time",Math.max(0,a.viewer_time-r.viewer_time))}),e.on("adplay",function(i,a){t._adHasPlayed=!0,t._wouldBeNewAdPlay&&(t._wouldBeNewAdPlay=!1,f(e.data,"view_ad_played_count")),t.inPrerollPosition()&&!e.data.view_preroll_played&&(e.data.view_preroll_played=!0,t._adRequests.length>0&&(e.data.view_preroll_request_time=Math.max(0,a.viewer_time-t._adRequests[0].viewer_time)),e.data.view_start&&(e.data.view_startup_preroll_request_time=Math.max(0,a.viewer_time-e.data.view_start)),t._prerollPlayTime=a.viewer_time)}),e.on("adplaying",function(i,a){t.inPrerollPosition()&&void 0===e.data.view_preroll_load_time&&void 0!==t._prerollPlayTime&&(e.data.view_preroll_load_time=a.viewer_time-t._prerollPlayTime,e.data.view_startup_preroll_load_time=a.viewer_time-t._prerollPlayTime)}),e.on("adclicked",function(i,a){t._wouldBeNewAdPlay||f(e.data,"view_ad_clicked_count")}),e.on("adskipped",function(i,a){t._wouldBeNewAdPlay||f(e.data,"view_ad_skipped_count")}),e.on("adended",function(){t._wouldBeNewAdPlay=!0}),e.on("aderror",function(){t._wouldBeNewAdPlay=!0})}return e=[{key:"inPrerollPosition",value:function(){return void 0===this.pm.data.view_content_playback_time||this.pm.data.view_content_playback_time<=1e3}},{key:"findAdRequest",value:function(e){for(var t=0;t<this._adRequests.length;t++)if(this._adRequests[t].ad_request_id===e)return this._adRequests[t]}},{key:"_updateAdData",value:function(e,t){if(this.inPrerollPosition()){if(!this.pm.data.view_preroll_ad_tag_hostname&&t.ad_tag_url){var i=ei(b(t.ad_tag_url),2),a=i[0],r=i[1];this.pm.data.view_preroll_ad_tag_domain=r,this.pm.data.view_preroll_ad_tag_hostname=a}if(!this.pm.data.view_preroll_ad_asset_hostname&&t.ad_asset_url){var n=ei(b(t.ad_asset_url),2),s=n[0],o=n[1];this.pm.data.view_preroll_ad_asset_domain=o,this.pm.data.view_preroll_ad_asset_hostname=s}}this.pm.data.ad_asset_url=null==t?void 0:t.ad_asset_url,this.pm.data.ad_tag_url=null==t?void 0:t.ad_tag_url,this.pm.data.ad_creative_id=null==t?void 0:t.ad_creative_id,this.pm.data.ad_id=null==t?void 0:t.ad_id,this.pm.data.ad_universal_id=null==t?void 0:t.ad_universal_id}}],er(i.prototype,e),t&&er(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function el(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var ed=(tn=function e(t){!function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,e);var i,a,n=function(){t.disableRebufferTracking||i&&(f(t.data,"view_waiting_rebuffer_duration",p.now()-i),i=!1,r().clearInterval(a))},s=!1,o=function(){s=!1,n()};t.on("waiting",function(){s&&(t.disableRebufferTracking||(f(t.data,"view_waiting_rebuffer_count",1),i=p.now(),a=r().setInterval(function(){if(i){var e=p.now();f(t.data,"view_waiting_rebuffer_duration",e-i),i=e}},250)))}),t.on("playing",function(){n(),s=!0}),t.on("pause",o),t.on("seeking",o)},ts&&el(tn.prototype,ts),to&&el(tn,to),Object.defineProperty(tn,"prototype",{writable:!1}),tn);function eu(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var ec=(tl=function e(t){var i=this;!function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,e);var a=function(){i.lastWallClockTime=p.now(),t.on("before*",r)},r=function(e){var a=p.now(),r=i.lastWallClockTime;i.lastWallClockTime=a,a-r>3e4&&(t.emit("devicesleep",{viewer_time:r}),Object.assign(t.data,{viewer_time:r}),t.send("devicesleep"),t.emit("devicewake",{viewer_time:a}),Object.assign(t.data,{viewer_time:a}),t.send("devicewake"))};t.one("playbackheartbeat",a),t.on("playbackheartbeatend",function(){t.off("before*",r),t.one("playbackheartbeat",a)})},td&&eu(tl.prototype,td),tu&&eu(tl,tu),Object.defineProperty(tl,"prototype",{writable:!1}),tl),eh=i(375),em=i(655),ep=i.n(em),ev="muxData",eb=function(){var e;try{e=eh.parse(ep().get(ev)||"")}catch(t){e={}}return e},eE=function(e){try{ep().set(ev,eh.stringify(e),{expires:365})}catch(e){}},ef=function(){var e=eb();return e.mux_viewer_id=e.mux_viewer_id||n(),e.msn=e.msn||Math.random(),eE(e),{mux_viewer_id:e.mux_viewer_id,mux_sample_number:e.msn}},eg=function(){var e;switch(e_()){case"cellular":e="cellular";break;case"ethernet":e="wired";break;case"wifi":e="wifi";break;case void 0:break;default:e="other"}return e},e_=function(){var e=r().navigator,t=e&&(e.connection||e.mozConnection||e.webkitConnection);return t&&t.type};eg.getConnectionFromAPI=e_;var ey=eT({a:"env",b:"beacon",c:"custom",d:"ad",e:"event",f:"experiment",i:"internal",m:"mux",n:"response",p:"player",q:"request",r:"retry",s:"session",t:"timestamp",u:"viewer",v:"video",w:"page",x:"view",y:"sub"}),eA=eT({ad:"ad",ag:"aggregate",ap:"api",al:"application",ar:"architecture",as:"asset",au:"autoplay",av:"average",bi:"bitrate",br:"break",bw:"browser",by:"bytes",ca:"cached",cb:"cancel",cc:"codec",cd:"code",cg:"category",ch:"changed",ck:"clicked",cl:"canceled",cn:"config",co:"count",ce:"counter",cp:"complete",cr:"creative",ct:"content",cu:"current",cx:"connection",cz:"context",dg:"downscaling",dm:"domain",dn:"cdn",do:"downscale",dr:"drm",dp:"dropped",du:"duration",dv:"device",ec:"encoding",ed:"edge",en:"end",eg:"engine",em:"embed",er:"error",es:"errorcode",et:"errortext",ee:"event",ev:"events",ex:"expires",ep:"experiments",fa:"failed",fi:"first",fm:"family",ft:"format",fp:"fps",fq:"frequency",fr:"frame",fs:"fullscreen",ha:"has",hb:"holdback",he:"headers",ho:"host",hn:"hostname",ht:"height",id:"id",ii:"init",in:"instance",ip:"ip",is:"is",ke:"key",la:"language",lb:"labeled",le:"level",li:"live",ld:"loaded",lo:"load",ls:"lists",lt:"latency",ma:"max",md:"media",me:"message",mf:"manifest",mi:"mime",ml:"midroll",mm:"min",mn:"manufacturer",mo:"model",mx:"mux",ne:"newest",nm:"name",no:"number",on:"on",os:"os",pa:"paused",pb:"playback",pd:"producer",pe:"percentage",pf:"played",pg:"program",ph:"playhead",pi:"plugin",pl:"preroll",pn:"playing",po:"poster",pr:"preload",ps:"position",pt:"part",py:"property",ra:"rate",rd:"requested",re:"rebuffer",rf:"rendition",rm:"remote",ro:"ratio",rp:"response",rq:"request",rs:"requests",sa:"sample",sd:"skipped",se:"session",sk:"seek",sm:"stream",so:"source",sq:"sequence",sr:"series",st:"start",su:"startup",sv:"server",sw:"software",ta:"tag",tc:"tech",te:"text",tg:"target",th:"throughput",ti:"time",tl:"total",to:"to",tt:"title",ty:"type",ug:"upscaling",un:"universal",up:"upscale",ur:"url",us:"user",va:"variant",vd:"viewed",vi:"video",ve:"version",vw:"view",vr:"viewer",wd:"width",wa:"watch",wt:"waiting"});function eT(e){var t={};for(var i in e)e.hasOwnProperty(i)&&(t[e[i]]=i);return t}function ek(e){var t={},i={};return Object.keys(e).forEach(function(a){var r=!1;if(e.hasOwnProperty(a)&&void 0!==e[a]){var n=a.split("_"),s=n[0],o=ey[s];o||(h.info("Data key word `"+n[0]+"` not expected in "+a),o=s+"_"),n.splice(1).forEach(function(e){"url"===e&&(r=!0),eA[e]?o+=eA[e]:Number(e)&&Math.floor(Number(e))===Number(e)?o+=e:(h.info("Data key word `"+e+"` not expected in "+a),o+="_"+e+"_")}),r?i[o]=e[a]:t[o]=e[a]}}),Object.assign(t,i)}var ew={maxBeaconSize:300,maxQueueLength:3600,baseTimeBetweenBeacons:1e4,maxPayloadKBSize:500},eI=["hb","requestcompleted","requestfailed","requestcanceled"],eS=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this._beaconUrl=e||"https://img.litix.io",this._eventQueue=[],this._postInFlight=!1,this._failureCount=0,this._sendTimeout=!1,this._options=Object.assign({},ew,t)};eS.prototype.queueEvent=function(e,t){var i=Object.assign({},t);return(this._eventQueue.length<=this._options.maxQueueLength||"eventrateexceeded"===e)&&(this._eventQueue.push(i),this._sendTimeout||this._startBeaconSending(),this._eventQueue.length<=this._options.maxQueueLength)},eS.prototype.flushEvents=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e&&1===this._eventQueue.length?this._eventQueue.pop():(this._eventQueue.length&&this._sendBeaconQueue(),this._startBeaconSending())},eS.prototype.destroy=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.destroyed=!0,e?this._clearBeaconQueue():this.flushEvents(),r().clearTimeout(this._sendTimeout)},eS.prototype._clearBeaconQueue=function(){var e=this._eventQueue.length>this._options.maxBeaconSize?this._eventQueue.length-this._options.maxBeaconSize:0,t=this._eventQueue.slice(e);e>0&&Object.assign(t[t.length-1],ek({mux_view_message:"event queue truncated"}));var i=this._createPayload(t);eL(this._beaconUrl,i,!0,function(){})},eS.prototype._sendBeaconQueue=function(){var e=this;if(!this._postInFlight){var t=this._eventQueue.slice(0,this._options.maxBeaconSize);this._eventQueue=this._eventQueue.slice(this._options.maxBeaconSize),this._postInFlight=!0;var i=this._createPayload(t),a=p.now();eL(this._beaconUrl,i,!1,function(i,r){r?(e._eventQueue=t.concat(e._eventQueue),e._failureCount+=1,h.info("Error sending beacon: "+r)):e._failureCount=0,e._roundTripTime=p.now()-a,e._postInFlight=!1})}},eS.prototype._getNextBeaconTime=function(){if(!this._failureCount)return this._options.baseTimeBetweenBeacons;var e=Math.pow(2,this._failureCount-1);return(1+(e*=Math.random()))*this._options.baseTimeBetweenBeacons},eS.prototype._startBeaconSending=function(){var e=this;r().clearTimeout(this._sendTimeout),this.destroyed||(this._sendTimeout=r().setTimeout(function(){e._eventQueue.length&&e._sendBeaconQueue(),e._startBeaconSending()},this._getNextBeaconTime()))},eS.prototype._createPayload=function(e){var t,i,a,r=this,n={transmission_timestamp:Math.round(p.now())};this._roundTripTime&&(n.rtt_ms=Math.round(this._roundTripTime));var s=function(){a=(t=JSON.stringify({metadata:n,events:i||e})).length/1024},o=function(){return a<=r._options.maxPayloadKBSize};return s(),o()||(h.info("Payload size is too big ("+a+" kb). Removing unnecessary events."),i=e.filter(function(e){return -1===eI.indexOf(e.e)}),s()),o()||(h.info("Payload size still too big ("+a+" kb). Cropping fields.."),i.forEach(function(e){for(var t in e){var i=e[t];"string"==typeof i&&i.length>51200&&(e[t]=i.substring(0,51200))}}),s()),t};var eL=function(e,t,i,a){if(i&&navigator&&navigator.sendBeacon&&navigator.sendBeacon(e,t))a();else if(r().fetch)r().fetch(e,{method:"POST",body:t,headers:{"Content-Type":"text/plain"},keepalive:t.length<=57344}).then(function(e){return a(null,e.ok?null:"Error")}).catch(function(e){return a(null,e)});else{if(r().XMLHttpRequest){var n=new(r()).XMLHttpRequest;return n.onreadystatechange=function(){if(4===n.readyState)return a(null,200!==n.status?"error":void 0)},n.open("POST",e),n.setRequestHeader("Content-Type","text/plain"),void n.send(t)}a()}};function eD(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,a=Array(t);i<t;i++)a[i]=e[i];return a}function eR(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function eM(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?eR(Object(i),!0).forEach(function(t){ex(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):eR(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}function eC(e){return(eC="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function eO(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function ex(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var eN=["env_key","view_id","view_sequence_number","player_sequence_number","beacon_domain","player_playhead_time","viewer_time","mux_api_version","event","video_id","player_instance_id"],eP=["adplay","adplaying","adpause","adfirstquartile","admidpoint","adthirdquartile","adended","adresponse","adrequest"],eU=["ad_id","ad_creative_id","ad_universal_id"],eB=["viewstart","error","ended","viewend"],eW=function(){var e,t;function i(e,t){var a,n,s,o,l,d,u,c,h,m,p,v,b,E,f,g,_,y,A,T=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,i),ex(this,"previousBeaconData",null),ex(this,"lastEventTime",0),ex(this,"rateLimited",!1),this.mux=e,this.envKey=t,this.options=T,this.eventQueue=new eS((a=this.envKey,s=(n=this.options).beaconCollectionDomain,o=n.beaconDomain,s?"https://"+s:(a=a||"inferred").match(/^[a-z0-9]+$/)?"https://"+a+"."+(o||"litix.io"):"https://img.litix.io/a.gif")),this.sampleRate=null!==(l=this.options.sampleRate)&&void 0!==l?l:1,this.disableCookies=null!==(d=this.options.disableCookies)&&void 0!==d&&d,this.respectDoNotTrack=null!==(u=this.options.respectDoNotTrack)&&void 0!==u&&u,this.previousBeaconData=null,this.lastEventTime=0,this.rateLimited=!1,this.pageLevelData={mux_api_version:this.mux.API_VERSION,mux_embed:this.mux.NAME,mux_embed_version:this.mux.VERSION,viewer_application_name:null===(c=this.options.platform)||void 0===c?void 0:c.name,viewer_application_version:null===(h=this.options.platform)||void 0===h?void 0:h.version,viewer_application_engine:null===(m=this.options.platform)||void 0===m?void 0:m.layout,viewer_device_name:null===(p=this.options.platform)||void 0===p?void 0:p.product,viewer_device_category:"",viewer_device_manufacturer:null===(v=this.options.platform)||void 0===v?void 0:v.manufacturer,viewer_os_family:null===(b=this.options.platform)||void 0===b||null===(E=b.os)||void 0===E?void 0:E.family,viewer_os_architecture:null===(f=this.options.platform)||void 0===f||null===(g=f.os)||void 0===g?void 0:g.architecture,viewer_os_version:null===(_=this.options.platform)||void 0===_||null===(y=_.os)||void 0===y?void 0:y.version,viewer_connection_type:eg(),page_url:null===r()||void 0===r()||null===(A=r().location)||void 0===A?void 0:A.href},this.viewerData=this.disableCookies?{}:ef()}return e=[{key:"send",value:function(e,t){var i;if(e&&null!=t&&t.view_id){if(this.respectDoNotTrack&&m())return h.info("Not sending `"+e+"` because Do Not Track is enabled");if(!t||"object"!==eC(t))return h.error("A data object was expected in send() but was not provided");var a,r,s=this.disableCookies?{}:(a=eb(),r=p.now(),a.session_start&&(a.sst=a.session_start,delete a.session_start),a.session_id&&(a.sid=a.session_id,delete a.session_id),a.session_expires&&(a.sex=a.session_expires,delete a.session_expires),(!a.sex||a.sex<r)&&(a.sid=n(),a.sst=r),a.sex=r+15e5,eE(a),{session_id:a.sid,session_start:a.sst,session_expires:a.sex}),o=eM(eM(eM(eM(eM({},this.pageLevelData),t),s),this.viewerData),{},{event:e,env_key:this.envKey});o.user_id&&(o.viewer_user_id=o.user_id,delete o.user_id);var l=(null!==(i=o.mux_sample_number)&&void 0!==i?i:0)>=this.sampleRate,d=ek(this._deduplicateBeaconData(e,o));if(this.lastEventTime=this.mux.utils.now(),l)return h.info("Not sending event due to sample rate restriction",e,o,d);if(this.envKey||h.info("Missing environment key (envKey) - beacons will be dropped if the video source is not a valid mux video URL",e,o,d),!this.rateLimited){if(h.info("Sending event",e,o,d),this.rateLimited=!this.eventQueue.queueEvent(e,d),this.mux.WINDOW_UNLOADING&&"viewend"===e)this.eventQueue.destroy(!0);else if(this.mux.WINDOW_HIDDEN&&"hb"===e?this.eventQueue.flushEvents(!0):eB.indexOf(e)>=0&&this.eventQueue.flushEvents(),this.rateLimited)return o.event="eventrateexceeded",d=ek(o),this.eventQueue.queueEvent(o.event,d),h.error("Beaconing disabled due to rate limit.")}}}},{key:"destroy",value:function(){this.eventQueue.destroy(!1)}},{key:"_deduplicateBeaconData",value:function(e,t){var i=this,a={},r=t.view_id;if("-1"===r||"viewstart"===e||"viewend"===e||!this.previousBeaconData||this.mux.utils.now()-this.lastEventTime>=6e5)a=eM({},t),r&&(this.previousBeaconData=a),r&&"viewend"===e&&(this.previousBeaconData=null);else{var n=0===e.indexOf("request");Object.entries(t).forEach(function(t){var r=function(e){if(Array.isArray(e))return e}(t)||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var a,r,n=[],s=!0,o=!1;try{for(i=i.call(e);!(s=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);s=!0);}catch(e){o=!0,r=e}finally{try{s||null==i.return||i.return()}finally{if(o)throw r}}return n}}(t,2)||function(e,t){if(e){if("string"==typeof e)return eD(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?eD(e,t):void 0}}(t,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),s=r[0],o=r[1];i.previousBeaconData&&(o!==i.previousBeaconData[s]||eN.indexOf(s)>-1||i.objectHasChanged(n,s,o,i.previousBeaconData[s])||i.eventRequiresKey(e,s))&&(a[s]=o,i.previousBeaconData[s]=o)})}return a}},{key:"objectHasChanged",value:function(e,t,i,a){return!(!e||0!==t.indexOf("request_")||"request_response_headers"!==t&&"object"===eC(i)&&"object"===eC(a)&&Object.keys(i||{}).length===Object.keys(a||{}).length)}},{key:"eventRequiresKey",value:function(e,t){return"renditionchange"===e&&0===t.indexOf("video_source_")||!(!eU.includes(t)||!eP.includes(e))}}],eO(i.prototype,e),t&&eO(i,t),Object.defineProperty(i,"prototype",{writable:!1}),i}();function eV(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var eq=(tc=function e(t){!function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,e);var i=0,a=0,r=0,n=0,s=0,o=0,l=0;t.on("requestcompleted",function(e,o){var l,d,u=o.request_start,c=o.request_response_start,h=o.request_response_end,m=o.request_bytes_loaded;if(n++,c?(l=c-(null!=u?u:0),d=(null!=h?h:0)-c):d=(null!=h?h:0)-(null!=u?u:0),d>0&&m&&m>0){var p=m/d*8e3;s++,a+=m,r+=d,t.data.view_min_request_throughput=Math.min(t.data.view_min_request_throughput||1/0,p),t.data.view_average_request_throughput=a/r*8e3,t.data.view_request_count=n,l>0&&(i+=l,t.data.view_max_request_latency=Math.max(t.data.view_max_request_latency||0,l),t.data.view_average_request_latency=i/s)}}),t.on("requestfailed",function(e,i){n++,o++,t.data.view_request_count=n,t.data.view_request_failed_count=o}),t.on("requestcanceled",function(e,i){n++,l++,t.data.view_request_count=n,t.data.view_request_canceled_count=l})},th&&eV(tc.prototype,th),tm&&eV(tc,tm),Object.defineProperty(tc,"prototype",{writable:!1}),tc);function eH(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var eF=(tp=function e(t){var i=this;(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,e),t.on("before*",function(e,a){var r=a.viewer_time,n=p.now(),s=i._lastEventTime;if(i._lastEventTime=n,s&&n-s>36e5){var o=Object.keys(t.data).reduce(function(e,i){var a,r;return 0===i.indexOf("video_")?Object.assign(e,(a={},r=t.data[i],i in a?Object.defineProperty(a,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):a[i]=r,a)):e},{});t.mux.log.info("Received event after at least an hour inactivity, creating a new view"),t.emit("viewinit",Object.assign({viewer_time:r},o)),t.playbackHeartbeat._playheadShouldBeProgressing&&"play"!==e.type&&"adbreakstart"!==e.type&&(t.emit("play",{viewer_time:r}),"playing"!==e.type&&t.emit("playing",{viewer_time:r}))}})},tv&&eH(tp.prototype,tv),tb&&eH(tp,tb),Object.defineProperty(tp,"prototype",{writable:!1}),tp);function e$(e){return(e$="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ej(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,a=Array(t);i<t;i++)a[i]=e[i];return a}function eK(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function eY(e,t){return(eY=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function eG(e){if(void 0===e)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function eQ(e){return(eQ=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var eZ=["viewstart","ended","loadstart","pause","play","playing","ratechange","waiting","adplay","adpause","adended","aderror","adplaying","adrequest","adresponse","adbreakstart","adbreakend","adfirstquartile","admidpoint","adthirdquartile","rebufferstart","rebufferend","seeked","error","hb","requestcompleted","requestfailed","requestcanceled","renditionchange"],ez=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&eY(e,t)}(s,e);var t,i,a,r=(t=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}(),function(){var e,i=eQ(s);if(t){var a=eQ(this).constructor;e=Reflect.construct(i,arguments,a)}else e=i.apply(this,arguments);return function(e,t){if(t&&("object"===e$(t)||"function"==typeof t))return t;if(void 0!==t)throw TypeError("Derived constructors may only return object or undefined");return eG(e)}(this,e)});function s(e,t,i){(function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")})(this,s),(a=r.call(this)).DOM_CONTENT_LOADED_EVENT_END=E.domContentLoadedEventEnd(),a.NAVIGATION_START=E.navigationStart(),a.mux=e,a.id=t,(i=Object.assign({debug:!1,minimumRebufferDuration:250,sustainedRebufferThreshold:1e3,playbackHeartbeatTime:25,beaconDomain:"litix.io",sampleRate:1,disableCookies:!1,respectDoNotTrack:!1,disableRebufferTracking:!1,disablePlayheadRebufferTracking:!1,errorTranslator:function(e){return e}},i)).data=i.data||{},i.data.property_key&&(i.data.env_key=i.data.property_key,delete i.data.property_key),h.setLevel(i.debug?"debug":"warn"),a.getPlayheadTime=i.getPlayheadTime,a.getStateData=i.getStateData||function(){return{}},a.getAdData=i.getAdData||function(){},a.minimumRebufferDuration=i.minimumRebufferDuration,a.sustainedRebufferThreshold=i.sustainedRebufferThreshold,a.playbackHeartbeatTime=i.playbackHeartbeatTime,a.disableRebufferTracking=i.disableRebufferTracking,a.disableRebufferTracking&&a.mux.log.warn("Disabling rebuffer tracking. This should only be used in specific circumstances as a last resort when your player is known to unreliably track rebuffering."),a.disablePlayheadRebufferTracking=i.disablePlayheadRebufferTracking,a.errorTranslator=i.errorTranslator,a.playbackEventDispatcher=new eW(e,i.data.env_key,i),a.data={player_instance_id:n(),mux_sample_rate:i.sampleRate,beacon_domain:i.beaconCollectionDomain?i.beaconCollectionDomain:i.beaconDomain},a.data.view_sequence_number=1,a.data.player_sequence_number=1,a.oldEmit=a.emit,a.emit=function(e,t){t=Object.assign({viewer_time:this.mux.utils.now()},t),this.oldEmit(e,t)};var a,o=(function(){void 0===this.data.view_start&&(this.data.view_start=this.mux.utils.now(),this.emit("viewstart"))}).bind(eG(a));a.on("viewinit",function(e,t){this._resetVideoData(),this._resetViewData(),this._resetErrorData(),this._updateStateData(),Object.assign(this.data,t),this._initializeViewData(),this.one("play",o),this.one("adbreakstart",o)});var l=(function(e){this.emit("viewend"),this.send("viewend"),this.emit("viewinit",e)}).bind(eG(a));if(a.on("videochange",function(e,t){l(t)}),a.on("programchange",function(e,t){this.data.player_is_paused&&this.mux.log.warn("The `programchange` event is intended to be used when the content changes mid playback without the video source changing, however the video is not currently playing. If the video source is changing please use the videochange event otherwise you will lose startup time information."),l(Object.assign(t,{view_program_changed:!0})),o(),this.emit("play"),this.emit("playing")}),a.on("fragmentchange",function(e,t){this.currentFragmentPDT=t.currentFragmentPDT,this.currentFragmentStart=t.currentFragmentStart}),a.on("destroy",a.destroy),"undefined"!=typeof window&&"function"==typeof window.addEventListener&&"function"==typeof window.removeEventListener){var d=function(){var e=void 0!==a.data.view_start;a.mux.WINDOW_HIDDEN="hidden"===document.visibilityState,e&&a.mux.WINDOW_HIDDEN&&(a.data.player_is_paused||a.emit("hb"))};window.addEventListener("visibilitychange",d,!1);var u=function(e){e.persisted||a.destroy()};window.addEventListener("pagehide",u,!1),a.on("destroy",function(){window.removeEventListener("visibilitychange",d),window.removeEventListener("pagehide",u)})}return a.on("playerready",function(e,t){Object.assign(this.data,t)}),eZ.forEach(function(e){a.on(e,function(t,i){0!==e.indexOf("ad")&&this._updateStateData(),Object.assign(this.data,i),this._sanitizeData()}),a.on("after"+e,function(){("error"!==e||this.errorTracker.viewErrored)&&this.send(e)})}),a.on("viewend",function(e,t){Object.assign(a.data,t)}),a.one("playerready",function(e){var t=this.mux.utils.now();this.data.player_init_time&&(this.data.player_startup_time=t-this.data.player_init_time),!this.mux.PLAYER_TRACKED&&this.NAVIGATION_START&&(this.mux.PLAYER_TRACKED=!0,(this.data.player_init_time||this.DOM_CONTENT_LOADED_EVENT_END)&&(this.data.page_load_time=Math.min(this.data.player_init_time||1/0,this.DOM_CONTENT_LOADED_EVENT_END||1/0)-this.NAVIGATION_START)),this.send("playerready"),delete this.data.player_startup_time,delete this.data.page_load_time}),a.longResumeTracker=new eF(eG(a)),a.errorTracker=new W(eG(a)),new ec(eG(a)),a.seekingTracker=new et(eG(a)),a.playheadTime=new j(eG(a)),a.playbackHeartbeat=new U(eG(a)),new J(eG(a)),a.watchTimeTracker=new q(eG(a)),new F(eG(a)),a.adTracker=new eo(eG(a)),new Q(eG(a)),new Y(eG(a)),new z(eG(a)),new ed(eG(a)),new eq(eG(a)),i.hlsjs&&a.addHLSJS(i),i.dashjs&&a.addDashJS(i),a.emit("viewinit",i.data),a}return i=[{key:"destroy",value:function(){this._destroyed||(this._destroyed=!0,void 0!==this.data.view_start&&(this.emit("viewend"),this.send("viewend")),this.playbackEventDispatcher.destroy(),this.removeHLSJS(),this.removeDashJS(),window.clearTimeout(this._heartBeatTimeout))}},{key:"send",value:function(e){if(this.data.view_id){var t=Object.assign({},this.data);if(void 0===t.video_source_is_live&&(t.player_source_duration===1/0||t.video_source_duration===1/0?t.video_source_is_live=!0:(t.player_source_duration>0||t.video_source_duration>0)&&(t.video_source_is_live=!1)),t.video_source_is_live||["player_program_time","player_manifest_newest_program_time","player_live_edge_program_time","player_program_time","video_holdback","video_part_holdback","video_target_duration","video_part_target_duration"].forEach(function(e){t[e]=void 0}),t.video_source_url=t.video_source_url||t.player_source_url,t.video_source_url){var i,a=function(e){if(Array.isArray(e))return e}(i=b(t.video_source_url))||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var a,r,n=[],s=!0,o=!1;try{for(i=i.call(e);!(s=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);s=!0);}catch(e){o=!0,r=e}finally{try{s||null==i.return||i.return()}finally{if(o)throw r}}return n}}(i,2)||function(e,t){if(e){if("string"==typeof e)return ej(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?ej(e,t):void 0}}(i,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),r=a[0],n=a[1];t.video_source_domain=n,t.video_source_hostname=r}delete t.ad_request_id,this.playbackEventDispatcher.send(e,t),this.data.view_sequence_number++,this.data.player_sequence_number++,this._restartHeartBeat(),"viewend"===e&&delete this.data.view_id}}},{key:"_updateStateData",value:function(){Object.assign(this.data,this.getStateData()),this.playheadTime._updatePlayheadTime(),this._sanitizeData()}},{key:"_sanitizeData",value:function(){var e=this;["player_width","player_height","video_source_width","video_source_height","player_playhead_time","video_source_bitrate"].forEach(function(t){var i=parseInt(e.data[t],10);e.data[t]=isNaN(i)?void 0:i}),["player_source_url","video_source_url"].forEach(function(t){if(e.data[t]){var i=e.data[t].toLowerCase();0!==i.indexOf("data:")&&0!==i.indexOf("blob:")||(e.data[t]="MSE style URL")}})}},{key:"_resetVideoData",value:function(e,t){var i=this;Object.keys(this.data).forEach(function(e){0===e.indexOf("video_")&&delete i.data[e]})}},{key:"_resetViewData",value:function(){var e=this;Object.keys(this.data).forEach(function(t){0===t.indexOf("view_")&&delete e.data[t]}),this.data.view_sequence_number=1}},{key:"_resetErrorData",value:function(e,t){delete this.data.player_error_code,delete this.data.player_error_message}},{key:"_initializeViewData",value:function(){var e=this,t=this.data.view_id=n(),i=function(){t===e.data.view_id&&f(e.data,"player_view_count",1)};this.data.player_is_paused?this.one("play",i):i()}},{key:"_restartHeartBeat",value:function(){var e=this;window.clearTimeout(this._heartBeatTimeout),this.errorTracker.viewErrored||(this._heartBeatTimeout=window.setTimeout(function(){e.data.player_is_paused||e.emit("hb")},1e4))}},{key:"addHLSJS",value:function(e){e.hlsjs?this.hlsjs?this.mux.log.warn("An instance of HLS.js is already being monitored for this player."):(this.hlsjs=e.hlsjs,function(e,t,i){var a=arguments.length>4?arguments[4]:void 0,r=e.log,n=e.utils.secondsToMs,s=function(e){var t,i=parseInt(a.version);return 1===i&&null!==e.programDateTime&&(t=e.programDateTime),0===i&&null!==e.pdt&&(t=e.pdt),t};if(E.exists()){var o=function(i,a){return e.emit(t,i,a)},l=function(e,t){var i=t.levels,a=t.audioTracks,r=t.url,n=t.stats,s=t.networkDetails,l=t.sessionData,d={},u={};i.forEach(function(e,t){d[t]={width:e.width,height:e.height,bitrate:e.bitrate,attrs:e.attrs}}),a.forEach(function(e,t){u[t]={name:e.name,language:e.lang,bitrate:e.bitrate}});var c=I(n),h=c.bytesLoaded,m=c.requestStart,p=c.responseStart,b=c.responseEnd;o("requestcompleted",w(w({},T(l)),{},{request_event_type:e,request_bytes_loaded:h,request_start:m,request_response_start:p,request_response_end:b,request_type:"manifest",request_hostname:v(r),request_response_headers:S(s),request_rendition_lists:{media:d,audio:u,video:{}}}))};i.on(a.Events.MANIFEST_LOADED,l);var d=function(e,t){var i=t.details,a=t.level,r=t.networkDetails,l=I(t.stats),d=l.bytesLoaded,u=l.requestStart,c=l.responseStart,h=l.responseEnd,m=i.fragments[i.fragments.length-1],p=s(m)+n(m.duration);o("requestcompleted",{request_event_type:e,request_bytes_loaded:d,request_start:u,request_response_start:c,request_response_end:h,request_current_level:a,request_type:"manifest",request_hostname:v(i.url),request_response_headers:S(r),video_holdback:i.holdBack&&n(i.holdBack),video_part_holdback:i.partHoldBack&&n(i.partHoldBack),video_part_target_duration:i.partTarget&&n(i.partTarget),video_target_duration:i.targetduration&&n(i.targetduration),video_source_is_live:i.live,player_manifest_newest_program_time:isNaN(p)?void 0:p})};i.on(a.Events.LEVEL_LOADED,d);var u=function(e,t){var i=t.details,a=t.networkDetails,r=I(t.stats);o("requestcompleted",{request_event_type:e,request_bytes_loaded:r.bytesLoaded,request_start:r.requestStart,request_response_start:r.responseStart,request_response_end:r.responseEnd,request_type:"manifest",request_hostname:v(i.url),request_response_headers:S(a)})};i.on(a.Events.AUDIO_TRACK_LOADED,u);var c=function(e,t){var a=t.stats,r=t.networkDetails,n=t.frag,s=I(a=a||n.stats),l=s.bytesLoaded,d=s.requestStart,u=s.responseStart,c=s.responseEnd,h=r?S(r):void 0,m={request_event_type:e,request_bytes_loaded:l,request_start:d,request_response_start:u,request_response_end:c,request_hostname:r?v(r.responseURL):void 0,request_id:h?A(h):void 0,request_response_headers:h,request_media_duration:n.duration,request_url:null==r?void 0:r.responseURL};"main"===n.type?(m.request_type="media",m.request_current_level=n.level,m.request_video_width=(i.levels[n.level]||{}).width,m.request_video_height=(i.levels[n.level]||{}).height,m.request_labeled_bitrate=(i.levels[n.level]||{}).bitrate):m.request_type=n.type,o("requestcompleted",m)};i.on(a.Events.FRAG_LOADED,c);var h=function(e,t){var i=t.frag,a=i.start;o("fragmentchange",{currentFragmentPDT:s(i),currentFragmentStart:n(a)})};i.on(a.Events.FRAG_CHANGED,h);var m=function(e,t){var i,r=t.type,n=t.details,s=t.response,l=t.fatal,d=t.frag,u=t.networkDetails,c=(null==d?void 0:d.url)||t.url||"",h=u?S(u):void 0;n!==a.ErrorDetails.MANIFEST_LOAD_ERROR&&n!==a.ErrorDetails.MANIFEST_LOAD_TIMEOUT&&n!==a.ErrorDetails.FRAG_LOAD_ERROR&&n!==a.ErrorDetails.FRAG_LOAD_TIMEOUT&&n!==a.ErrorDetails.LEVEL_LOAD_ERROR&&n!==a.ErrorDetails.LEVEL_LOAD_TIMEOUT&&n!==a.ErrorDetails.AUDIO_TRACK_LOAD_ERROR&&n!==a.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT&&n!==a.ErrorDetails.SUBTITLE_LOAD_ERROR&&n!==a.ErrorDetails.SUBTITLE_LOAD_TIMEOUT&&n!==a.ErrorDetails.KEY_LOAD_ERROR&&n!==a.ErrorDetails.KEY_LOAD_TIMEOUT||o("requestfailed",{request_error:n,request_url:c,request_hostname:v(c),request_id:h?A(h):void 0,request_type:n===a.ErrorDetails.FRAG_LOAD_ERROR||n===a.ErrorDetails.FRAG_LOAD_TIMEOUT?"media":n===a.ErrorDetails.AUDIO_TRACK_LOAD_ERROR||n===a.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT?"audio":n===a.ErrorDetails.SUBTITLE_LOAD_ERROR||n===a.ErrorDetails.SUBTITLE_LOAD_TIMEOUT?"subtitle":n===a.ErrorDetails.KEY_LOAD_ERROR||n===a.ErrorDetails.KEY_LOAD_TIMEOUT?"encryption":"manifest",request_error_code:null==s?void 0:s.code,request_error_text:null==s?void 0:s.text}),l&&o("error",{player_error_code:r,player_error_message:n,player_error_context:"".concat(c?"url: ".concat(c,"\n"):"")+"".concat(s&&(s.code||s.text)?"response: ".concat(s.code,", ").concat(s.text,"\n"):"")+"".concat(t.reason?"failure reason: ".concat(t.reason,"\n"):"")+"".concat(t.level?"level: ".concat(t.level,"\n"):"")+"".concat(t.parent?"parent stream controller: ".concat(t.parent,"\n"):"")+"".concat(t.buffer?"buffer length: ".concat(t.buffer,"\n"):"")+"".concat(t.error?"error: ".concat(t.error,"\n"):"")+"".concat(t.event?"event: ".concat(t.event,"\n"):"")+"".concat(t.err?"error message: ".concat(null===(i=t.err)||void 0===i?void 0:i.message,"\n"):"")})};i.on(a.Events.ERROR,m);var p=function(e,t){var i=t.frag,a=i&&i._url||"";o("requestcanceled",{request_event_type:e,request_url:a,request_type:"media",request_hostname:v(a)})};i.on(a.Events.FRAG_LOAD_EMERGENCY_ABORTED,p);var b=function(e,t){var a=t.level,n=i.levels[a];if(n&&n.attrs&&n.attrs.BANDWIDTH){var s,l=n.attrs.BANDWIDTH,d=parseFloat(n.attrs["FRAME-RATE"]);isNaN(d)||(s=d),l?o("renditionchange",{video_source_fps:s,video_source_bitrate:l,video_source_width:n.width,video_source_height:n.height,video_source_rendition_name:n.name,video_source_codec:null==n?void 0:n.videoCodec}):r.warn("missing BANDWIDTH from HLS manifest parsed by HLS.js")}};i.on(a.Events.LEVEL_SWITCHED,b),i._stopMuxMonitor=function(){i.off(a.Events.MANIFEST_LOADED,l),i.off(a.Events.LEVEL_LOADED,d),i.off(a.Events.AUDIO_TRACK_LOADED,u),i.off(a.Events.FRAG_LOADED,c),i.off(a.Events.FRAG_CHANGED,h),i.off(a.Events.ERROR,m),i.off(a.Events.FRAG_LOAD_EMERGENCY_ABORTED,p),i.off(a.Events.LEVEL_SWITCHED,b),i.off(a.Events.DESTROYING,i._stopMuxMonitor),delete i._stopMuxMonitor},i.on(a.Events.DESTROYING,i._stopMuxMonitor)}else r.warn("performance timing not supported. Not tracking HLS.js.")}(this.mux,this.id,e.hlsjs,{},e.Hls||window.Hls)):this.mux.log.warn("You must pass a valid hlsjs instance in order to track it.")}},{key:"removeHLSJS",value:function(){var e;this.hlsjs&&((e=this.hlsjs)&&"function"==typeof e._stopMuxMonitor&&e._stopMuxMonitor(),this.hlsjs=void 0)}},{key:"addDashJS",value:function(e){e.dashjs?this.dashjs?this.mux.log.warn("An instance of Dash.js is already being monitored for this player."):(this.dashjs=e.dashjs,function(e,t,i){var a=e.log;if(i&&i.on){var r=function(i,a){return e.emit(t,i,a)},n=function(e){var t=e.type,i=(e.data||{}).url;r("requestcompleted",{request_event_type:t,request_start:0,request_response_start:0,request_response_end:0,request_bytes_loaded:-1,request_type:"manifest",request_hostname:v(i),request_url:i})};i.on("manifestLoaded",n);var s={},o=function(e){var t=e.type,a=e.fragmentModel,n=(e.chunk||{}).mediaInfo||{},o=n.type,l=n.bitrateList,d={};(l=l||[]).forEach(function(e,t){d[t]={},d[t].width=e.width,d[t].height=e.height,d[t].bitrate=e.bandwidth,d[t].attrs={}}),"video"===o?s.video=d:"audio"===o?s.audio=d:s.media=d;var u=R(a,i),c=u.requestStart,h=u.requestResponseStart,m=u.requestResponseEnd,p=u.requestResponseHeaders,v=u.requestMediaDuration,b=u.requestHostname,E=u.requestUrl;r("requestcompleted",{request_event_type:t,request_start:c,request_response_start:h,request_response_end:m,request_bytes_loaded:-1,request_type:o+"_init",request_response_headers:p,request_hostname:b,request_id:u.requestId,request_url:E,request_media_duration:v,request_rendition_lists:s})};i.on("initFragmentLoaded",o);var l=function(e){var t=e.type,a=e.fragmentModel,n=e.chunk||{},s=n.mediaInfo,o=n.start,l=(s||{}).type,d=R(a,i),u=d.requestStart,c=d.requestResponseStart,h=d.requestResponseEnd,m=d.requestBytesLoaded,p=d.requestResponseHeaders,v=d.requestMediaDuration,b=d.requestHostname,E=d.requestUrl,f=d.requestId,g=M(l,i),_=g.currentLevel,y=g.renditionWidth,A=g.renditionHeight,T=g.renditionBitrate;r("requestcompleted",{request_event_type:t,request_start:u,request_response_start:c,request_response_end:h,request_bytes_loaded:m,request_type:l,request_response_headers:p,request_hostname:b,request_id:f,request_url:E,request_media_start_time:o,request_media_duration:v,request_current_level:_,request_labeled_bitrate:T,request_video_width:y,request_video_height:A})};i.on("mediaFragmentLoaded",l);var d={video:void 0,audio:void 0,totalBitrate:void 0},u=function(){if(d.video&&"number"==typeof d.video.bitrate){if(d.video.width&&d.video.height){var e=d.video.bitrate;return d.audio&&"number"==typeof d.audio.bitrate&&(e+=d.audio.bitrate),e!==d.totalBitrate?(d.totalBitrate=e,{video_source_bitrate:e,video_source_height:d.video.height,video_source_width:d.video.width,video_source_codec:C(d.video.codec)}):void 0}a.warn("have bitrate info for video but missing width/height")}},c=function(e,t,n){if("number"==typeof e.newQuality){var s=e.mediaType;if("audio"===s||"video"===s){var o=i.getBitrateInfoListFor(s).find(function(t){return t.qualityIndex===e.newQuality});if(o&&"number"==typeof o.bitrate){d[s]=D(D({},o),{},{codec:i.getCurrentTrackFor(s).codec});var l=u();l&&r("renditionchange",l)}else a.warn("missing bitrate info for ".concat(s))}}else a.warn("missing evt.newQuality in qualityChangeRendered event",e)};i.on("qualityChangeRendered",c);var h=function(e){var t=e.request,i=e.mediaType;r("requestcanceled",{request_event_type:(t=t||{}).type+"_"+t.action,request_url:t.url,request_type:i,request_hostname:v(t.url)})};i.on("fragmentLoadingAbandoned",h);var m=function(e){var t,i,a=e.error,n=(null==a||null===(t=a.data)||void 0===t?void 0:t.request)||{},s=(null==a||null===(i=a.data)||void 0===i?void 0:i.response)||{};27===(null==a?void 0:a.code)&&r("requestfailed",{request_error:n.type+"_"+n.action,request_url:n.url,request_hostname:v(n.url),request_type:n.mediaType,request_error_code:s.status,request_error_text:s.statusText});var o="".concat(null!=n&&n.url?"url: ".concat(n.url,"\n"):"")+"".concat(null!=s&&s.status||null!=s&&s.statusText?"response: ".concat(null==s?void 0:s.status,", ").concat(null==s?void 0:s.statusText,"\n"):"");r("error",{player_error_code:null==a?void 0:a.code,player_error_message:null==a?void 0:a.message,player_error_context:o})};i.on("error",m),i._stopMuxMonitor=function(){i.off("manifestLoaded",n),i.off("initFragmentLoaded",o),i.off("mediaFragmentLoaded",l),i.off("qualityChangeRendered",c),i.off("error",m),i.off("fragmentLoadingAbandoned",h),delete i._stopMuxMonitor}}else a.warn("Invalid dash.js player reference. Monitoring blocked.")}(this.mux,this.id,e.dashjs)):this.mux.log.warn("You must pass a valid dashjs instance in order to track it.")}},{key:"removeDashJS",value:function(){var e;this.dashjs&&((e=this.dashjs)&&"function"==typeof e._stopMuxMonitor&&e._stopMuxMonitor(),this.dashjs=void 0)}}],eK(s.prototype,i),a&&eK(s,a),Object.defineProperty(s,"prototype",{writable:!1}),s}(N),eX=i(153),eJ=i.n(eX);function e0(e){return(e0="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function e1(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var a,r,n=[],s=!0,o=!1;try{for(i=i.call(e);!(s=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);s=!0);}catch(e){o=!0,r=e}finally{try{s||null==i.return||i.return()}finally{if(o)throw r}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return e2(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?e2(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e2(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,a=Array(t);i<t;i++)a[i]=e[i];return a}var e5,e3,e4,e7,e8,e6,e9,te,tt,ti,ta,tr,tn,ts,to,tl,td,tu,tc,th,tm,tp,tv,tb,tE,tf=["loadstart","pause","play","playing","seeking","seeked","timeupdate","ratechange","stalled","waiting","error","ended"],tg={1:"MEDIA_ERR_ABORTED",2:"MEDIA_ERR_NETWORK",3:"MEDIA_ERR_DECODE",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"};r()&&r().WeakMap&&(tE=new WeakMap);var t_=function(e){return this.buffer="",this.manifest={segments:[],serverControl:{},sessionData:{}},this.currentUri={},this.process(e),this.manifest};t_.prototype.process=function(e){var t;for(this.buffer+=e,t=this.buffer.indexOf("\n");t>-1;t=this.buffer.indexOf("\n"))this.processLine(this.buffer.substring(0,t)),this.buffer=this.buffer.substring(t+1)},t_.prototype.processLine=function(e){var t=e.indexOf(":"),i=tS(e,t),a=i[0],r=2===i.length?tT(i[1]):void 0;if("#"!==a[0])this.currentUri.uri=a,this.manifest.segments.push(this.currentUri),!this.manifest.targetDuration||"duration"in this.currentUri||(this.currentUri.duration=this.manifest.targetDuration),this.currentUri={};else switch(a){case"#EXT-X-TARGETDURATION":if(!isFinite(r)||r<0)return;this.manifest.targetDuration=r,this.setHoldBack();break;case"#EXT-X-PART-INF":ty(this.manifest,i),this.manifest.partInf.partTarget&&(this.manifest.partTargetDuration=this.manifest.partInf.partTarget),this.setHoldBack();break;case"#EXT-X-SERVER-CONTROL":ty(this.manifest,i),this.setHoldBack();break;case"#EXTINF":0===r?this.currentUri.duration=.01:r>0&&(this.currentUri.duration=r);break;case"#EXT-X-PROGRAM-DATE-TIME":var n=new Date(r);this.manifest.dateTimeString||(this.manifest.dateTimeString=r,this.manifest.dateTimeObject=n),this.currentUri.dateTimeString=r,this.currentUri.dateTimeObject=n;break;case"#EXT-X-VERSION":ty(this.manifest,i);break;case"#EXT-X-SESSION-DATA":var s=T(tL(i[1]));Object.assign(this.manifest.sessionData,s)}},t_.prototype.setHoldBack=function(){var e=this.manifest,t=e.serverControl,i=e.targetDuration,a=e.partTargetDuration;if(t){var r="holdBack",n="partHoldBack",s=i&&3*i,o=a&&2*a;i&&!t.hasOwnProperty(r)&&(t[r]=s),s&&t[r]<s&&(t[r]=s),a&&!t.hasOwnProperty(n)&&(t[n]=3*a),a&&t[n]<o&&(t[n]=o)}};var ty=function(e,t){var i,a=tA(t[0].replace("#EXT-X-",""));tI(t[1])?(i={},i=Object.assign(tw(t[1]),i)):i=tT(t[1]),e[a]=i},tA=function(e){return e.toLowerCase().replace(/-(\w)/g,function(e){return e[1].toUpperCase()})},tT=function(e){if("yes"===e.toLowerCase()||"no"===e.toLowerCase())return"yes"===e.toLowerCase();var t=-1!==e.indexOf(":")?e:parseFloat(e);return isNaN(t)?e:t},tk=function(e){var t={},i=e.split("=");return i.length>1&&(t[tA(i[0])]=tT(i[1])),t},tw=function(e){for(var t=e.split(","),i={},a=0;t.length>a;a++)i=Object.assign(tk(t[a]),i);return i},tI=function(e){return e.indexOf("=")>-1},tS=function(e,t){return -1===t?[e]:[e.substring(0,t),e.substring(t+1)]},tL=function(e){var t={};if(e){var i=e.search(",");return[e.slice(0,i),e.slice(i+1)].forEach(function(e,i){for(var a=e.replace(/['"]+/g,"").split("="),r=0;r<a.length;r++)"DATA-ID"===a[r]&&(t["DATA-ID"]=a[1-r]),"VALUE"===a[r]&&(t.VALUE=a[1-r])}),{data:t}}},tD={safeCall:function(e,t,i,a){var r=a;if(e&&"function"==typeof e[t])try{r=e[t].apply(e,i)}catch(e){h.info("safeCall error",e)}return r},safeIncrement:f,getComputedStyle:function(e,t){var i;if(e&&t&&r()&&"function"==typeof r().getComputedStyle)return tE&&tE.has(e)&&(i=tE.get(e)),i||(i=r().getComputedStyle(e,null),tE&&tE.set(e,i)),i.getPropertyValue(t)},secondsToMs:function(e){return Math.floor(1e3*e)},assign:Object.assign,headersStringToObject:y,cdnHeadersToRequestId:A,extractHostnameAndDomain:b,extractHostname:v,manifestParser:t_,generateShortID:s,generateUUID:n,now:p.now};function tR(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,a=Array(t);i<t;i++)a[i]=e[i];return a}var tM={},tC=function e(t){var i=arguments;"string"==typeof t?e.hasOwnProperty(t)?r().setTimeout(function(){i=Array.prototype.splice.call(i,1),e[t].apply(null,i)},0):h.warn("`"+t+"` is an unknown task"):"function"==typeof t?r().setTimeout(function(){t(e)},0):h.warn("`"+t+"` is invalid.")},tO={loaded:p.now(),NAME:"mux-embed",VERSION:"4.27.0",API_VERSION:"2.1",PLAYER_TRACKED:!1,monitor:function(e,t){return function(e,t,i){var a=e1(l(t),3),r=a[0],n=a[1],s=a[2],o=e.log,d=e.utils.getComputedStyle,u=e.utils.secondsToMs;if(!r)return o.error("No element was found with the `"+n+"` query selector.");if("video"!==s&&"audio"!==s)return o.error("The element of `"+n+"` was not a media element.");r.mux&&(r.mux.destroy(),delete r.mux,o.warn("Already monitoring this video element, replacing existing event listeners")),(i=Object.assign({automaticErrorTracking:!0},i)).data=Object.assign({player_software:"HTML5 Video Element",player_mux_plugin_name:"VideoElementMonitor",player_mux_plugin_version:e.VERSION},i.data),i.getPlayheadTime=function(){return u(r.currentTime)},i.getStateData=function(){var e,t,a=this.hlsjs&&this.hlsjs.url,n=this.dashjs&&e0("function"===this.dashjs.getSource)&&this.dashjs.getSource(),s={player_is_paused:r.paused,player_playhead_time:u(r.currentTime),player_width:parseInt(d(r,"width")),player_height:parseInt(d(r,"height")),player_autoplay_on:r.autoplay,player_preload_on:r.preload,player_language_code:r.lang,player_is_fullscreen:eJ()&&!!(eJ().fullscreenElement||eJ().webkitFullscreenElement||eJ().mozFullScreenElement||eJ().msFullscreenElement),video_poster_url:r.poster,video_source_url:a||n||r.currentSrc,video_source_duration:u(r.duration),video_source_height:r.videoHeight,video_source_width:r.videoWidth,view_dropped_frame_count:null===(e=r)||void 0===e||null===(t=e.getVideoPlaybackQuality)||void 0===t?void 0:t.call(e).droppedVideoFrames},o=i.getPlayheadTime();if(r.getStartDate&&o>0){var l=r.getStartDate();if(l&&"function"==typeof l.getTime&&l.getTime()){var c=l.getTime();if(s.player_program_time=c+o,r.seekable.length>0){var h=c+r.seekable.end(r.seekable.length-1);s.player_live_edge_program_time=h}}}return s},r.mux=r.mux||{},r.mux.deleted=!1,r.mux.emit=function(t,i){e.emit(n,t,i)};var c=function(){o.error("The monitor for this video element has already been destroyed.")};r.mux.destroy=function(){Object.keys(r.mux.listeners).forEach(function(e){r.removeEventListener(e,r.mux.listeners[e],!1)}),delete r.mux.listeners,r.mux.destroy=c,r.mux.swapElement=c,r.mux.emit=c,r.mux.addHLSJS=c,r.mux.addDashJS=c,r.mux.removeHLSJS=c,r.mux.removeDashJS=c,r.mux.deleted=!0,e.emit(n,"destroy")},r.mux.swapElement=function(t){var i=e1(l(t),3),a=i[0],n=i[1],s=i[2];return a?"video"!==s&&"audio"!==s?e.log.error("The element of `"+n+"` was not a media element."):(a.muxId=r.muxId,delete r.muxId,a.mux=a.mux||{},a.mux.listeners=Object.assign({},r.mux.listeners),delete r.mux.listeners,Object.keys(a.mux.listeners).forEach(function(e){r.removeEventListener(e,a.mux.listeners[e],!1),a.addEventListener(e,a.mux.listeners[e],!1)}),a.mux.swapElement=r.mux.swapElement,a.mux.destroy=r.mux.destroy,delete r.mux,void(r=a)):e.log.error("No element was found with the `"+n+"` query selector.")},r.mux.addHLSJS=function(t){e.addHLSJS(n,t)},r.mux.addDashJS=function(t){e.addDashJS(n,t)},r.mux.removeHLSJS=function(){e.removeHLSJS(n)},r.mux.removeDashJS=function(){e.removeDashJS(n)},e.init(n,i),e.emit(n,"playerready"),r.paused||(e.emit(n,"play"),r.readyState>2&&e.emit(n,"playing")),r.mux.listeners={},tf.forEach(function(t){("error"!==t||i.automaticErrorTracking)&&(r.mux.listeners[t]=function(){var i={};if("error"===t){if(!r.error||1===r.error.code)return;i.player_error_code=r.error.code,i.player_error_message=tg[r.error.code]||r.error.message}e.emit(n,t,i)},r.addEventListener(t,r.mux.listeners[t],!1))})}(tC,e,t)},destroyMonitor:function(e){var t,i=(function(e){if(Array.isArray(e))return e}(t=l(e))||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var a,r,n=[],s=!0,o=!1;try{for(i=i.call(e);!(s=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);s=!0);}catch(e){o=!0,r=e}finally{try{s||null==i.return||i.return()}finally{if(o)throw r}}return n}}(t,1)||function(e,t){if(e){if("string"==typeof e)return tR(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?tR(e,t):void 0}}(t,1)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())[0];i&&i.mux&&"function"==typeof i.mux.destroy?i.mux.destroy():h.error("A video element monitor for `"+e+"` has not been initialized via `mux.monitor`.")},addHLSJS:function(e,t){var i=o(e);tM[i]?tM[i].addHLSJS(t):h.error("A monitor for `"+i+"` has not been initialized.")},addDashJS:function(e,t){var i=o(e);tM[i]?tM[i].addDashJS(t):h.error("A monitor for `"+i+"` has not been initialized.")},removeHLSJS:function(e){var t=o(e);tM[t]?tM[t].removeHLSJS():h.error("A monitor for `"+t+"` has not been initialized.")},removeDashJS:function(e){var t=o(e);tM[t]?tM[t].removeDashJS():h.error("A monitor for `"+t+"` has not been initialized.")},init:function(e,t){m()&&t&&t.respectDoNotTrack&&h.info("The browser's Do Not Track flag is enabled - Mux beaconing is disabled.");var i=o(e);tM[i]=new ez(tC,i,t)},emit:function(e,t,i){var a=o(e);tM[a]?(tM[a].emit(t,i),"destroy"===t&&delete tM[a]):h.error("A monitor for `"+a+"` has not been initialized.")},checkDoNotTrack:m,log:h,utils:tD,events:{PLAYER_READY:"playerready",VIEW_INIT:"viewinit",VIDEO_CHANGE:"videochange",PLAY:"play",PAUSE:"pause",PLAYING:"playing",TIME_UPDATE:"timeupdate",SEEKING:"seeking",SEEKED:"seeked",REBUFFER_START:"rebufferstart",REBUFFER_END:"rebufferend",ERROR:"error",ENDED:"ended",RENDITION_CHANGE:"renditionchange",ORIENTATION_CHANGE:"orientationchange",AD_REQUEST:"adrequest",AD_RESPONSE:"adresponse",AD_BREAK_START:"adbreakstart",AD_PLAY:"adplay",AD_PLAYING:"adplaying",AD_PAUSE:"adpause",AD_FIRST_QUARTILE:"adfirstquartile",AD_MID_POINT:"admidpoint",AD_THIRD_QUARTILE:"adthirdquartile",AD_ENDED:"adended",AD_BREAK_END:"adbreakend",AD_ERROR:"aderror",REQUEST_COMPLETED:"requestcompleted",REQUEST_FAILED:"requestfailed",REQUEST_CANCELLED:"requestcanceled"},WINDOW_HIDDEN:!1,WINDOW_UNLOADING:!1};Object.assign(tC,tO),void 0!==r()&&"function"==typeof r().addEventListener&&r().addEventListener("pagehide",function(e){e.persisted||(tC.WINDOW_UNLOADING=!0)},!1);var tx=tC},655:function(e,t,i){var a,r;function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e);/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */}!function(s){var o=!1;if(void 0===(r="function"==typeof(a=s)?a.call(t,i,t,e):a)||(e.exports=r),o=!0,"object"===n(t)&&(e.exports=s(),o=!0),!o){var l=window.Cookies,d=window.Cookies=s();d.noConflict=function(){return window.Cookies=l,d}}}(function(){var e=function(){for(var e=0,t={};e<arguments.length;e++){var i=arguments[e];for(var a in i)t[a]=i[a]}return t};return function t(i){function a(t,r,n){var s;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(n=e({path:"/"},a.defaults,n)).expires){var o=new Date;o.setMilliseconds(o.getMilliseconds()+864e5*n.expires),n.expires=o}try{s=JSON.stringify(r),/^[\{\[]/.test(s)&&(r=s)}catch(e){}return r=i.write?i.write(r,t):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=(t=(t=encodeURIComponent(String(t))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape),document.cookie=[t,"=",r,n.expires?"; expires="+n.expires.toUTCString():"",n.path?"; path="+n.path:"",n.domain?"; domain="+n.domain:"",n.secure?"; secure":""].join("")}t||(s={});for(var l=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<l.length;u++){var c=l[u].split("="),h=c.slice(1).join("=");'"'===h.charAt(0)&&(h=h.slice(1,-1));try{var m=c[0].replace(d,decodeURIComponent);if(h=i.read?i.read(h,m):i(h,m)||h.replace(d,decodeURIComponent),this.json)try{h=JSON.parse(h)}catch(e){}if(t===m){s=h;break}t||(s[m]=h)}catch(e){}}return s}}return a.set=a,a.get=function(e){return a.call(a,e)},a.getJSON=function(){return a.apply({json:!0},[].slice.call(arguments))},a.defaults={},a.remove=function(t,i){a(t,"",e(i,{expires:-1}))},a.withConverter=t,a}(function(){})})},153:function(e,t,i){var a,r=void 0!==i.g?i.g:"undefined"!=typeof window?window:{},n=i(558);"undefined"!=typeof document?a=document:(a=r["__GLOBAL_DOCUMENT_CACHE@4"])||(a=r["__GLOBAL_DOCUMENT_CACHE@4"]=n),e.exports=a},48:function(e,t,i){var a;a="undefined"!=typeof window?window:void 0!==i.g?i.g:"undefined"!=typeof self?self:{},e.exports=a},640:function(e,t,i){var a,r;void 0===(r="function"==typeof(a=function(){var e=function(){},t="undefined",i=typeof window!==t&&typeof window.navigator!==t&&/Trident\/|MSIE /.test(window.navigator.userAgent),a=["trace","debug","info","warn","error"];function r(e,t){var i=e[t];if("function"==typeof i.bind)return i.bind(e);try{return Function.prototype.bind.call(i,e)}catch(t){return function(){return Function.prototype.apply.apply(i,[e,arguments])}}}function n(){console.log&&(console.log.apply?console.log.apply(console,arguments):Function.prototype.apply.apply(console.log,[console,arguments])),console.trace&&console.trace()}function s(t,i){for(var r=0;r<a.length;r++){var n=a[r];this[n]=r<t?e:this.methodFactory(n,t,i)}this.log=this.debug}function o(e,i,a){return function(){typeof console!==t&&(s.call(this,i,a),this[e].apply(this,arguments))}}function l(a,s,l){var d;return"debug"===(d=a)&&(d="log"),typeof console!==t&&("trace"===d&&i?n:void 0!==console[d]?r(console,d):void 0!==console.log?r(console,"log"):e)||o.apply(this,arguments)}function d(e,i,r){var n,o=this;i=null==i?"WARN":i;var d="loglevel";function u(){var e;if(typeof window!==t&&d){try{e=window.localStorage[d]}catch(e){}if(typeof e===t)try{var i=window.document.cookie,a=i.indexOf(encodeURIComponent(d)+"=");-1!==a&&(e=/^([^;]+)/.exec(i.slice(a))[1])}catch(e){}return void 0===o.levels[e]&&(e=void 0),e}}"string"==typeof e?d+=":"+e:"symbol"==typeof e&&(d=void 0),o.name=e,o.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},o.methodFactory=r||l,o.getLevel=function(){return n},o.setLevel=function(i,r){if("string"==typeof i&&void 0!==o.levels[i.toUpperCase()]&&(i=o.levels[i.toUpperCase()]),!("number"==typeof i&&i>=0&&i<=o.levels.SILENT))throw"log.setLevel() called with invalid level: "+i;if(n=i,!1!==r&&function(e){var i=(a[e]||"silent").toUpperCase();if(typeof window!==t&&d){try{return void(window.localStorage[d]=i)}catch(e){}try{window.document.cookie=encodeURIComponent(d)+"="+i+";"}catch(e){}}}(i),s.call(o,i,e),typeof console===t&&i<o.levels.SILENT)return"No console available for logging"},o.setDefaultLevel=function(e){i=e,u()||o.setLevel(e,!1)},o.resetLevel=function(){o.setLevel(i,!1),function(){if(typeof window!==t&&d){try{return void window.localStorage.removeItem(d)}catch(e){}try{window.document.cookie=encodeURIComponent(d)+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC"}catch(e){}}}()},o.enableAll=function(e){o.setLevel(o.levels.TRACE,e)},o.disableAll=function(e){o.setLevel(o.levels.SILENT,e)};var c=u();null==c&&(c=i),o.setLevel(c,!1)}var u=new d,c={};u.getLogger=function(e){if("symbol"!=typeof e&&"string"!=typeof e||""===e)throw TypeError("You must supply a name when creating a logger.");var t=c[e];return t||(t=c[e]=new d(e,u.getLevel(),u.methodFactory)),t};var h=typeof window!==t?window.log:void 0;return u.noConflict=function(){return typeof window!==t&&window.log===u&&(window.log=h),u},u.getLoggers=function(){return c},u.default=u,u})?a.call(t,i,t,e):a)||(e.exports=r)},375:function(e,t){"use strict";var i=Object.prototype.hasOwnProperty;function a(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(e){return null}}function r(e){try{return encodeURIComponent(e)}catch(e){return null}}t.stringify=function(e,t){var a,n,s=[];for(n in"string"!=typeof(t=t||"")&&(t="?"),e)if(i.call(e,n)){if((a=e[n])||null!=a&&!isNaN(a)||(a=""),n=r(n),a=r(a),null===n||null===a)continue;s.push(n+"="+a)}return s.length?t+s.join("&"):""},t.parse=function(e){for(var t,i=/([^=?#&]+)=?([^&]*)/g,r={};t=i.exec(e);){var n=a(t[1]),s=a(t[2]);null===n||null===s||n in r||(r[n]=s)}return r}},558:function(){}},t={};function i(a){var r=t[a];if(void 0!==r)return r.exports;var n=t[a]={exports:{}};return e[a].call(n.exports,n,n.exports,i),n.exports}return i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,{a:t}),t},i.d=function(e,t){for(var a in t)i.o(t,a)&&!i.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i(80)}()},62294:function(e,t,i){"use strict";let a,r;i.d(t,{cg:function(){return aK}});let n={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},s={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},o={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_PAUSED:"mediaPaused",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_ENDED:"mediaEnded",MEDIA_MUTED:"mediaMuted",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_IS_PIP:"mediaIsPip",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_LOADING:"mediaLoading",MEDIA_BUFFERED:"mediaBuffered",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled"},l=Object.entries(o),d=l.reduce((e,[t,i])=>(e[t]=`${i.toLowerCase()}`,e),{}),u=l.reduce((e,[t,i])=>(e[t]=`${i.toLowerCase()}`,e),{USER_INACTIVE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange"});Object.entries(u).reduce((e,[t,i])=>{let a=d[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"});let c=Object.entries(d).reduce((e,[t,i])=>{let a=u[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),h={SUBTITLES:"subtitles",CAPTIONS:"captions",METADATA:"metadata"},m={DISABLED:"disabled",SHOWING:"showing"},p={MOUSE:"mouse",TOUCH:"touch"},v={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},b={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},E={AUDIO_PLAYER:()=>"audio player",VIDEO_PLAYER:()=>"video player",VOLUME:()=>"volume",SEEK:()=>"seek",CLOSED_CAPTIONS:()=>"closed captions",PLAYBACK_RATE:({playbackRate:e=1}={})=>`current playback rate ${e}`,PLAYBACK_TIME:()=>"playback time",MEDIA_LOADING:()=>"media loading"},f={PLAY:()=>"play",PAUSE:()=>"pause",MUTE:()=>"mute",UNMUTE:()=>"unmute",AIRPLAY:()=>"air play",ENTER_CAST:()=>"start casting",EXIT_CAST:()=>"stop casting",ENTER_FULLSCREEN:()=>"enter fullscreen mode",EXIT_FULLSCREEN:()=>"exit fullscreen mode",ENTER_PIP:()=>"enter picture in picture mode",EXIT_PIP:()=>"exit picture in picture mode",SEEK_FORWARD_N_SECS:({seekOffset:e=30}={})=>`seek forward ${e} seconds`,SEEK_BACK_N_SECS:({seekOffset:e=30}={})=>`seek back ${e} seconds`,SEEK_LIVE:()=>"seek to live",PLAYING_LIVE:()=>"playing live"};function g(e){if(e){let{id:t,width:i,height:a}=e;return[t,i,a].filter(e=>null!=e).join(":")}}function _(e){if(e){let[t,i,a]=e.split(":");return{id:t,width:i,height:a}}}function y(e){if(e){let{id:t,kind:i,language:a,label:r}=e;return[t,i,a,r].filter(e=>null!=e).join(":")}}function A(e){if(e){let[t,i,a,r]=e.split(":");return{id:t,kind:i,language:a,label:r}}}function T(e,t=!1){return e.split("_").map(function(e,i){return(i||t?e[0].toUpperCase():e[0].toLowerCase())+e.slice(1).toLowerCase()}).join("")}function k(e){return"string"==typeof e&&!isNaN(e)&&!isNaN(parseFloat(e))}({...E,...f});let w=e=>new Promise(t=>setTimeout(t,e)),I=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],S=(e,t)=>{let i=1===e?I[t].singular:I[t].plural;return`${e} ${i}`},L=e=>{if(!("number"==typeof e&&!Number.isNaN(e)&&Number.isFinite(e)))return"";let t=Math.abs(e),i=new Date(0,0,0,0,0,t,0),a=[i.getHours(),i.getMinutes(),i.getSeconds()],r=a.map((e,t)=>e&&S(e,t)).filter(e=>e).join(", ");return`${r}${t!==e?" remaining":""}`};function D(e,t){let i=!1;e<0&&(i=!0,e=0-e);let a=Math.floor((e=e<0?0:e)%60),r=Math.floor(e/60%60),n=Math.floor(e/3600);return(isNaN(e)||e===1/0)&&(n=r=a="0"),r=(((n=n>0||Math.floor(t/3600)>0?n+":":"")||Math.floor(t/60%60)>=10)&&r<10?"0"+r:r)+":",(i?"-":"")+n+r+(a=a<10?"0"+a:a)}Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});let R=(e,t,i=".value")=>{let a=e.querySelector(i);a&&(a.textContent=t)},M=(e,t)=>{let i=`slot[name="${t}"]`,a=e.shadowRoot.querySelector(i);return a?a.children:[]},C=(e,t)=>M(e,t)[0],O=(e,t)=>!!e&&!!t&&(!!e.contains(t)||O(e,t.getRootNode().host)),x=(e,t)=>{if(!e)return null;let i=e.closest(t);return i||x(e.getRootNode().host,t)};function N(e,t){var i;let a;for(a of e.querySelectorAll("style")){let e;try{e=null==(i=a.sheet)?void 0:i.cssRules}catch{continue}for(let i of null!=e?e:[])if(i.selectorText===t)return i}return(null==a?void 0:a.sheet)?(a.sheet.insertRule(`${t}{}`,a.sheet.cssRules.length),a.sheet.cssRules[a.sheet.cssRules.length-1]):{style:{setProperty:()=>{},removeProperty:()=>{}}}}function P(e,t,i=Number.NaN){let a=e.getAttribute(t);return null!=a?+a:i}function U(e,t,i){let a=+i;if(null==i||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}P(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function B(e,t){return e.hasAttribute(t)}function W(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}B(e,t)!=i&&e.toggleAttribute(t,i)}function V(e,t,i=null){var a;return null!=(a=e.getAttribute(t))?a:i}function q(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;V(e,t,void 0)!==a&&e.setAttribute(t,a)}class H{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}let F={createElement:function(){return new $.HTMLElement},addEventListener(){},removeEventListener(){}},$={ResizeObserver:class{observe(){}},document:F,HTMLElement:class extends H{},DocumentFragment:class extends H{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},CustomEvent:function(){},getComputedStyle:function(){}},j="undefined"==typeof window||void 0===window.customElements,K=Object.keys($).every(e=>e in globalThis),Y=j&&!K?$:globalThis,G=j&&!K?F:globalThis.document;var Q=Object.defineProperty,Z=(e,t,i)=>t in e?Q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,z=(e,t,i)=>(Z(e,"symbol"!=typeof t?t+"":t,i),i),X=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},J=(e,t,i)=>(X(e,t,"read from private field"),i?i.call(e):t.get(e)),ee=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},et=(e,t,i,a)=>(X(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let ei=G.createElement("template");ei.innerHTML=`
<style>
  :host {
    font: var(--media-font,
      var(--media-font-weight, bold)
      var(--media-font-size, 14px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
    padding: var(--media-control-padding, 10px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    box-sizing: border-box;
    transition: background .15s linear;
    pointer-events: auto;
    cursor: pointer;
  }

  
  :host(:focus-visible) {
    box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
    outline: 0;
  }
  
  :host(:where(:focus)) {
    box-shadow: none;
    outline: 0;
  }

  :host(:hover) {
    background: var(--media-control-hover-background, rgba(50 50 70 / .7));
  }

  svg, img, ::slotted(svg), ::slotted(img) {
    width: var(--media-button-icon-width);
    height: var(--media-button-icon-height, var(--media-control-height, 24px));
    transform: var(--media-button-icon-transform);
    transition: var(--media-button-icon-transition);
    fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;
    min-width: 100%;
  }
</style>
`;class ea extends Y.HTMLElement{constructor(e={}){if(super(),ee(this,rc,void 0),z(this,"preventClick",!1),ee(this,rh,e=>{this.preventClick||this.handleClick(e)}),ee(this,rm,e=>{let{key:t}=e;if(!this.keysUsed.includes(t)){this.removeEventListener("keyup",J(this,rm));return}this.preventClick||this.handleClick(e)}),ee(this,rp,e=>{let{metaKey:t,altKey:i,key:a}=e;if(t||i||!this.keysUsed.includes(a)){this.removeEventListener("keyup",J(this,rm));return}this.addEventListener("keyup",J(this,rm),{once:!0})}),!this.shadowRoot){this.attachShadow({mode:"open"});let t=ei.content.cloneNode(!0);this.nativeEl=t;let i=e.slotTemplate;i||((i=G.createElement("template")).innerHTML=`<slot>${e.defaultContent||""}</slot>`),this.nativeEl.appendChild(i.content.cloneNode(!0)),this.shadowRoot.appendChild(t)}let{style:t}=N(this.shadowRoot,":host");t.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`)}static get observedAttributes(){return["disabled",s.MEDIA_CONTROLLER]}enable(){this.addEventListener("click",J(this,rh)),this.addEventListener("keydown",J(this,rp)),this.tabIndex=0}disable(){this.removeEventListener("click",J(this,rh)),this.removeEventListener("keydown",J(this,rp)),this.removeEventListener("keyup",J(this,rm)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=J(this,rc))?void 0:a.unassociateElement)||r.call(a,this),et(this,rc,null)),i&&(et(this,rc,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=J(this,rc))?void 0:o.associateElement)||l.call(o,this))):"disabled"===e&&i!==t&&(null==i?this.enable():this.disable())}connectedCallback(){var e,t,i;this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","button");let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(et(this,rc,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=J(this,rc))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=J(this,rc))?void 0:e.unassociateElement)||t.call(e,this),et(this,rc,null)}get keysUsed(){return["Enter"," "]}handleClick(e){}}rc=new WeakMap,rh=new WeakMap,rm=new WeakMap,rp=new WeakMap,Y.customElements.get("media-chrome-button")||Y.customElements.define("media-chrome-button",ea);let er=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`,en=G.createElement("template");en.innerHTML=`
  <slot name="icon">${er}</slot>
`,Y.customElements.get("media-airplay-button")||Y.customElements.define("media-airplay-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_AIRPLAY_UNAVAILABLE]}constructor(e={}){super({slotTemplate:en,...e})}connectedCallback(){this.setAttribute("aria-label",f.AIRPLAY()),super.connectedCallback()}get mediaAirplayUnavailable(){return V(this,d.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){q(this,d.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new Y.CustomEvent(n.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}});let es=G.createElement("template");es.innerHTML=`
  <style>
  :host([${d.MEDIA_IS_CASTING}]) slot:not([name=exit]):not([name=icon]) {
    display: none !important;
  }

  
  :host(:not([${d.MEDIA_IS_CASTING}])) slot:not([name=enter]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="enter"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg></slot>
    <slot name="exit"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg></slot>
  </slot>
`;let eo=e=>{let t=null!=e.getAttribute(d.MEDIA_IS_CASTING),i=t?f.EXIT_CAST():f.ENTER_CAST();e.setAttribute("aria-label",i)};Y.customElements.get("media-cast-button")||Y.customElements.define("media-cast-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_IS_CASTING,d.MEDIA_CAST_UNAVAILABLE]}constructor(e={}){super({slotTemplate:es,...e})}connectedCallback(){eo(this),super.connectedCallback()}attributeChangedCallback(e,t,i){e===d.MEDIA_IS_CASTING&&eo(this),super.attributeChangedCallback(e,t,i)}get mediaIsCasting(){return B(this,d.MEDIA_IS_CASTING)}set mediaIsCasting(e){W(this,d.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return V(this,d.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){q(this,d.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?n.MEDIA_EXIT_CAST_REQUEST:n.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new Y.CustomEvent(e,{composed:!0,bubbles:!0}))}});var el=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ed=(e,t,i)=>(el(e,t,"read from private field"),i?i.call(e):t.get(e)),eu=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ec=(e,t,i,a)=>(el(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let eh=G.createElement("template");eh.innerHTML=`
<style>
  :host {
    display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
    box-sizing: border-box;
  }
</style>
`;class em extends Y.HTMLElement{constructor(e={}){if(super(),eu(this,rv,void 0),!this.shadowRoot){let t=this.attachShadow({mode:"open"}),i=eh.content.cloneNode(!0);this.nativeEl=i;let a=e.slotTemplate;a||((a=G.createElement("template")).innerHTML=`<slot>${e.defaultContent||""}</slot>`),this.nativeEl.appendChild(a.content.cloneNode(!0)),t.appendChild(i)}}static get observedAttributes(){return[s.MEDIA_CONTROLLER,d.MEDIA_PAUSED]}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ed(this,rv))?void 0:a.unassociateElement)||r.call(a,this),ec(this,rv,null)),i&&(ec(this,rv,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=ed(this,rv))?void 0:o.associateElement)||l.call(o,this)))}connectedCallback(){var e,t,i,a;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),ec(this,rv,function(e){var t;let i=e.getAttribute(s.MEDIA_CONTROLLER);return i?null==(t=e.getRootNode())?void 0:t.getElementById(i):x(e,"media-controller")}(this)),this.getAttribute(s.MEDIA_CONTROLLER)&&(null==(t=null==(e=ed(this,rv))?void 0:e.associateElement)||t.call(e,this)),null==(i=ed(this,rv))||i.addEventListener("pointerdown",this),null==(a=ed(this,rv))||a.addEventListener("click",this)}disconnectedCallback(){var e,t,i,a;this.getAttribute(s.MEDIA_CONTROLLER)&&(null==(t=null==(e=ed(this,rv))?void 0:e.unassociateElement)||t.call(e,this)),null==(i=ed(this,rv))||i.removeEventListener("pointerdown",this),null==(a=ed(this,rv))||a.removeEventListener("click",this),ec(this,rv,null)}handleEvent(e){var t;let i=null==(t=e.composedPath())?void 0:t[0];if(["video","media-controller"].includes(null==i?void 0:i.localName)){if("pointerdown"===e.type)this._pointerType=e.pointerType;else if("click"===e.type){let{clientX:t,clientY:i}=e,{left:a,top:r,width:n,height:s}=this.getBoundingClientRect(),o=t-a,l=i-r;if(o<0||l<0||o>n||l>s||0===n&&0===s)return;let{pointerType:d=this._pointerType}=e;if(this._pointerType=void 0,d===p.TOUCH){this.handleTap(e);return}if(d===p.MOUSE){this.handleMouseClick(e);return}}}}get mediaPaused(){return B(this,d.MEDIA_PAUSED)}set mediaPaused(e){W(this,d.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let t=this.mediaPaused?n.MEDIA_PLAY_REQUEST:n.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new Y.CustomEvent(t,{composed:!0,bubbles:!0}))}}rv=new WeakMap,Y.customElements.get("media-gesture-receiver")||Y.customElements.define("media-gesture-receiver",em);var ep=Object.defineProperty,ev=(e,t,i)=>t in e?ep(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,eb=(e,t,i)=>(ev(e,"symbol"!=typeof t?t+"":t,i),i);let eE={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive"},ef=G.createElement("template");ef.innerHTML=`
  <style>
    
    :host([${d.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
      outline: none;
    }

    :host {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      line-height: 0;
      background-color: var(--media-background-color, #000);
    }

    :host(:not([${eE.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: start;
      pointer-events: none;
      background: none;
    }

    slot[name=media] {
      display: var(--media-slot-display, contents);
    }

    
    :host([${eE.AUDIO}]) slot[name=media] {
      display: var(--media-slot-display, none);
    }

    
    :host([${eE.AUDIO}]) [part~=layer][part~=gesture-layer] {
      height: 0;
      display: block;
    }

    
    :host(:not([${eE.AUDIO}])[${eE.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
    :host(:not([${eE.AUDIO}])[${eE.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
      display: none;
    }

    
    ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator)) {
      pointer-events: auto;
    }

    :host(:not([${eE.AUDIO}])) *[part~=layer][part~=centered-layer] {
      align-items: center;
      justify-content: center;
    }

    :host(:not([${eE.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
    :host(:not([${eE.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
      align-self: stretch;
      flex-grow: 1;
    }

    slot[name=middle-chrome] {
      display: inline;
      flex-grow: 1;
      pointer-events: none;
      background: none;
    }

    
    ::slotted([slot=media]),
    ::slotted([slot=poster]) {
      width: 100%;
      height: 100%;
    }

    
    :host(:not([${eE.AUDIO}])) .spacer {
      flex-grow: 1;
    }

    
    :host(:-webkit-full-screen) {
      
      width: 100% !important;
      height: 100% !important;
    }

    
    ::slotted(:not([slot=media]):not([${eE.NO_AUTOHIDE}])) {
      opacity: 1;
      transition: opacity 0.25s;
    }

    
    :host([${eE.USER_INACTIVE}]:not([${d.MEDIA_PAUSED}]):not([${d.MEDIA_IS_CASTING}]):not([${eE.AUDIO}])) ::slotted(:not([slot=media]):not([${eE.NO_AUTOHIDE}])) {
      opacity: 0;
      transition: opacity 1s;
    }

    ::slotted(media-control-bar)  {
      align-self: stretch;
    }

    
    :host(:not([${eE.AUDIO}])[${d.MEDIA_HAS_PLAYED}]) slot[name=poster] {
      display: none;
    }
  </style>

  <slot name="media" part="layer media-layer"></slot>
  <slot name="poster" part="layer poster-layer"></slot>
  <slot name="gestures-chrome" part="layer gesture-layer">
    <media-gesture-receiver slot="gestures-chrome"></media-gesture-receiver>
  </slot>
  <span part="layer vertical-layer">
    <slot name="top-chrome" part="top chrome"></slot>
    <slot name="middle-chrome" part="middle chrome"></slot>
    <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
    
    <slot part="bottom chrome"></slot>
  </span>
`;let eg=Object.values(d);class e_ extends Y.HTMLElement{constructor(){super(),eb(this,"breakpointsUncomputed",!0),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ef.content.cloneNode(!0)));let e=new MutationObserver(e=>{let t=this.media;for(let i of e)"childList"===i.type&&(i.removedNodes.forEach(e=>{if("media"==e.slot&&i.target==this){let a=i.previousSibling&&i.previousSibling.previousElementSibling;if(a&&t){let t="media"!==a.slot;for(;null!==(a=a.previousSibling);)"media"==a.slot&&(t=!1);t&&this.mediaUnsetCallback(e)}else this.mediaUnsetCallback(e)}}),t&&i.addedNodes.forEach(e=>{e==t&&this.handleMediaUpdated(t).then(e=>this.mediaSetCallback(e))}))});e.observe(this,{childList:!0,subtree:!0});let t=!1,i=new ResizeObserver(e=>{t||(setTimeout(()=>{(function(e){for(let t of e)(function(e,t){var i;if(!e.isConnected)return;let a=null!=(i=e.getAttribute(eE.BREAKPOINTS))?i:"sm:384 md:576 lg:768 xl:960",r=function(e){let t=e.split(/\s+/);return Object.fromEntries(t.map(e=>e.split(":")))}(a),n=function(e,t){return Object.keys(e).filter(i=>t>=e[i])}(r,t),s=!1;if(Object.keys(r).forEach(t=>{if(n.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,""),s=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),s=!0)}),s){let t=new CustomEvent(u.BREAKPOINTS_CHANGE,{detail:n});e.dispatchEvent(t)}})(t.target,t.contentRect.width)})(e),t=!1,this.breakpointsUncomputed=!1},0),t=!0)});this.resizeObserver=i,i.observe(this);let a=this.media,r=this.querySelector(":scope > slot[slot=media]");r&&r.addEventListener("slotchange",()=>{let e=r.assignedElements({flatten:!0});if(!e.length){this.mediaUnsetCallback(a);return}this.media&&(a=this.media,this.handleMediaUpdated(this.media).then(e=>this.mediaSetCallback(e)))})}static get observedAttributes(){return[eE.AUTOHIDE,eE.GESTURES_DISABLED].concat(eg).filter(e=>![d.MEDIA_RENDITION_LIST,d.MEDIA_AUDIO_TRACK_LIST].includes(e))}attributeChangedCallback(e,t,i){e.toLowerCase()==eE.AUTOHIDE&&(this.autohide=i)}get media(){let e=this.querySelector(":scope > [slot=media]");return(null==e?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}mediaSetCallback(e){this._mediaClickPlayToggle=()=>{let t=e.paused?n.MEDIA_PLAY_REQUEST:n.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new Y.CustomEvent(t,{composed:!0,bubbles:!0}))}}handleMediaUpdated(e){let t=e=>Promise.resolve(e);if(!e)return console.error('<media-chrome>: Media element set with slot="media" does not appear to be compatible.',e),Promise.reject(e);let i=e.nodeName.toLowerCase();return i.includes("-")?Y.customElements.whenDefined(i).then(()=>t(e)):t(e)}mediaUnsetCallback(e){}connectedCallback(){var e;let t=null!=this.getAttribute(eE.AUDIO),i=t?E.AUDIO_PLAYER():E.VIDEO_PLAYER();this.setAttribute("role","region"),this.setAttribute("aria-label",i),this.media&&this.handleMediaUpdated(this.media).then(e=>this.mediaSetCallback(e)),this.setAttribute(eE.USER_INACTIVE,"");let a=()=>{if(this.autohide<0||this.hasAttribute(eE.USER_INACTIVE))return;this.setAttribute(eE.USER_INACTIVE,"");let e=new Y.CustomEvent(u.USER_INACTIVE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},r=()=>{if(!this.hasAttribute(eE.USER_INACTIVE))return;this.removeAttribute(eE.USER_INACTIVE);let e=new Y.CustomEvent(u.USER_INACTIVE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},n=()=>{r(),clearTimeout(this._inactiveTimeout),this.autohide<0||(this._inactiveTimeout=setTimeout(()=>{a()},1e3*this.autohide))};this.addEventListener("keyup",()=>{n()}),this.addEventListener("pointerup",e=>{"touch"===e.pointerType?[this,this.media].includes(e.target)&&!this.hasAttribute(eE.USER_INACTIVE)?a():n():e.composedPath().some(e=>{var t;return["media-play-button","media-fullscreen-button"].includes(null==(t=null==e?void 0:e.nodeName)?void 0:t.toLowerCase())})&&n()}),this.addEventListener("pointermove",e=>{"mouse"===e.pointerType&&(r(),clearTimeout(this._inactiveTimeout),[this,this.media].includes(e.target)&&n())}),this.addEventListener("mouseleave",()=>{a()}),this.addEventListener("keyup",()=>{this.setAttribute(eE.KEYBOARD_CONTROL,"")}),null==(e=Y.window)||e.addEventListener("mouseup",()=>{this.removeAttribute(eE.KEYBOARD_CONTROL)})}set autohide(e){e=Number(e),this._autohide=isNaN(e)?0:e}get autohide(){return void 0===this._autohide?2:this._autohide}}var ey=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},eA=(e,t,i)=>(ey(e,t,"read from private field"),i?i.call(e):t.get(e)),eT=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ek=(e,t,i,a)=>(ey(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class ew{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){eT(this,r_),eT(this,rb,void 0),eT(this,rE,void 0),eT(this,rf,void 0),eT(this,rg,new Set),ek(this,rb,e),ek(this,rE,t),ek(this,rf,new Set(i))}[Symbol.iterator](){return eA(this,r_,ry).values()}get length(){return eA(this,r_,ry).size}get value(){var e;return null!=(e=[...eA(this,r_,ry)].join(" "))?e:""}set value(e){var t;e!==this.value&&(ek(this,rg,new Set),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return[...eA(this,r_,ry)][e]}values(){return eA(this,r_,ry).values()}forEach(e){eA(this,r_,ry).forEach(e)}add(...e){var t,i;e.forEach(e=>eA(this,rg).add(e)),(""!==this.value||(null==(t=eA(this,rb))?void 0:t.hasAttribute(`${eA(this,rE)}`)))&&(null==(i=eA(this,rb))||i.setAttribute(`${eA(this,rE)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>eA(this,rg).delete(e)),null==(t=eA(this,rb))||t.setAttribute(`${eA(this,rE)}`,`${this.value}`)}contains(e){return eA(this,r_,ry).has(e)}toggle(e,t){return void 0!==t?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}}rb=new WeakMap,rE=new WeakMap,rf=new WeakMap,rg=new WeakMap,r_=new WeakSet,ry=function(){return eA(this,rg).size?eA(this,rg):eA(this,rf)};let eI=(e="")=>e.split(/\s+/),eS=(e="")=>{let[t,i,a]=e.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:t="cc"===t?"captions":"subtitles",language:i,label:r}},eL=(e="",t={})=>eI(e).map(e=>{let i=eS(e);return{...t,...i}}),eD=e=>Array.isArray(e)?e.map(e=>"string"==typeof e?eS(e):e):"string"==typeof e?eL(e):[e],eR=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${"captions"===e?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,eM=(e=[])=>Array.prototype.map.call(e,eR).join(" "),eC=(e,t)=>i=>i[e]===t,eO=e=>{let t=Object.entries(e).map(([e,t])=>eC(e,t));return e=>t.every(t=>t(e))},ex=(e,t=[],i=[])=>{let a=eD(i).map(eO);Array.from(t).filter(e=>a.some(t=>t(e))).forEach(t=>{t.mode=e})},eN=(e,t=()=>!0)=>{if(!(null==e?void 0:e.textTracks))return[];let i="function"==typeof t?t:eO(t);return Array.from(e.textTracks).filter(i)},eP=e=>{let t=!!e.getAttribute(d.MEDIA_SUBTITLES_SHOWING);return t},eU=(e,t)=>{var i,a;let r=eP(e);if(r||!1===t){let t=e.getAttribute(d.MEDIA_SUBTITLES_SHOWING);if(t){let i=new Y.CustomEvent(n.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}}else if(r&&!0!==t)console.error("Attempting to enable captions or subtitles but none are available! Please verify your media content if this is unexpected.");else{let[t]=null!=(a=eI(null!=(i=e.getAttribute(d.MEDIA_SUBTITLES_LIST))?i:""))?a:[];if(t){let i=new Y.CustomEvent(n.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}}},eB={enter:"requestFullscreen",exit:"exitFullscreen",rootEvents:["fullscreenchange"],mediaEvents:[],element:"fullscreenElement",error:"fullscreenerror",enabled:"fullscreenEnabled"};void 0===G.fullscreenElement&&(eB.enter="webkitRequestFullScreen",eB.exit=null!=G.webkitExitFullscreen?"webkitExitFullscreen":"webkitCancelFullScreen",eB.rootEvents=["webkitfullscreenchange"],eB.mediaEvents=["webkitbeginfullscreen","webkitendfullscreen"],eB.element="webkitFullscreenElement",eB.error="webkitfullscreenerror",eB.enabled="webkitFullscreenEnabled");let eW=()=>{var e;return a||(a=null==(e=null==G?void 0:G.createElement)?void 0:e.call(G,"video"))},eV=async(e=eW())=>{if(!e)return!1;let t=e.volume;return e.volume=t/2+.1,await w(0),e.volume!==t},eq=((e=eW())=>{let t=G[eB.enabled];return!t&&e&&(t="webkitSupportsFullscreen"in e),t})(),eH=((e=eW())=>"function"==typeof(null==e?void 0:e.requestPictureInPicture))(),eF=!!Y.WebKitPlaybackTargetAvailabilityEvent,e$=!!Y.chrome,ej=eV().then(e=>r=e),eK=Object.values(b),eY=e=>eN(e.media,e=>[h.SUBTITLES,h.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),eG=e=>eN(e.media,e=>e.mode===m.SHOWING&&[h.SUBTITLES,h.CAPTIONS].includes(e.kind)),eQ={MEDIA_PAUSED:{get:function(e){let{media:t}=e;return!t||t.paused},mediaEvents:["play","playing","pause","emptied"]},MEDIA_HAS_PLAYED:{get:function(e){let{media:t}=e;return!!t&&!t.paused},mediaEvents:["playing","emptied"]},MEDIA_ENDED:{get:function(e){let{media:t}=e;return!!t&&t.ended},mediaEvents:["seeked","ended","emptied"]},MEDIA_PLAYBACK_RATE:{get:function(e){let{media:t}=e;return t&&void 0!==t.playbackRate?t.playbackRate:1},mediaEvents:["ratechange","loadstart"]},MEDIA_MUTED:{get:function(e){let{media:t}=e;return!!t&&void 0!==t.muted&&t.muted},mediaEvents:["volumechange"]},MEDIA_VOLUME:{get:function(e){let{media:t}=e;return t&&void 0!==t.volume?Number(t.volume):1},mediaEvents:["volumechange"]},MEDIA_VOLUME_LEVEL:{get:function(e){let{media:t}=e,i="high";if(!t||void 0===t.volume)return i;let{muted:a,volume:r}=t;return 0===r||a?i="off":r<.5?i="low":r<.75&&(i="medium"),i},mediaEvents:["volumechange"]},MEDIA_CURRENT_TIME:{get:function(e){let{media:t}=e;return t&&void 0!==t.currentTime?t.currentTime:0},mediaEvents:["timeupdate","loadedmetadata"]},MEDIA_DURATION:{get:function(e){let{media:t}=e;return t&&Number.isFinite(t.duration)?t.duration:NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},MEDIA_SEEKABLE:{get:function(e){var t;let{media:i}=e;if(!(null==(t=null==i?void 0:i.seekable)?void 0:t.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(a||r)return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress"]},MEDIA_LOADING:{get:function(e){var t;return(null==(t=e.media)?void 0:t.readyState)<3},mediaEvents:["waiting","playing","emptied"]},MEDIA_BUFFERED:{get:function(e){var t,i,a;let r=null==(t=e.media)?void 0:t.buffered;return Array.from(null!=(a=null==(i=e.media)?void 0:i.buffered)?a:[]).map((e,t)=>[Number(r.start(t)).toFixed(3),Number(r.end(t)).toFixed(3)])},mediaEvents:["progress","emptied"]},MEDIA_STREAM_TYPE:{get:function(e){let{media:t}=e;if(!t)return;let{streamType:i}=t;if(eK.includes(i)){if(i===b.UNKNOWN){let t=e.getAttribute("defaultstreamtype");return[b.LIVE,b.ON_DEMAND].includes(t)?t:void 0}return i}let a=t.duration;if(a===1/0)return b.LIVE;if(Number.isFinite(a))return b.ON_DEMAND;{let t=e.getAttribute("defaultstreamtype");if([b.LIVE,b.ON_DEMAND].includes(t))return t}},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},MEDIA_TARGET_LIVE_WINDOW:{get:function(e){let{media:t}=e;if(!t)return Number.NaN;let{targetLiveWindow:i}=t,a=eQ.MEDIA_STREAM_TYPE.get(e);return(null==i||Number.isNaN(i))&&a===b.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},MEDIA_TIME_IS_LIVE:{get:function(e){let{media:t}=e;if(!t)return!1;if("number"==typeof t.liveEdgeStart)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;let i="live"===eQ.MEDIA_STREAM_TYPE.get(e);if(!i)return!1;let a=t.seekable;if(!a)return!0;if(!a.length)return!1;let r=e.hasAttribute("liveedgeoffset")?Number(e.getAttribute("liveedgeoffset")):10,n=a.end(a.length-1)-r;return t.currentTime>=n},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},MEDIA_IS_FULLSCREEN:{get:function(e,t){var i;let a;let r=e.media;if(r&&void 0===G[eB.element]&&"webkitDisplayingFullscreen"in r)return r.webkitDisplayingFullscreen&&"fullscreen"===r.webkitPresentationMode;if(t){let e=G[eB.element];a=e?t.target:null}else a=null!=(i=e.getRootNode().fullscreenElement)?i:G[eB.element];return O(e.fullscreenElement,a)},rootEvents:eB.rootEvents,mediaEvents:eB.mediaEvents},MEDIA_IS_PIP:{get:function(e,t){var i;let a=e.media;if(!a)return!1;if(t)return"enterpictureinpicture"==t.type;{let t=null!=(i=e.getRootNode().pictureInPictureElement)?i:G.pictureInPictureElement;return O(a,t)}},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},MEDIA_IS_CASTING:{get:function(e,t){var i;let{media:a}=e;if(!a)return!1;let r=null==(i=Y.CastableVideoElement)?void 0:i.castElement,n=O(a,r);return(null==t?void 0:t.type)==="castchange"&&(null==t?void 0:t.detail)==="CONNECTING"&&(n="connecting"),n},mediaEvents:["entercast","leavecast","castchange"]},MEDIA_AIRPLAY_UNAVAILABLE:{get:function(e,t){if(!eF)return v.UNSUPPORTED;if(t){if("available"===t.availability)return;if("not-available"===t.availability)return v.UNAVAILABLE}},mediaEvents:["webkitplaybacktargetavailabilitychanged"]},MEDIA_CAST_UNAVAILABLE:{get:function(){var e;let t=null==(e=Y.CastableVideoElement)?void 0:e.castState;return e$&&t?t.includes("CONNECT")?void 0:v.UNAVAILABLE:v.UNSUPPORTED},mediaEvents:["castchange"]},MEDIA_FULLSCREEN_UNAVAILABLE:{get:function(){return eq?void 0:v.UNAVAILABLE}},MEDIA_PIP_UNAVAILABLE:{get:function(){return eH?void 0:v.UNSUPPORTED}},MEDIA_RENDITION_UNAVAILABLE:{get:function(e){var t;let{media:i}=e;return(null==i?void 0:i.videoRenditions)?(null==(t=i.videoRenditions)?void 0:t.length)?void 0:v.UNAVAILABLE:v.UNSUPPORTED},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},MEDIA_AUDIO_TRACK_UNAVAILABLE:{get:function(e){var t,i;let{media:a}=e;return(null==a?void 0:a.audioTracks)?(null!=(i=null==(t=a.audioTracks)?void 0:t.length)?i:0)<=1?v.UNAVAILABLE:void 0:v.UNSUPPORTED},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},MEDIA_VOLUME_UNAVAILABLE:{get:function(e){if(void 0!==r&&!r)return v.UNSUPPORTED;let{media:t}=e;if(t&&void 0===t.volume)return v.UNAVAILABLE},mediaEvents:["loadstart"]},MEDIA_SUBTITLES_LIST:{get:function(e){return eY(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},MEDIA_SUBTITLES_SHOWING:{get:function(e){return!e.hasAttribute("defaultsubtitles")||e.hasAttribute(d.MEDIA_HAS_PLAYED)||e.hasAttribute(d.MEDIA_SUBTITLES_SHOWING)||eU(e,!0),eG(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"]},MEDIA_RENDITION_LIST:{get:function(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.videoRenditions)?t:[]]},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},MEDIA_RENDITION_SELECTED:{get:function(e){var t,i,a;let{media:r}=e;return null==(a=null==(i=null==r?void 0:r.videoRenditions)?void 0:i[null==(t=r.videoRenditions)?void 0:t.selectedIndex])?void 0:a.id},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},MEDIA_AUDIO_TRACK_LIST:{get:function(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.audioTracks)?t:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},MEDIA_AUDIO_TRACK_ENABLED:{get:function(e){var t,i;let{media:a}=e;return null==(i=[...null!=(t=null==a?void 0:a.audioTracks)?t:[]].find(e=>e.enabled))?void 0:i.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]}},eZ={MEDIA_PLAY_REQUEST:(e,t,i)=>{var a;let r=eQ.MEDIA_STREAM_TYPE.get(i),n=null===i.getAttribute("noautoseektolive");r==b.LIVE&&n&&eZ.MEDIA_SEEK_TO_LIVE_REQUEST(e),null==(a=e.play())||a.catch(()=>{})},MEDIA_PAUSE_REQUEST:e=>e.pause(),MEDIA_MUTE_REQUEST:e=>e.muted=!0,MEDIA_UNMUTE_REQUEST:e=>{e.muted=!1,0===e.volume&&(e.volume=.25)},MEDIA_VOLUME_REQUEST:(e,t,i)=>{let a=t.detail;if(e.volume=a,a>0&&e.muted&&(e.muted=!1),!i.hasAttribute("novolumepref"))try{Y.localStorage.setItem("media-chrome-pref-volume",a.toString())}catch(e){}},MEDIA_ENTER_FULLSCREEN_REQUEST:(e,t,i)=>{if(!eq){console.warn("Fullscreen support is unavailable; not entering fullscreen");return}G.pictureInPictureElement&&G.exitPictureInPicture(),i[eB.enter]?i.fullscreenElement[eB.enter]():e.webkitEnterFullscreen?e.webkitEnterFullscreen():e.requestFullscreen?e.requestFullscreen():console.warn("MediaChrome: Fullscreen not supported")},MEDIA_EXIT_FULLSCREEN_REQUEST:()=>{G[eB.exit]()},MEDIA_ENTER_PIP_REQUEST:e=>{if(!G.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!e.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}G[eB.element]&&G[eB.exit]();let t=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};e.requestPictureInPicture().catch(i=>{if(11===i.code){if(0===e.readyState&&"none"===e.preload){let i=()=>{e.removeEventListener("loadedmetadata",a),e.preload="none"},a=()=>{e.requestPictureInPicture().catch(t),i()};e.addEventListener("loadedmetadata",a),e.preload="metadata",setTimeout(()=>{0===e.readyState&&t(),i()},1e3)}else throw i}else throw i})},MEDIA_EXIT_PIP_REQUEST:()=>{G.pictureInPictureElement&&G.exitPictureInPicture()},MEDIA_ENTER_CAST_REQUEST:e=>{var t;(null==(t=Y.CastableVideoElement)?void 0:t.castEnabled)&&(G[eB.element]&&G[eB.exit](),e.requestCast())},MEDIA_EXIT_CAST_REQUEST:async()=>{var e;(null==(e=Y.CastableVideoElement)?void 0:e.castElement)&&Y.CastableVideoElement.exitCast()},MEDIA_SEEK_REQUEST:(e,t)=>{let i=t.detail;(e.readyState>0||void 0===e.readyState)&&(e.currentTime=i)},MEDIA_PLAYBACK_RATE_REQUEST:(e,t)=>{e.playbackRate=t.detail},MEDIA_PREVIEW_REQUEST:(e,t,i)=>{var a;if(!e)return;let r=t.detail;null===r&&i.propagateMediaState(d.MEDIA_PREVIEW_TIME,void 0),i.propagateMediaState(d.MEDIA_PREVIEW_TIME,r);let[n]=eN(e,{kind:h.METADATA,label:"thumbnails"});if(!(n&&n.cues))return;if(null===r){i.propagateMediaState(d.MEDIA_PREVIEW_IMAGE,void 0),i.propagateMediaState(d.MEDIA_PREVIEW_COORDS,void 0);return}let s=Array.prototype.find.call(n.cues,e=>e.startTime>=r);if(!s)return;let o=/'^(?:[a-z]+:)?\/\//i.test(s.text)?void 0:null==(a=e.querySelector('track[label="thumbnails"]'))?void 0:a.src,l=new URL(s.text,o),u=new URLSearchParams(l.hash).get("#xywh");i.propagateMediaState(d.MEDIA_PREVIEW_IMAGE,l.href),i.propagateMediaState(d.MEDIA_PREVIEW_COORDS,u.split(","))},MEDIA_SHOW_SUBTITLES_REQUEST:(e,t,i)=>{let a=eY(i),{detail:r=[]}=t;ex(m.SHOWING,a,r)},MEDIA_DISABLE_SUBTITLES_REQUEST:(e,t,i)=>{let a=eY(i),{detail:r=[]}=t;ex(m.DISABLED,a,r)},MEDIA_AIRPLAY_REQUEST:e=>{if(e){if(!(e.webkitShowPlaybackTargetPicker&&Y.WebKitPlaybackTargetAvailabilityEvent)){console.warn("received a request to select AirPlay but AirPlay is not supported in this environment");return}e.webkitShowPlaybackTargetPicker()}},MEDIA_SEEK_TO_LIVE_REQUEST:e=>{let t=e.seekable;if(!t){console.warn("MediaController: Media element does not support seeking to live.");return}if(!t.length){console.warn("MediaController: Media is unable to seek to live.");return}e.currentTime=t.end(t.length-1)},MEDIA_RENDITION_REQUEST:(e,t)=>{if(!(null==e?void 0:e.videoRenditions)){console.warn("MediaController: Rendition selection not supported by this media.");return}let i=t.detail,a=[...e.videoRenditions].findIndex(e=>e.id==i);e.videoRenditions.selectedIndex!=a&&(e.videoRenditions.selectedIndex=a)},MEDIA_AUDIO_TRACK_REQUEST:(e,t)=>{if(!(null==e?void 0:e.audioTracks)){console.warn("MediaController: Audio track selection not supported by this media.");return}let i=t.detail;for(let t of e.audioTracks)t.enabled=i==t.id}};var ez=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},eX=(e,t,i)=>(ez(e,t,"read from private field"),i?i.call(e):t.get(e)),eJ=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},e0=(e,t,i,a)=>(ez(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),e1=(e,t,i)=>(ez(e,t,"access private method"),i);let e2=["ArrowLeft","ArrowRight","Enter"," ","f","m","k","c"],e5={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYS_USED:"keysused",NO_HOTKEYS:"nohotkeys"};class e3 extends e_{constructor(){super(),eJ(this,rk),eJ(this,rI),eJ(this,rA,new ew(this,e5.HOTKEYS)),eJ(this,rT,void 0),void 0===eQ.MEDIA_VOLUME_UNAVAILABLE.get(this)&&ej.then(()=>{this.propagateMediaState(d.MEDIA_VOLUME_UNAVAILABLE,eQ.MEDIA_VOLUME_UNAVAILABLE.get(this))}),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,this.associateElement(this),Object.keys(eZ).forEach(e=>{let t=`_handle${T(e,!0)}`;this[t]=t=>{if(t.stopPropagation(),!this.media){console.warn("MediaController: No media available.");return}eZ[e](this.media,t,this)},this.addEventListener(n[e],this[t])}),this._mediaStatePropagators={},Object.keys(eQ).forEach(e=>{this._mediaStatePropagators[e]=t=>{this.propagateMediaState(o[e],eQ[e].get(this,t))}}),this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(e5.NO_HOTKEYS,e5.HOTKEYS,e5.DEFAULT_STREAM_TYPE,e5.DEFAULT_SUBTITLES)}get fullscreenElement(){var e;return null!=(e=eX(this,rT))?e:this}set fullscreenElement(e){this.hasAttribute(e5.FULLSCREEN_ELEMENT)&&this.removeAttribute(e5.FULLSCREEN_ELEMENT),e0(this,rT,e)}attributeChangedCallback(e,t,i){var a;if(e===e5.NO_HOTKEYS)i!==t&&""===i?(this.hasAttribute(e5.HOTKEYS)&&console.warn("Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):i!==t&&null===i&&this.enableHotkeys();else if(e===e5.HOTKEYS)eX(this,rA).value=i;else if(e===e5.DEFAULT_SUBTITLES&&i!==t&&""===i)eU(this,!0);else if(e===e5.DEFAULT_STREAM_TYPE)this.propagateMediaState(o.MEDIA_STREAM_TYPE);else if(e===e5.FULLSCREEN_ELEMENT){let e=i?null==(a=this.getRootNode())?void 0:a.getElementById(i):void 0;e0(this,rT,e)}super.attributeChangedCallback(e,t,i)}mediaSetCallback(e){if(super.mediaSetCallback(e),e.hasAttribute("tabindex")||(e.tabIndex=-1),Object.keys(eQ).forEach(t=>{let{mediaEvents:i,rootEvents:a,textTracksEvents:r,videoRenditionsEvents:n,audioTracksEvents:s}=eQ[t],o=this._mediaStatePropagators[t];null==i||i.forEach(t=>{e.addEventListener(t,o),o()}),null==a||a.forEach(e=>{this.getRootNode().addEventListener(e,o),o()}),null==r||r.forEach(t=>{var i;null==(i=e.textTracks)||i.addEventListener(t,o),o()}),null==n||n.forEach(t=>{var i;null==(i=e.videoRenditions)||i.addEventListener(t,o),o()}),null==s||s.forEach(t=>{var i;null==(i=e.audioTracks)||i.addEventListener(t,o),o()})}),!this.hasAttribute("novolumepref"))try{let t=Y.localStorage.getItem("media-chrome-pref-volume");null!==t&&(e.volume=t)}catch(e){console.debug("Error getting volume pref",e)}}mediaUnsetCallback(e){super.mediaUnsetCallback(e),Object.keys(eQ).forEach(t=>{let{mediaEvents:i,rootEvents:a,textTracksEvents:r,videoRenditionsEvents:n,audioTracksEvents:s}=eQ[t],o=this._mediaStatePropagators[t];null==i||i.forEach(t=>{e.removeEventListener(t,o)}),null==a||a.forEach(e=>{this.getRootNode().removeEventListener(e,o)}),null==r||r.forEach(t=>{var i;null==(i=e.textTracks)||i.removeEventListener(t,o)}),null==n||n.forEach(t=>{var i;null==(i=e.videoRenditions)||i.removeEventListener(t,o),o()}),null==s||s.forEach(t=>{var i;null==(i=e.audioTracks)||i.removeEventListener(t,o),o()})}),this.propagateMediaState(o.MEDIA_PAUSED,!0)}propagateMediaState(e,t){let i=ts(this.mediaStateReceivers,e);if(tn(this.mediaStateReceivers,e,t),i===ts(this.mediaStateReceivers,e))return;let a=e.toLowerCase(),r=new Y.CustomEvent(c[a],{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(r)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(t.has(e))return;let i=this.registerMediaStateReceiver.bind(this),a=this.unregisterMediaStateReceiver.bind(this),r=to(e,i,a);Object.keys(n).forEach(t=>{e.addEventListener(n[t],this[`_handle${T(t,!0)}`])}),t.set(e,r)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(!t.has(e))return;let i=t.get(e);i(),t.delete(e),Object.keys(n).forEach(t=>{e.removeEventListener(n[t],this[`_handle${T(t,!0)}`])})}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers,i=t.indexOf(e);i>-1||(t.push(e),Object.keys(eQ).forEach(t=>{let i=eQ[t];tn([e],o[t],i.get(this))}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,i=t.indexOf(e);i<0||t.splice(i,1)}enableHotkeys(){this.addEventListener("keydown",e1(this,rI,rS))}disableHotkeys(){this.removeEventListener("keydown",e1(this,rI,rS)),this.removeEventListener("keyup",e1(this,rk,rw))}get hotkeys(){return eX(this,rA)}keyboardShortcutHandler(e){var t,i,a,r;let s,o,l,u;let c=(null!=(r=null!=(a=null==(t=e.target.getAttribute(e5.KEYS_USED))?void 0:t.split(" "))?a:null==(i=e.target)?void 0:i.keysUsed)?r:[]).map(e=>"Space"===e?" ":e).filter(Boolean);if(!c.includes(e.key)&&!eX(this,rA).contains(`no${e.key.toLowerCase()}`)&&!(" "===e.key&&eX(this,rA).contains("nospace")))switch(e.key){case" ":case"k":s=null!=this.getAttribute(d.MEDIA_PAUSED)?n.MEDIA_PLAY_REQUEST:n.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new Y.CustomEvent(s,{composed:!0,bubbles:!0}));break;case"m":s="off"===this.getAttribute(d.MEDIA_VOLUME_LEVEL)?n.MEDIA_UNMUTE_REQUEST:n.MEDIA_MUTE_REQUEST,this.dispatchEvent(new Y.CustomEvent(s,{composed:!0,bubbles:!0}));break;case"f":s=null!=this.getAttribute(d.MEDIA_IS_FULLSCREEN)?n.MEDIA_EXIT_FULLSCREEN_REQUEST:n.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new Y.CustomEvent(s,{composed:!0,bubbles:!0}));break;case"c":eU(this);break;case"ArrowLeft":l=Math.max(((o=this.getAttribute(d.MEDIA_CURRENT_TIME))&&!Number.isNaN(+o)?+o:0)-10,0),u=new Y.CustomEvent(n.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:l}),this.dispatchEvent(u);break;case"ArrowRight":l=Math.max(((o=this.getAttribute(d.MEDIA_CURRENT_TIME))&&!Number.isNaN(+o)?+o:0)+10,0),u=new Y.CustomEvent(n.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:l}),this.dispatchEvent(u)}}}rA=new WeakMap,rT=new WeakMap,rk=new WeakSet,rw=function(e){let{key:t}=e;if(!e2.includes(t)){this.removeEventListener("keyup",e1(this,rk,rw));return}this.keyboardShortcutHandler(e)},rI=new WeakSet,rS=function(e){let{metaKey:t,altKey:i,key:a}=e;if(t||i||!e2.includes(a)){this.removeEventListener("keyup",e1(this,rk,rw));return}[" ","ArrowLeft","ArrowRight"].includes(a)&&!(eX(this,rA).contains(`no${a.toLowerCase()}`)||" "===a&&eX(this,rA).contains("nospace"))&&e.preventDefault(),this.addEventListener("keyup",e1(this,rk,rw),{once:!0})};let e4=Object.values(d),e7=Object.values(o),e8=e=>{var t,i,a,r;let{observedAttributes:n}=e.constructor;!n&&(null==(t=e.nodeName)?void 0:t.includes("-"))&&(Y.customElements.upgrade(e),{observedAttributes:n}=e.constructor);let o=null==(r=null==(a=null==(i=null==e?void 0:e.getAttribute)?void 0:i.call(e,s.MEDIA_CHROME_ATTRIBUTES))?void 0:a.split)?void 0:r.call(a,/\s+/);return Array.isArray(n||o)?(n||o).filter(e=>e4.includes(e)):[]},e6=e=>{var t,i;return(null==(t=e.nodeName)?void 0:t.includes("-"))&&Y.customElements.get(null==(i=e.nodeName)?void 0:i.toLowerCase())&&!(e instanceof Y.customElements.get(e.nodeName.toLowerCase()))&&Y.customElements.upgrade(e),e7.some(t=>t in e)},e9=e=>e6(e)||!!e8(e).length,te=e=>{var t;return null==(t=null==e?void 0:e.join)?void 0:t.call(e,":")},tt={[d.MEDIA_SUBTITLES_LIST]:eM,[d.MEDIA_SUBTITLES_SHOWING]:eM,[d.MEDIA_SEEKABLE]:te,[d.MEDIA_BUFFERED]:e=>null==e?void 0:e.map(te).join(" "),[d.MEDIA_PREVIEW_COORDS]:e=>null==e?void 0:e.join(" "),[d.MEDIA_RENDITION_LIST]:function(e){return null==e?void 0:e.map(g).join(" ")},[d.MEDIA_AUDIO_TRACK_LIST]:function(e){return null==e?void 0:e.map(y).join(" ")}},ti=async(e,t,i)=>{var a,r;if(e.isConnected||await w(0),"boolean"==typeof i||null==i)return W(e,t,i);if("number"==typeof i)return U(e,t,i);if("string"==typeof i)return q(e,t,i);if(Array.isArray(i)&&!i.length)return e.removeAttribute(t);let n=null!=(r=null==(a=tt[t])?void 0:a.call(tt,i))?r:i;return e.setAttribute(t,n)},ta=e=>{var t;return!!(null==(t=e.closest)?void 0:t.call(e,'*[slot="media"]'))},tr=(e,t)=>{if(ta(e))return;let i=(e,t)=>{var i,a;e9(e)&&t(e);let{children:r=[]}=null!=e?e:{},n=null!=(a=null==(i=null==e?void 0:e.shadowRoot)?void 0:i.children)?a:[],s=[...r,...n];s.forEach(e=>tr(e,t))},a=null==e?void 0:e.nodeName.toLowerCase();if(a.includes("-")&&!e9(e)){Y.customElements.whenDefined(a).then(()=>{i(e,t)});return}i(e,t)},tn=(e,t,i)=>{e.forEach(e=>{if(t in e){e[t]=i;return}let a=e8(e),r=t.toLowerCase();a.includes(r)&&ti(e,r,i)})},ts=(e,t)=>{for(let i of e){if(t in i)return i[t];let e=e8(i),a=t.toLowerCase();if(e.includes(a))return i.getAttribute(a)}},to=(e,t,i)=>{tr(e,t);let a=e=>{var i;let a=null!=(i=null==e?void 0:e.composedPath()[0])?i:e.target;t(a)},r=e=>{var t;let a=null!=(t=null==e?void 0:e.composedPath()[0])?t:e.target;i(a)};e.addEventListener(n.REGISTER_MEDIA_STATE_RECEIVER,a),e.addEventListener(n.UNREGISTER_MEDIA_STATE_RECEIVER,r);let o=[],l=e=>{let a=e.target;"media"!==a.name&&(o.forEach(e=>tr(e,i)),(o=[...a.assignedElements({flatten:!0})]).forEach(e=>tr(e,t)))};e.addEventListener("slotchange",l);let d=new MutationObserver(e=>{e.forEach(e=>{let{addedNodes:a=[],removedNodes:r=[],type:n,target:o,attributeName:l}=e;"childList"===n?(Array.prototype.forEach.call(a,e=>tr(e,t)),Array.prototype.forEach.call(r,e=>tr(e,i))):"attributes"===n&&l===s.MEDIA_CHROME_ATTRIBUTES&&(e9(o)?t(o):i(o))})});return d.observe(e,{childList:!0,attributes:!0,subtree:!0}),()=>{tr(e,i),e.removeEventListener("slotchange",l),d.disconnect(),e.removeEventListener(n.REGISTER_MEDIA_STATE_RECEIVER,a),e.removeEventListener(n.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};Y.customElements.get("media-controller")||Y.customElements.define("media-controller",e3);var tl=Object.defineProperty,td=(e,t,i)=>t in e?tl(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,tu=(e,t,i)=>(td(e,"symbol"!=typeof t?t+"":t,i),i),tc=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},th=(e,t,i)=>(tc(e,t,"read from private field"),i?i.call(e):t.get(e)),tm=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},tp=(e,t,i,a)=>(tc(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let tv=G.createElement("template"),tb=`
  height: var(--thumb-height);
  width: var(--media-range-thumb-width, 10px);
  border: var(--media-range-thumb-border, none);
  border-radius: var(--media-range-thumb-border-radius, 10px);
  background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
  box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
  cursor: pointer;
  transition: var(--media-range-thumb-transition, none);
  transform: var(--media-range-thumb-transform, none);
  opacity: var(--media-range-thumb-opacity, 1);
`,tE=`
  min-width: 40px;
  height: var(--track-height);
  border: var(--media-range-track-border, none);
  outline: var(--media-range-track-outline);
  outline-offset: var(--media-range-track-outline-offset);
  border-radius: var(--media-range-track-border-radius, 1px);
  background: var(--media-range-track-progress-internal, var(--media-range-track-background, rgb(255 255 255 / .2)));
  backdrop-filter: var(--media-range-track-backdrop-filter);
  box-shadow: var(--media-range-track-box-shadow, none);
  transition: var(--media-range-track-transition, none);
  transform: translate(var(--media-range-track-translate-x, 0), var(--media-range-track-translate-y, 0));
  cursor: pointer;
`;tv.innerHTML=`
  <style>
    :host {
      --thumb-height: var(--media-range-thumb-height, 10px);
      --track-height: var(--media-range-track-height, 4px);
      --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
      --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

      vertical-align: middle;
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
      transition: background .15s linear;
      width: 100px;
      height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
      padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      pointer-events: auto;
      
      font-size: 0;
      box-shadow: var(--_focus-visible-box-shadow, none);
    }

    
    input[type=range]:focus {
      outline: 0;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      outline: 0;
    }

    :host(:hover) {
      background: var(--media-control-hover-background, rgb(50 50 70 / .7));
    }

    #container {
      position: relative;
      height: 100%;
    }

    input[type=range] {
      
      -webkit-appearance: none; 
      background: transparent; 

      
      min-height: 100%;
      width: var(--media-range-track-width, 100%); 

      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      ${tb}
      
      margin-top: calc(calc(0px - var(--thumb-height) + var(--track-height)) / 2);
    }

    
    input[type=range]::-moz-range-thumb {
      ${tb}
      translate: var(--media-range-track-translate-x, 0) var(--media-range-track-translate-y, 0);
    }

    input[type=range]::-webkit-slider-runnable-track { ${tE} }
    input[type=range]::-moz-range-track { ${tE} }
    input[type=range]::-ms-track {
      
      width: 100%;
      cursor: pointer;
      
      background: transparent;
      border-color: transparent;
      color: transparent;

      ${tE}
    }

    #background,
    #pointer {
      width: var(--media-range-track-width, 100%);
      height: var(--track-height);
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      top: 50%;
      transform: translate(var(--media-range-track-translate-x, 0px), calc(var(--media-range-track-translate-y, 0px) - 50%));
    }

    #background {
      min-width: 40px;
      background: var(--media-range-track-background, rgb(255 255 255 / .2));
      backdrop-filter: var(--media-range-track-background-backdrop-filter);
    }

    #pointer {
      background: var(--media-range-track-pointer-background);
      border-right: var(--media-range-track-pointer-border-right);
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
    }

    :host(:hover) #pointer {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    #hoverzone {
      
      z-index: 1;
      display: var(--media-time-range-hover-display, none);
      position: absolute;
      width: 100%;
      bottom: var(--media-time-range-hover-bottom, -5px);
      height: var(--media-time-range-hover-height, max(calc(100% + 5px), 20px));
    }

    #range {
      z-index: 2;
      position: relative;
      height: var(--media-range-track-height, 4px);
    }

    input[type=range]:disabled::-webkit-slider-thumb {
      background-color: #777;
    }

    input[type=range]:disabled::-webkit-slider-runnable-track {
      background-color: #777;
    }
  </style>
  <div id="container">
    <div id="background"></div>
    <div id="pointer"></div>
    <div id="hoverzone"></div>
    <input id="range" type="range" min="0" max="1000" step="any" value="0">
  </div>
`;class tf extends Y.HTMLElement{constructor(){super(),tu(this,"thumbWidth"),tm(this,rL,void 0),tm(this,rD,()=>{if(this.range.matches(":focus-visible")){let{style:e}=N(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),tm(this,rR,()=>{let{style:e}=N(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(tv.content.cloneNode(!0)));let{style:e}=N(this.shadowRoot,":host");e.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-block))`),this.container=this.shadowRoot.querySelector("#container"),this.range=this.shadowRoot.querySelector("#range"),this.range.addEventListener("input",this.updateBar.bind(this)),this.thumbWidth=parseInt(getComputedStyle(this).getPropertyValue("--media-range-thumb-width")||"10",10)}static get observedAttributes(){return["disabled","aria-disabled",s.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=th(this,rL))?void 0:a.unassociateElement)||r.call(a,this),tp(this,rL,null)),i&&(tp(this,rL,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=th(this,rL))?void 0:o.associateElement)||l.call(o,this))):("disabled"===e||"aria-disabled"===e&&t!==i)&&(null==i?this.range.removeAttribute(e):this.range.setAttribute(e,i))}connectedCallback(){var e,t,i;let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(tp(this,rL,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=th(this,rL))?void 0:t.associateElement)||i.call(t,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",th(this,rD)),this.shadowRoot.addEventListener("focusout",th(this,rR))}disconnectedCallback(){var e,t;null==(t=null==(e=th(this,rL))?void 0:e.unassociateElement)||t.call(e,this),tp(this,rL,null),this.shadowRoot.removeEventListener("focusin",th(this,rD)),this.shadowRoot.removeEventListener("focusout",th(this,rR))}updatePointerBar(e){let t=this.range.getBoundingClientRect(),i=(e.clientX-t.left)/t.width;i=Math.max(0,Math.min(1,i));let{style:a}=N(this.shadowRoot,"#pointer");a.setProperty("width",`${i*t.width}px`)}updateBar(){let e=this.getBarColors(),t="linear-gradient(to right, ",i=0;e.forEach(e=>{e[1]<i||(t+=`${e[0]} ${i}%, ${e[0]} ${e[1]}%,`,i=e[1])}),t=t.slice(0,t.length-1)+")";let{style:a}=N(this.shadowRoot,"#range");a.setProperty("--media-range-track-progress-internal",t)}getRelativeValues(){let{range:e}=this;return{relativeValue:e.value-e.min,relativeMax:e.max-e.min}}getBarColors(){let e=this.range,{relativeValue:t,relativeMax:i}=this.getRelativeValues(),a=t/i*100,r=0;if(t&&t<i){let t=this.thumbWidth*(.5-a/100);r=t/e.offsetWidth*100}return[["var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)))",a+r],["var(--media-range-track-color, transparent)",100]]}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}rL=new WeakMap,rD=new WeakMap,rR=new WeakMap,Y.customElements.get("media-chrome-range")||Y.customElements.define("media-chrome-range",tf);var tg=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},t_=(e,t,i)=>(tg(e,t,"read from private field"),i?i.call(e):t.get(e)),ty=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},tA=(e,t,i,a)=>(tg(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let tT=G.createElement("template");tT.innerHTML=`
  <style>
    :host {
      
      box-sizing: border-box;
      display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      --media-loading-indicator-icon-height: 44px;
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-clip-selector),
    media-volume-range,
    ::slotted(media-volume-range) {
      height: var(--_range-auto-size, calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding)));
    }
  </style>

  <slot></slot>
`;class tk extends Y.HTMLElement{constructor(){super(),ty(this,rM,void 0),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(tT.content.cloneNode(!0))),this.shadowRoot.querySelector("slot").addEventListener("slotchange",({target:e})=>{let t=e.assignedElements({flatten:!0}).every(e=>["media-time-range","media-volume-range"].includes(e.nodeName.toLowerCase())),{style:i}=N(this.shadowRoot,":host");i.setProperty("--_range-auto-size",t?"unset":"initial")})}static get observedAttributes(){return[s.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=t_(this,rM))?void 0:a.unassociateElement)||r.call(a,this),tA(this,rM,null)),i&&(tA(this,rM,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=t_(this,rM))?void 0:o.associateElement)||l.call(o,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(tA(this,rM,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=t_(this,rM))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=t_(this,rM))?void 0:e.unassociateElement)||t.call(e,this),tA(this,rM,null)}}rM=new WeakMap,Y.customElements.get("media-control-bar")||Y.customElements.define("media-control-bar",tk);var tw=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},tI=(e,t,i)=>(tw(e,t,"read from private field"),i?i.call(e):t.get(e)),tS=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},tL=(e,t,i,a)=>(tw(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let tD=G.createElement("template");tD.innerHTML=`
  <style>
    :host {
      font: var(--media-font,
        var(--media-font-weight, normal)
        var(--media-font-size, 14px) /
        var(--media-text-content-height, var(--media-control-height, 24px))
        var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
      color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
      background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
      padding: var(--media-control-padding, 10px);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      box-sizing: border-box;
      text-align: center;
      pointer-events: auto;
    }

    
    :host(:focus-visible) {
      box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
      outline: 0;
    }

    
    :host(:where(:focus)) {
      box-shadow: none;
      outline: 0;
    }
  </style>
  <slot></slot>
`;class tR extends Y.HTMLElement{constructor(){super(),tS(this,rC,void 0),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(tD.content.cloneNode(!0)));let{style:e}=N(this.shadowRoot,":host");e.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`)}static get observedAttributes(){return[s.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=tI(this,rC))?void 0:a.unassociateElement)||r.call(a,this),tL(this,rC,null)),i&&(tL(this,rC,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=tI(this,rC))?void 0:o.associateElement)||l.call(o,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(tL(this,rC,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=tI(this,rC))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=tI(this,rC))?void 0:e.unassociateElement)||t.call(e,this),tL(this,rC,null)}}rC=new WeakMap,Y.customElements.get("media-text-display")||Y.customElements.define("media-text-display",tR);var tM=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},tC=(e,t,i)=>(tM(e,t,"read from private field"),i?i.call(e):t.get(e)),tO=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},tx=(e,t,i,a)=>(tM(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);rO=new WeakMap,Y.customElements.get("media-duration-display")||Y.customElements.define("media-duration-display",class extends tR{constructor(){super(),tO(this,rO,void 0),tx(this,rO,this.shadowRoot.querySelector("slot")),tC(this,rO).textContent=D(0)}static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_DURATION]}attributeChangedCallback(e,t,i){e===d.MEDIA_DURATION&&(tC(this,rO).textContent=D(i)),super.attributeChangedCallback(e,t,i)}get mediaDuration(){return P(this,d.MEDIA_DURATION)}set mediaDuration(e){U(this,d.MEDIA_DURATION,e)}});var tN=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},tP=(e,t,i)=>(tN(e,t,"read from private field"),i?i.call(e):t.get(e)),tU=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},tB=(e,t,i,a)=>(tN(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let tW={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},tV=[...Object.values(tW),d.MEDIA_CURRENT_TIME,d.MEDIA_DURATION,d.MEDIA_SEEKABLE],tq=["Enter"," "],tH="&nbsp;/&nbsp;",tF=(e,{timesSep:t=tH}={})=>{var i,a,r,n;let s=e.hasAttribute(tW.REMAINING),o=e.hasAttribute(tW.SHOW_DURATION),l=null!=(i=e.mediaCurrentTime)?i:0,[,d]=null!=(a=e.mediaSeekable)?a:[],u=null!=(n=null!=(r=e.mediaDuration)?r:d)?n:0,c=s?D(0-(u-l)):D(l);return o?`${c}${t}${D(u)}`:c},t$=e=>{var t;let i=e.mediaCurrentTime,[,a]=null!=(t=e.mediaSeekable)?t:[],r=e.mediaDuration||a;if(null==i||null==r){e.setAttribute("aria-valuetext","video not loaded, unknown time.");return}let n=e.hasAttribute(tW.REMAINING),s=e.hasAttribute(tW.SHOW_DURATION),o=n?L(0-(r-i)):L(i);if(!s){e.setAttribute("aria-valuetext",o);return}let l=L(r),d=`${o} of ${l}`;e.setAttribute("aria-valuetext",d)};rx=new WeakMap,Y.customElements.get("media-time-display")||Y.customElements.define("media-time-display",class extends tR{constructor(){super(),tU(this,rx,void 0),tB(this,rx,this.shadowRoot.querySelector("slot")),tP(this,rx).innerHTML=`${tF(this)}`;let{style:e}=N(this.shadowRoot,":host:not([notoggle])");e.setProperty("cursor","pointer");let{style:t}=N(this.shadowRoot,":host(:hover:not([notoggle]))");t.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))")}static get observedAttributes(){return[...super.observedAttributes,...tV,"disabled"]}connectedCallback(){this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",E.PLAYBACK_TIME());let e=t=>{let{key:i}=t;if(!tq.includes(i)){this.removeEventListener("keyup",e);return}this.toggleTimeDisplay()};this.addEventListener("keydown",t=>{let{metaKey:i,altKey:a,key:r}=t;if(i||a||!tq.includes(r)){this.removeEventListener("keyup",e);return}this.addEventListener("keyup",e)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,t,i){tV.includes(e)?this.update():"disabled"===e&&i!==t&&(null==i?this.enable():this.disable()),super.attributeChangedCallback(e,t,i)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return B(this,tW.REMAINING)}set remaining(e){W(this,tW.REMAINING,e)}get showDuration(){return B(this,tW.SHOW_DURATION)}set showDuration(e){W(this,tW.SHOW_DURATION,e)}get noToggle(){return B(this,tW.NO_TOGGLE)}set noToggle(e){W(this,tW.NO_TOGGLE,e)}get mediaDuration(){return P(this,d.MEDIA_DURATION)}set mediaDuration(e){U(this,d.MEDIA_DURATION,e)}get mediaCurrentTime(){return P(this,d.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){U(this,d.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(d.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){if(null==e){this.removeAttribute(d.MEDIA_SEEKABLE);return}this.setAttribute(d.MEDIA_SEEKABLE,e.join(":"))}update(){let e=tF(this);t$(this),e!==tP(this,rx).innerHTML&&(tP(this,rx).innerHTML=e)}});let tj=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,tK=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,tY=G.createElement("template");tY.innerHTML=`
  <style>
    :host([aria-checked="true"]) slot[name=off] {
      display: none !important;
    }

    
    :host(:not([aria-checked="true"])) slot[name=on] {
      display: none !important;
    }
  </style>

  <slot name="icon">
    <slot name="on">${tj}</slot>
    <slot name="off">${tK}</slot>
  </slot>
`;let tG=e=>{e.setAttribute("aria-checked",eP(e))},tQ=(e,t)=>{let i=e.getAttribute(t);return i?eL(i):[]},tZ=(e,t,i)=>{if(!(null==i?void 0:i.length)){e.removeAttribute(t);return}let a=eM(i),r=e.getAttribute(t);r!==a&&e.setAttribute(t,a)};Y.customElements.get("media-captions-button")||Y.customElements.define("media-captions-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_SUBTITLES_LIST,d.MEDIA_SUBTITLES_SHOWING]}constructor(e={}){super({slotTemplate:tY,...e}),this._captionsReady=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",E.CLOSED_CAPTIONS()),tG(this)}attributeChangedCallback(e,t,i){e===d.MEDIA_SUBTITLES_SHOWING&&tG(this),super.attributeChangedCallback(e,t,i)}get mediaSubtitlesList(){return tQ(this,d.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){tZ(this,d.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return tQ(this,d.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){tZ(this,d.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){eU(this)}});let tz={SEEK_OFFSET:"seekoffset"},tX=G.createElement("template");tX.innerHTML=`
  <slot name="icon"><svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(8.9 19.87)">30</text><path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/></svg></slot>
`,Y.customElements.get("media-seek-forward-button")||Y.customElements.define("media-seek-forward-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_CURRENT_TIME,tz.SEEK_OFFSET]}constructor(e={}){super({slotTemplate:tX,...e})}connectedCallback(){this.seekOffset=P(this,tz.SEEK_OFFSET,30),super.connectedCallback()}attributeChangedCallback(e,t,i){e===tz.SEEK_OFFSET&&(this.seekOffset=P(this,tz.SEEK_OFFSET,30)),super.attributeChangedCallback(e,t,i)}get seekOffset(){return P(this,tz.SEEK_OFFSET,30)}set seekOffset(e){U(this,tz.SEEK_OFFSET,e),this.setAttribute("aria-label",f.SEEK_FORWARD_N_SECS({seekOffset:this.seekOffset})),R(C(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return P(this,d.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){U(this,d.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,t=new Y.CustomEvent(n.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}});let tJ=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,t0=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`,t1=G.createElement("template");t1.innerHTML=`
  <style>
  :host([${d.MEDIA_IS_FULLSCREEN}]) slot:not([name=exit]):not([name=icon]) {
    display: none !important;
  }

  
  :host(:not([${d.MEDIA_IS_FULLSCREEN}])) slot:not([name=enter]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="enter">${tJ}</slot>
    <slot name="exit">${t0}</slot>
  </slot>
`;let t2=e=>{let t=e.mediaIsFullscreen?f.EXIT_FULLSCREEN():f.ENTER_FULLSCREEN();e.setAttribute("aria-label",t)};Y.customElements.get("media-fullscreen-button")||Y.customElements.define("media-fullscreen-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_IS_FULLSCREEN,d.MEDIA_FULLSCREEN_UNAVAILABLE]}constructor(e={}){super({slotTemplate:t1,...e})}connectedCallback(){t2(this),super.connectedCallback()}attributeChangedCallback(e,t,i){e===d.MEDIA_IS_FULLSCREEN&&t2(this),super.attributeChangedCallback(e,t,i)}get mediaFullscreenUnavailable(){return V(this,d.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){q(this,d.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return B(this,d.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){W(this,d.MEDIA_IS_FULLSCREEN,e)}handleClick(){let e=this.mediaIsFullscreen?n.MEDIA_EXIT_FULLSCREEN_REQUEST:n.MEDIA_ENTER_FULLSCREEN_REQUEST;this.dispatchEvent(new Y.CustomEvent(e,{composed:!0,bubbles:!0}))}});let{MEDIA_TIME_IS_LIVE:t5,MEDIA_PAUSED:t3}=d,{MEDIA_SEEK_TO_LIVE_REQUEST:t4,MEDIA_PLAY_REQUEST:t7}=n,t8=G.createElement("template");t8.innerHTML=`
  <style>

  slot[name=indicator] > *,
  :host ::slotted([slot=indicator]) {
    
    min-width: auto;
    fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
    color: var(--media-live-button-icon-color, rgb(140, 140, 140));
  }

  :host([${t5}]:not([${t3}])) slot[name=indicator] > *,
  :host([${t5}]:not([${t3}])) ::slotted([slot=indicator]) {
    fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
    color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
  }

  :host([${t5}]:not([${t3}])) {
    cursor: not-allowed;
  }

  </style>

  <slot name="indicator"><svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg></slot>
  
  <slot name="spacer">&nbsp;</slot><slot name="text">LIVE</slot>
`;let t6=e=>{let t=e.mediaPaused||!e.mediaTimeIsLive,i=t?f.SEEK_LIVE():f.PLAYING_LIVE();e.setAttribute("aria-label",i),t?e.removeAttribute("aria-disabled"):e.setAttribute("aria-disabled","true")};Y.customElements.get("media-live-button")||Y.customElements.define("media-live-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,t3,t5]}constructor(e={}){super({slotTemplate:t8,...e})}connectedCallback(){t6(this),super.connectedCallback()}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),t6(this)}get mediaPaused(){return B(this,d.MEDIA_PAUSED)}set mediaPaused(e){W(this,d.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return B(this,d.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){W(this,d.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new Y.CustomEvent(t4,{composed:!0,bubbles:!0})),this.hasAttribute(t3)&&this.dispatchEvent(new Y.CustomEvent(t7,{composed:!0,bubbles:!0})))}});let{MEDIA_VOLUME_LEVEL:t9}=d,ie=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,it=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,ii=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`,ia=G.createElement("template");ia.innerHTML=`
  <style>
  
  :host(:not([${t9}])) slot:not([name=high]):not([name=icon]), 
  :host([${t9}=high]) slot:not([name=high]):not([name=icon]) {
    display: none !important;
  }

  :host([${t9}=off]) slot:not([name=off]):not([name=icon]) {
    display: none !important;
  }

  :host([${t9}=low]) slot:not([name=low]):not([name=icon]) {
    display: none !important;
  }

  :host([${t9}=medium]) slot:not([name=medium]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="off">${ie}</slot>
    <slot name="low">${it}</slot>
    <slot name="medium">${it}</slot>
    <slot name="high">${ii}</slot>
  </slot>
`;let ir=e=>{let t="off"===e.mediaVolumeLevel,i=t?f.UNMUTE():f.MUTE();e.setAttribute("aria-label",i)};Y.customElements.get("media-mute-button")||Y.customElements.define("media-mute-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_VOLUME_LEVEL]}constructor(e={}){super({slotTemplate:ia,...e})}connectedCallback(){ir(this),super.connectedCallback()}attributeChangedCallback(e,t,i){e===d.MEDIA_VOLUME_LEVEL&&ir(this),super.attributeChangedCallback(e,t,i)}get mediaVolumeLevel(){return V(this,d.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){q(this,d.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e="off"===this.mediaVolumeLevel?n.MEDIA_UNMUTE_REQUEST:n.MEDIA_MUTE_REQUEST;this.dispatchEvent(new Y.CustomEvent(e,{composed:!0,bubbles:!0}))}});let is=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`,io=G.createElement("template");io.innerHTML=`
  <style>
  :host([${d.MEDIA_IS_PIP}]) slot:not([name=exit]):not([name=icon]) {
    display: none !important;
  }

  
  :host(:not([${d.MEDIA_IS_PIP}])) slot:not([name=enter]):not([name=icon]) {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="enter">${is}</slot>
    <slot name="exit">${is}</slot>
  </slot>
`;let il=e=>{let t=e.mediaIsPip?f.EXIT_PIP():f.ENTER_PIP();e.setAttribute("aria-label",t)};Y.customElements.get("media-pip-button")||Y.customElements.define("media-pip-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_IS_PIP,d.MEDIA_PIP_UNAVAILABLE]}constructor(e={}){super({slotTemplate:io,...e})}connectedCallback(){il(this),super.connectedCallback()}attributeChangedCallback(e,t,i){e===d.MEDIA_IS_PIP&&il(this),super.attributeChangedCallback(e,t,i)}get mediaPipUnavailable(){return V(this,d.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){q(this,d.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return B(this,d.MEDIA_IS_PIP)}set mediaIsPip(e){W(this,d.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?n.MEDIA_EXIT_PIP_REQUEST:n.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new Y.CustomEvent(e,{composed:!0,bubbles:!0}))}});let id=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,iu=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`,ic=G.createElement("template");ic.innerHTML=`
  <style>
  :host([${d.MEDIA_PAUSED}]) slot[name=pause] {
    display: none !important;
  }

  :host(:not([${d.MEDIA_PAUSED}])) slot[name=play] {
    display: none !important;
  }
  </style>

  <slot name="icon">
    <slot name="play">${id}</slot>
    <slot name="pause">${iu}</slot>
  </slot>
`;let ih=e=>{let t=e.mediaPaused?f.PLAY():f.PAUSE();e.setAttribute("aria-label",t)};Y.customElements.get("media-play-button")||Y.customElements.define("media-play-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_PAUSED,d.MEDIA_ENDED]}constructor(e={}){super({slotTemplate:ic,...e})}connectedCallback(){ih(this),super.connectedCallback()}attributeChangedCallback(e,t,i){e===d.MEDIA_PAUSED&&ih(this),super.attributeChangedCallback(e,t,i)}get mediaPaused(){return B(this,d.MEDIA_PAUSED)}set mediaPaused(e){W(this,d.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?n.MEDIA_PLAY_REQUEST:n.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new Y.CustomEvent(e,{composed:!0,bubbles:!0}))}});var im=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ip=(e,t,i)=>(im(e,t,"read from private field"),i?i.call(e):t.get(e)),iv=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};let ib={RATES:"rates"},iE=[1,1.25,1.5,1.75,2],ig=G.createElement("template");ig.innerHTML=`
  <span id="container"></span>
`,rN=new WeakMap,Y.customElements.get("media-playback-rate-button")||Y.customElements.define("media-playback-rate-button",class extends ea{constructor(e={}){super({slotTemplate:ig,...e}),iv(this,rN,new ew(this,ib.RATES,{defaultValue:iE})),this.container=this.shadowRoot.querySelector("#container"),this.container.innerHTML="1x"}static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_PLAYBACK_RATE,ib.RATES]}attributeChangedCallback(e,t,i){if(e===ib.RATES&&(ip(this,rN).value=i),e===d.MEDIA_PLAYBACK_RATE){let e=i?+i:Number.NaN,t=Number.isNaN(e)?1:e;this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",E.PLAYBACK_RATE({playbackRate:t}));return}super.attributeChangedCallback(e,t,i)}get rates(){return ip(this,rN)}set rates(e){e?Array.isArray(e)&&(ip(this,rN).value=e.join(" ")):ip(this,rN).value=""}get mediaPlaybackRate(){return P(this,d.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){U(this,d.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(this.rates.values(),e=>+e).sort((e,t)=>e-t),a=null!=(t=null!=(e=i.find(e=>e>this.mediaPlaybackRate))?e:i[0])?t:1,r=new Y.CustomEvent(n.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(r)}});let i_={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"},iy=G.createElement("template");iy.innerHTML=`
  <style>
    :host {
      pointer-events: none;
      display: var(--media-poster-image-display, inline-block);
      box-sizing: border-box;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      min-width: 100%;
      min-height: 100%;
      background-repeat: no-repeat;
      background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
      background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
      object-fit: var(--media-object-fit, contain);
      object-position: var(--media-object-position, center);
    }
  </style>

  <img part="poster img" aria-hidden="true" id="image"/>
`;let iA=e=>{e.style.removeProperty("background-image")},iT=(e,t)=>{e.style["background-image"]=`url('${t}')`};class ik extends Y.HTMLElement{static get observedAttributes(){return[i_.PLACEHOLDER_SRC,i_.SRC]}constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(iy.content.cloneNode(!0))),this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,t,i){e===i_.SRC&&(null==i?this.image.removeAttribute(i_.SRC):this.image.setAttribute(i_.SRC,i)),e===i_.PLACEHOLDER_SRC&&(null==i?iA(this.image):iT(this.image,i))}get placeholderSrc(){return V(this,i_.PLACEHOLDER_SRC)}set placeholderSrc(e){q(this,i_.SRC,e)}get src(){return V(this,i_.SRC)}set src(e){q(this,i_.SRC,e)}}Y.customElements.get("media-poster-image")||Y.customElements.define("media-poster-image",ik);let iw={SEEK_OFFSET:"seekoffset"},iI=G.createElement("template");iI.innerHTML=`
  <slot name="icon"><svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(2.18 19.87)">30</text><path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/></svg></slot>
`,Y.customElements.get("media-seek-backward-button")||Y.customElements.define("media-seek-backward-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_CURRENT_TIME,iw.SEEK_OFFSET]}constructor(e={}){super({slotTemplate:iI,...e})}connectedCallback(){this.seekOffset=P(this,iw.SEEK_OFFSET,30),super.connectedCallback()}attributeChangedCallback(e,t,i){e===iw.SEEK_OFFSET&&(this.seekOffset=P(this,iw.SEEK_OFFSET,30)),super.attributeChangedCallback(e,t,i)}get seekOffset(){return P(this,iw.SEEK_OFFSET,30)}set seekOffset(e){U(this,iw.SEEK_OFFSET,e),this.setAttribute("aria-label",f.SEEK_BACK_N_SECS({seekOffset:this.seekOffset})),R(C(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return P(this,d.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){U(this,d.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),t=new Y.CustomEvent(n.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}});var iS=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iL=(e,t,i)=>(iS(e,t,"read from private field"),i?i.call(e):t.get(e)),iD=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iR=(e,t,i,a)=>(iS(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);rP=new WeakMap,Y.customElements.get("media-preview-time-display")||Y.customElements.define("media-preview-time-display",class extends tR{constructor(){super(),iD(this,rP,void 0),iR(this,rP,this.shadowRoot.querySelector("slot")),iL(this,rP).textContent=D(0)}static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,i){e===d.MEDIA_PREVIEW_TIME&&null!=i&&(iL(this,rP).textContent=D(i)),super.attributeChangedCallback(e,t,i)}get mediaPreviewTime(){return P(this,d.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){U(this,d.MEDIA_PREVIEW_TIME,e)}});var iM=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iC=(e,t,i)=>(iM(e,t,"read from private field"),i?i.call(e):t.get(e)),iO=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ix=(e,t,i,a)=>(iM(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let iN=G.createElement("template");iN.innerHTML=`
  <style>
    :host {
      box-sizing: border-box;
      display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
      overflow: hidden;
    }

    img {
      display: none;
      position: relative;
    }
  </style>
  <img crossorigin loading="eager" decoding="async">
`;class iP extends Y.HTMLElement{constructor(){super(),iO(this,rU,void 0),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(iN.content.cloneNode(!0)))}static get observedAttributes(){return[s.MEDIA_CONTROLLER,d.MEDIA_PREVIEW_IMAGE,d.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,t,i;let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(ix(this,rU,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=iC(this,rU))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=iC(this,rU))?void 0:e.unassociateElement)||t.call(e,this),ix(this,rU,null)}attributeChangedCallback(e,t,i){var a,r,n,o,l;[d.MEDIA_PREVIEW_IMAGE,d.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===s.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=iC(this,rU))?void 0:a.unassociateElement)||r.call(a,this),ix(this,rU,null)),i&&(ix(this,rU,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=iC(this,rU))?void 0:o.associateElement)||l.call(o,this)))}get mediaPreviewImage(){return V(this,d.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){q(this,d.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(d.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(d.MEDIA_PREVIEW_COORDS);return}this.setAttribute(d.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){let e=this.mediaPreviewCoords,t=this.mediaPreviewImage;if(!(e&&t))return;let[i,a,r,n]=e,s=t.split("#")[0],o=getComputedStyle(this),{maxWidth:l,maxHeight:d,minWidth:u,minHeight:c}=o,h=Math.min(parseInt(l)/r,parseInt(d)/n),m=Math.max(parseInt(u)/r,parseInt(c)/n),p=h<1,v=p?h:m>1?m:1,{style:b}=N(this.shadowRoot,":host"),E=N(this.shadowRoot,"img").style,f=this.shadowRoot.querySelector("img"),g=p?"min":"max";b.setProperty(`${g}-width`,"initial","important"),b.setProperty(`${g}-height`,"initial","important"),b.width=`${r*v}px`,b.height=`${n*v}px`;let _=()=>{E.width=`${this.imgWidth*v}px`,E.height=`${this.imgHeight*v}px`,E.display="block"};f.src!==s&&(f.onload=()=>{this.imgWidth=f.naturalWidth,this.imgHeight=f.naturalHeight,_()},f.src=s,_()),_(),E.transform=`translate(-${i*v}px, -${a*v}px)`}}rU=new WeakMap,Y.customElements.get("media-preview-thumbnail")||Y.customElements.define("media-preview-thumbnail",iP);var iU=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iB=(e,t,i)=>(iU(e,t,"read from private field"),i?i.call(e):t.get(e)),iW=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iV=(e,t,i,a)=>(iU(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),iq=(e,t,i)=>(iU(e,t,"access private method"),i);let iH=e=>{let t=e.range,i=L(+t.value),a=L(+t.max),r=i&&a?`${i} of ${a}`:"video not loaded, unknown time.";t.setAttribute("aria-valuetext",r)},iF=G.createElement("template");iF.innerHTML=`
  <style>
    :host {
      --media-preview-border-radius: 3px;
      --media-box-padding-left: 10px;
      --media-box-padding-right: 10px;
    }

    #preview-rail,
    #current-rail {
      
      width: 1%;
      position: absolute;
      left: 0;
      bottom: 100%;
      pointer-events: none;
    }

    [part~="box"] {
      
      position: absolute;
      bottom: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateX(-50%);
    }

    [part~="preview-box"] {
      transition-property: var(--media-preview-transition-property, visibility, opacity);
      transition-duration: var(--media-preview-transition-duration-out, .25s);
      transition-delay: var(--media-preview-transition-delay-out, 0s);
      visibility: hidden;
      opacity: 0;
    }

    :host([${d.MEDIA_PREVIEW_IMAGE}]:hover) [part~="preview-box"],
    :host([${d.MEDIA_PREVIEW_TIME}]:hover) [part~="preview-box"] {
      transition-duration: var(--media-preview-transition-duration-in, .5s);
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
      opacity: 1;
    }

    media-preview-thumbnail,
    ::slotted(media-preview-thumbnail) {
      visibility: hidden;
      
      transition: visibility 0s .25s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-thumbnail-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)))));
      box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
      max-width: var(--media-preview-thumbnail-max-width, 180px);
      max-height: var(--media-preview-thumbnail-max-height, 160px);
      min-width: var(--media-preview-thumbnail-min-width, 120px);
      min-height: var(--media-preview-thumbnail-min-height, 80px);
      border: var(--media-preview-thumbnail-border);
      border-radius: var(--media-preview-thumbnail-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
    }

    :host([${d.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
    :host([${d.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
    }

    media-preview-time-display,
    ::slotted(media-preview-time-display) {
      min-width: 0;
      
      transition: min-width 0s, border-radius 0s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-time-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)))));
      border-radius: var(--media-preview-time-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius)
        var(--media-preview-border-radius) var(--media-preview-border-radius));
      padding: var(--media-preview-time-padding, 1px 10px 0);
      margin: var(--media-preview-time-margin, 0 0 10px);
      text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
    }

    :host([${d.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
    :host([${d.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      min-width: 100%;
      border-radius: var(--media-preview-time-border-radius,
        0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
    }

    :host([${d.MEDIA_PREVIEW_TIME}]:hover) {
      --media-time-range-hover-display: block;
    }
  </style>
  <div id="preview-rail">
    <slot name="preview" part="box preview-box">
      <media-preview-thumbnail></media-preview-thumbnail>
      <media-preview-time-display></media-preview-time-display>
    </slot>
  </div>
  <div id="current-rail">
    <slot name="current" part="box current-box">
      
    </slot>
  </div>
`,rB=new WeakMap,rW=new WeakMap,rV=new WeakMap,rq=new WeakMap,rH=new WeakMap,rF=new WeakSet,r$=function(){var e;let[,t]=null!=(e=this.mediaSeekable)?e:[];return t},rj=new WeakSet,rK=function(){var e;let[t]=null!=(e=this.mediaSeekable)?e:[];return t},rY=new WeakSet,rG=function(e,t){var i;let a=`${1e4*t}%`,r=e.offsetWidth;if(!r)return a;let n=null!=(i=this.getAttribute("bounds")?x(this,`#${this.getAttribute("bounds")}`):this.parentElement)?i:this,s=this.range.getBoundingClientRect(),o=n.getBoundingClientRect(),l=(iB(this,rq)-(s.left-o.left-r/2))/s.width*100,d=(o.right-s.left-r/2-iB(this,rH))/s.width*100;return Number.isNaN(l)||(a=`max(${100*l}%, ${a})`),Number.isNaN(d)||(a=`min(${a}, ${100*d}%)`),a},rQ=new WeakMap,rZ=new WeakMap,rz=new WeakMap,rX=new WeakMap,rJ=new WeakMap,r0=new WeakMap,r1=new WeakSet,r2=function(){this.addEventListener("pointermove",iB(this,r0),!1)},r5=new WeakSet,r3=function(){var e;null==(e=Y.window)||e.removeEventListener("pointermove",iB(this,rz)),this.removeEventListener("pointermove",iB(this,r0)),iV(this,rZ,!1),iB(this,rJ).call(this)},Y.customElements.get("media-time-range")||Y.customElements.define("media-time-range",class extends tf{constructor(){super(),iW(this,rF),iW(this,rj),iW(this,rY),iW(this,r1),iW(this,r5),iW(this,rB,void 0),iW(this,rW,void 0),iW(this,rV,void 0),iW(this,rq,void 0),iW(this,rH,void 0),iW(this,rQ,e=>{if([...iB(this,rB)].some(t=>e.composedPath().includes(t)))return;this.updatePointerBar(e);let t=this.mediaDuration;if(!t)return;let i=this.range.getBoundingClientRect(),a=(e.clientX-i.left-this.thumbWidth/2)/(i.width-this.thumbWidth);a=Math.max(0,Math.min(1,a));let r=iq(this,rY,rG).call(this,iB(this,rW),a),{style:s}=N(this.shadowRoot,"#preview-rail");s.transform=`translateX(${r})`;let o=a*t,l=new Y.CustomEvent(n.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:o});this.dispatchEvent(l)}),iW(this,rZ,!1),iW(this,rz,e=>{var t;(!e.composedPath().includes(this)||[...iB(this,rB)].some(t=>e.composedPath().includes(t)))&&(null==(t=Y.window)||t.removeEventListener("pointermove",iB(this,rz)),iV(this,rZ,!1),iB(this,rJ).call(this))}),iW(this,rX,()=>{var e;null==(e=Y.window)||e.addEventListener("pointermove",iB(this,rQ),!1)}),iW(this,rJ,()=>{var e;null==(e=Y.window)||e.removeEventListener("pointermove",iB(this,rQ));let t=new Y.CustomEvent(n.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:null});this.dispatchEvent(t)}),iW(this,r0,()=>{var e;let t=this.getAttribute(d.MEDIA_DURATION);!iB(this,rZ)&&t&&(iV(this,rZ,!0),iB(this,rX).call(this),null==(e=Y.window)||e.addEventListener("pointermove",iB(this,rz),!1))}),this.container.appendChild(iF.content.cloneNode(!0)),this.range.addEventListener("input",()=>{cancelAnimationFrame(this._refreshId);let e=this.range.value,t=new Y.CustomEvent(n.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}),this._refreshBar=()=>{let e=(performance.now()-this._updateTimestamp)/1e3;this.range.value=this.mediaCurrentTime+e*this.mediaPlaybackRate,this.updateBar(),this.updateCurrentBox(),this._refreshId=requestAnimationFrame(this._refreshBar)},iV(this,rB,this.shadowRoot.querySelectorAll('[part~="box"]')),iV(this,rW,this.shadowRoot.querySelector('[part~="preview-box"]')),iV(this,rV,this.shadowRoot.querySelector('[part~="current-box"]'));let e=getComputedStyle(this);iV(this,rq,parseInt(e.getPropertyValue("--media-box-padding-left"))),iV(this,rH,parseInt(e.getPropertyValue("--media-box-padding-right"))),iq(this,r1,r2).call(this)}static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_PAUSED,d.MEDIA_DURATION,d.MEDIA_SEEKABLE,d.MEDIA_CURRENT_TIME,d.MEDIA_PREVIEW_IMAGE,d.MEDIA_PREVIEW_TIME,d.MEDIA_BUFFERED,d.MEDIA_PLAYBACK_RATE,d.MEDIA_LOADING,d.MEDIA_ENDED]}connectedCallback(){this.range.setAttribute("aria-label",E.SEEK()),super.connectedCallback()}disconnectedCallback(){cancelAnimationFrame(this._refreshId),super.disconnectedCallback()}attributeChangedCallback(e,t,i){var a,r,n,s,o;e!==d.MEDIA_CURRENT_TIME&&e!==d.MEDIA_PAUSED&&e!==d.MEDIA_ENDED&&e!==d.MEDIA_LOADING||(this._updateTimestamp=performance.now(),this.range.value=this.mediaCurrentTime,iH(this),this.updateBar(),this.updateCurrentBox(),cancelAnimationFrame(this._refreshId),this.mediaPaused||this.mediaLoading||(this._refreshId=requestAnimationFrame(this._refreshBar))),e===d.MEDIA_DURATION&&(this.range.max=null!=(r=null!=(a=iB(this,rF,r$))?a:this.mediaDuration)?r:1e3,iH(this),this.updateBar(),this.updateCurrentBox()),e===d.MEDIA_SEEKABLE&&(this.range.min=null!=(n=iB(this,rj,rK))?n:0,this.range.max=null!=(o=null!=(s=iB(this,rF,r$))?s:this.mediaDuration)?o:1e3,iH(this),this.updateBar()),e===d.MEDIA_BUFFERED&&this.updateBar(),"disabled"===e&&(null==i?iq(this,r1,r2).call(this):iq(this,r5,r3).call(this)),super.attributeChangedCallback(e,t,i)}get mediaPaused(){return B(this,d.MEDIA_PAUSED)}set mediaPaused(e){W(this,d.MEDIA_PAUSED,e)}get mediaLoading(){return B(this,d.MEDIA_LOADING)}set mediaLoading(e){W(this,d.MEDIA_LOADING,e)}get mediaDuration(){return P(this,d.MEDIA_DURATION)}set mediaDuration(e){U(this,d.MEDIA_DURATION,e)}get mediaCurrentTime(){return P(this,d.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){U(this,d.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return P(this,d.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){U(this,d.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(d.MEDIA_BUFFERED);return e?e.split(" ").map(e=>e.split(":").map(e=>+e)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(d.MEDIA_BUFFERED);return}let t=e.map(e=>e.join(":")).join(" ");this.setAttribute(d.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(d.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){if(null==e){this.removeAttribute(d.MEDIA_SEEKABLE);return}this.setAttribute(d.MEDIA_SEEKABLE,e.join(":"))}get mediaPreviewImage(){return V(this,d.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){q(this,d.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return P(this,d.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){U(this,d.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return B(this,d.MEDIA_ENDED)}set mediaEnded(e){W(this,d.MEDIA_ENDED,e)}getRelativeValues(){let e=super.getRelativeValues();return this.mediaEnded?{...e,relativeValue:e.relativeMax}:e}getBarColors(){var e;let t;let i=super.getBarColors(),{range:a}=this,r=a.max-a.min,n=this.mediaBuffered;if(!n.length||!Number.isFinite(r)||r<=0)return i;if(this.mediaEnded)t=r;else{let i=this.mediaCurrentTime,[,r=a.min]=null!=(e=n.find(([e,t])=>e<=i&&i<=t))?e:[];t=r-a.min}let s=t/r*100;return i.splice(1,0,["var(--media-time-range-buffered-color, rgb(255 255 255 / .4))",s]),i}updateCurrentBox(){if(!iB(this,rV).assignedElements().length)return;let e=this.range.value/(this.range.max-this.range.min),t=iq(this,rY,rG).call(this,iB(this,rV),e),{style:i}=N(this.shadowRoot,"#current-rail");i.transform=`translateX(${t})`}});var i$=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ij=(e,t,i)=>(i$(e,t,"read from private field"),i?i.call(e):t.get(e)),iK=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iY=(e,t,i,a)=>(i$(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let iG={LOADING_DELAY:"loadingdelay"},iQ=G.createElement("template"),iZ=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;iQ.innerHTML=`
<style>
:host {
  display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
  vertical-align: middle;
  box-sizing: border-box;
  --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, 500ms);
}

#status {
  color: rgba(0,0,0,0);
  width: 0px;
  height: 0px;
}

:host slot[name=icon] > *,
:host ::slotted([slot=icon]) {
  opacity: var(--media-loading-indicator-opacity, 0);
  transition: opacity 0.15s;
}

:host([${d.MEDIA_LOADING}]:not([${d.MEDIA_PAUSED}])) slot[name=icon] > *,
:host([${d.MEDIA_LOADING}]:not([${d.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
  opacity: var(--media-loading-indicator-opacity, 1);
  transition: opacity 0.15s var(--_loading-indicator-delay);
}

:host #status {
  visibility: var(--media-loading-indicator-opacity, hidden);
  transition: visibility 0.15s;
}

:host([${d.MEDIA_LOADING}]:not([${d.MEDIA_PAUSED}])) #status {
  visibility: var(--media-loading-indicator-opacity, visible);
  transition: visibility 0.15s var(--_loading-indicator-delay);
}

svg, img, ::slotted(svg), ::slotted(img) {
  width: var(--media-loading-indicator-icon-width);
  height: var(--media-loading-indicator-icon-height, 100px);
  fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
  vertical-align: middle;
}
</style>

<slot name="icon">${iZ}</slot>
<div id="status" role="status" aria-live="polite">${E.MEDIA_LOADING()}</div>
`;class iz extends Y.HTMLElement{constructor(){if(super(),iK(this,r4,void 0),iK(this,r7,500),iK(this,r8,void 0),!this.shadowRoot){let e=this.attachShadow({mode:"open"}),t=iQ.content.cloneNode(!0);e.appendChild(t)}let{style:e}=N(this.shadowRoot,":host");iY(this,r8,e)}static get observedAttributes(){return[s.MEDIA_CONTROLLER,d.MEDIA_PAUSED,d.MEDIA_LOADING,iG.LOADING_DELAY]}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===iG.LOADING_DELAY&&t!==i?this.loadingDelay=Number(i):e===s.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ij(this,r4))?void 0:a.unassociateElement)||r.call(a,this),iY(this,r4,null)),i&&(iY(this,r4,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=ij(this,r4))?void 0:o.associateElement)||l.call(o,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(iY(this,r4,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=ij(this,r4))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=ij(this,r4))?void 0:e.unassociateElement)||t.call(e,this),iY(this,r4,null)}get loadingDelay(){return ij(this,r7)}set loadingDelay(e){iY(this,r7,e),ij(this,r8).setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return B(this,d.MEDIA_PAUSED)}set mediaPaused(e){W(this,d.MEDIA_PAUSED,e)}get mediaLoading(){return B(this,d.MEDIA_LOADING)}set mediaLoading(e){W(this,d.MEDIA_LOADING,e)}}r4=new WeakMap,r7=new WeakMap,r8=new WeakMap,Y.customElements.get("media-loading-indicator")||Y.customElements.define("media-loading-indicator",iz);let iX=e=>e.mediaMuted?0:Math.round(e.mediaVolume*e.range.max),iJ=({value:e,max:t})=>`${Math.round(e/t*100)}%`;Y.customElements.get("media-volume-range")||Y.customElements.define("media-volume-range",class extends tf{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_VOLUME,d.MEDIA_MUTED,d.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.max=100,this.range.addEventListener("input",()=>{let e=this.range.value/this.range.max,t=new Y.CustomEvent(n.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)})}connectedCallback(){this.range.setAttribute("aria-label",E.VOLUME()),super.connectedCallback()}attributeChangedCallback(e,t,i){if(e===d.MEDIA_VOLUME||e===d.MEDIA_MUTED){let e=iX(this);this.range.value=e,this.range.setAttribute("aria-valuetext",iJ(this.range)),this.updateBar()}super.attributeChangedCallback(e,t,i)}get mediaVolume(){return P(this,d.MEDIA_VOLUME,1)}set mediaVolume(e){U(this,d.MEDIA_VOLUME,e)}get mediaMuted(){return B(this,d.MEDIA_MUTED)}set mediaMuted(e){W(this,d.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return V(this,d.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){q(this,d.MEDIA_VOLUME_UNAVAILABLE,e)}});var i0=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},i1=(e,t,i)=>(i0(e,t,"read from private field"),i?i.call(e):t.get(e)),i2=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},i5=(e,t,i,a)=>(i0(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),i3=(e,t,i)=>(i0(e,t,"access private method"),i);let i4=`
<svg aria-hidden="true" viewBox="0 1 24 24" part="select-indicator indicator">
  <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
</svg>`;function i7(e,t,i){let a=G.createElement("media-chrome-option");a.part.add("option"),a.value=t,a.selected=i;let r=G.createElement("span");return r.textContent=e,a.append(r),a}function i8(e,t){let i=e.querySelector(`:scope > [slot="${t}"]`);return((null==i?void 0:i.nodeName)=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)?((i=i.cloneNode(!0)).removeAttribute("slot"),i):e.shadowRoot.querySelector(`[name="${t}"] > svg`).cloneNode(!0)}let i6=G.createElement("template");i6.innerHTML=`
<style>
  :host {
    font: var(--media-font,
      var(--media-font-weight, normal)
      var(--media-font-size, 15px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    background: var(--media-listbox-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .8))));
    border-radius: var(--media-listbox-border-radius);
    display: inline-block;
    padding-block: .5em;
  }

  ::slotted([slot="header"]) {
    padding: 0 1.4em .4em;
    margin-bottom: .5em;
    border-bottom: 1px solid rgb(255 255 255 / .25);
  }

  media-chrome-option {
    padding-inline: .7em 1.4em;
  }

  media-chrome-option > span {
    margin-inline: .5ch;
  }

  [part~="indicator"] {
    fill: var(--media-option-indicator-fill, var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
    height: var(--media-option-indicator-height, 1.25em);
    vertical-align: var(--media-option-indicator-vertical-align, text-top);
  }

  [part~="select-indicator"] {
    visibility: hidden;
  }

  [aria-selected="true"] > [part~="select-indicator"] {
    visibility: visible;
  }
</style>
<slot name="header"></slot>
<slot id="container"></slot>
<slot name="select-indicator" hidden>${i4}</slot>
`;class i9 extends Y.HTMLElement{constructor(e={}){super(),i2(this,na),i2(this,no),i2(this,nd),i2(this,nc),i2(this,nm),i2(this,r6,void 0),i2(this,r9,""),i2(this,ne,null),i2(this,nt,!1),i2(this,ni,e=>{this.handleClick(e)}),i2(this,nn,e=>{let{key:t}=e;if("Escape"===t){this.removeEventListener("keyup",i1(this,nn));return}if("Meta"===t){i5(this,nt,!1);return}i3(this,na,nr).call(this,e)}),i2(this,ns,e=>{let{key:t,altKey:i}=e;if(i){this.removeEventListener("keyup",i1(this,nn));return}if("Meta"===t){i5(this,nt,!0);return}if(this.keysUsed.includes(t)&&e.preventDefault(),i1(this,nt)&&this.keysUsed.includes(t)){i3(this,na,nr).call(this,e);return}this.addEventListener("keyup",i1(this,nn),{once:!0})}),this.shadowRoot||(this.attachShadow({mode:"open"}),this.nativeEl=i6.content.cloneNode(!0),e.slotTemplate&&this.nativeEl.append(e.slotTemplate.content.cloneNode(!0)),this.shadowRoot.append(this.nativeEl)),this.container=this.shadowRoot.querySelector("#container"),this.container.addEventListener("slotchange",e=>{for(let t of e.target.assignedNodes({flatten:!0}))3===t.nodeType&&""===t.textContent.trim()&&t.remove()})}static get observedAttributes(){return["disabled",s.MEDIA_CONTROLLER]}static formatOptionText(e){return e}formatOptionText(e,t){return this.constructor.formatOptionText(e,t)}get options(){var e;let t=this.querySelectorAll("media-chrome-option");return t.length||(t=null==(e=this.container)?void 0:e.querySelectorAll("media-chrome-option")),Array.from(t)}get selectedOptions(){return this.options.filter(e=>e.selected)}get value(){var e,t;return null!=(t=null==(e=this.selectedOptions[0])?void 0:e.value)?t:""}set value(e){let t=this.options.find(t=>t.value===e);t&&i3(this,nd,nu).call(this,t)}focus(){var e;null==(e=this.selectedOptions[0])||e.focus()}enable(){this.addEventListener("click",i1(this,ni)),this.addEventListener("keydown",i1(this,ns))}disable(){this.removeEventListener("click",i1(this,ni)),this.removeEventListener("keyup",i1(this,nn))}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=i1(this,r6))?void 0:a.unassociateElement)||r.call(a,this),i5(this,r6,null)),i&&(i5(this,r6,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=i1(this,r6))?void 0:o.associateElement)||l.call(o,this))):"disabled"===e&&i!==t&&(null==i?this.enable():this.disable())}connectedCallback(){var e,t,i;this.hasAttribute("disabled")||this.enable(),this.hasAttribute("role")||this.setAttribute("role","listbox");let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(i5(this,r6,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=i1(this,r6))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=i1(this,r6))?void 0:e.unassociateElement)||t.call(e,this),i5(this,r6,null)}get keysUsed(){return["Enter"," ","ArrowDown","ArrowUp","Home","End"]}handleSelection(e,t){let i=i3(this,no,nl).call(this,e);i&&i3(this,nd,nu).call(this,i,t)}handleMovement(e){let t;let{key:i}=e,a=this.options,r=i3(this,no,nl).call(this,e);switch(r||(r=a.filter(e=>"0"===e.getAttribute("tabindex"))[0]),i){case"ArrowDown":(null==(t=r.nextElementSibling)?void 0:t.hasAttribute("disabled"))&&(t=t.nextElementSibling);break;case"ArrowUp":(null==(t=r.previousElementSibling)?void 0:t.hasAttribute("disabled"))&&(t=t.previousElementSibling);break;case"Home":t=a[0];break;case"End":t=a[a.length-1];break;default:t=i3(this,nc,nh).call(this,i)}t&&(a.forEach(e=>e.setAttribute("tabindex","-1")),t.setAttribute("tabindex","0"),t.focus())}handleClick(e){let t=i3(this,no,nl).call(this,e);!t||t.hasAttribute("disabled")||(this.options.forEach(e=>e.setAttribute("tabindex","-1")),t.setAttribute("tabindex","0"),this.handleSelection(e,this.hasAttribute("aria-multiselectable")&&"true"===this.getAttribute("aria-multiselectable")))}}r6=new WeakMap,r9=new WeakMap,ne=new WeakMap,nt=new WeakMap,ni=new WeakMap,na=new WeakSet,nr=function(e){let{key:t}=e;"Enter"===t||" "===t?this.handleSelection(e,this.hasAttribute("aria-multiselectable")&&"true"===this.getAttribute("aria-multiselectable")):this.handleMovement(e)},nn=new WeakMap,ns=new WeakMap,no=new WeakSet,nl=function(e){let t=e.composedPath(),i=t.findIndex(e=>"MEDIA-CHROME-OPTION"===e.nodeName);return t[i]},nd=new WeakSet,nu=function(e,t){let i=[...this.selectedOptions];this.hasAttribute("aria-multiselectable")&&"true"===this.getAttribute("aria-multiselectable")||this.options.forEach(e=>e.selected=!1),t?e.selected=!e.selected:e.selected=!0,this.selectedOptions.some((e,t)=>e!=i[t])&&this.dispatchEvent(new Event("change"))},nc=new WeakSet,nh=function(e){i3(this,nm,np).call(this);let t=this.options,i=t.findIndex(e=>"0"===e.getAttribute("tabindex"));i5(this,r9,i1(this,r9)+e);let a=i1(this,r9).split("").every(t=>t===e),r=t.slice(i+(a?1:0)).filter(e=>e.textContent.toLowerCase().startsWith(i1(this,r9))),n=t.slice(0,i-(a?1:0)).filter(e=>e.textContent.toLowerCase().startsWith(i1(this,r9))),s=[],o=[];a&&(s=t.slice(i+(a?1:0)).filter(t=>t.textContent.startsWith(e)),o=t.slice(0,i-(a?1:0)).filter(t=>t.textContent.startsWith(e)));let l=[...r,...n,...s,...o];return l[0]},nm=new WeakSet,np=function(){clearTimeout(i1(this,ne)),i5(this,ne,null),i5(this,ne,setTimeout(()=>{i5(this,r9,""),i5(this,ne,null)},500))},Y.customElements.get("media-chrome-listbox")||Y.customElements.define("media-chrome-listbox",i9);var ae=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},at=(e,t,i)=>(ae(e,t,"read from private field"),i?i.call(e):t.get(e)),ai=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aa=(e,t,i,a)=>(ae(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),ar=(e,t,i)=>(ae(e,t,"access private method"),i);let an=G.createElement("template");an.innerHTML=`
<style>
  :host {
    cursor: pointer;
    display: block;
    line-height: revert;
    white-space: nowrap;
    white-space-collapse: collapse;
    text-wrap: nowrap;
    min-height: 1.2em;
    padding: .4em .5em;
    transition: var(--media-option-transition);
    outline: var(--media-option-outline, 0);
    outline-offset: var(--media-option-outline-offset, -1px);
  }

  :host(:focus-visible) {
    box-shadow: var(--media-option-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
    outline: var(--media-option-hover-outline, 0);
    outline-offset: var(--media-option-hover-outline-offset,  var(--media-option-outline-offset, -1px));
  }

  :host(:hover) {
    cursor: pointer;
    background: var(--media-option-hover-background, rgb(82 82 122 / .8));
    outline: var(--media-option-hover-outline);
    outline-offset: var(--media-option-hover-outline-offset,  var(--media-option-outline-offset, -1px));
  }

  :host([aria-selected="true"]) {
    background: var(--media-option-selected-background);
  }

  :host([disabled]) {
    pointer-events: none;
    color: rgba(255, 255, 255, .3);
  }
</style>
<slot></slot>
`;let as={VALUE:"value",SELECTED:"selected",DISABLED:"disabled"};class ao extends Y.HTMLElement{constructor(){super(),ai(this,nE),ai(this,nv,!1),ai(this,nb,void 0),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(an.content.cloneNode(!0)))}static get observedAttributes(){return[as.DISABLED,as.SELECTED,as.VALUE]}get value(){var e;return null!=(e=this.getAttribute(as.VALUE))?e:this.text}set value(e){this.setAttribute(as.VALUE,e)}get text(){var e;return(null!=(e=this.textContent)?e:"").trim()}get selected(){return"true"===this.getAttribute("aria-selected")}set selected(e){aa(this,nv,!0),this.setAttribute("aria-selected",e?"true":"false"),e?this.part.add("option-selected"):this.part.remove("option-selected")}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex",-1),this.hasAttribute("aria-selected")||this.setAttribute("aria-selected","false")}disable(){this.removeAttribute("tabindex")}attributeChangedCallback(e,t,i){e!==as.SELECTED||at(this,nv)?e===as.DISABLED&&i!==t&&(null==i?this.enable():this.disable()):this.setAttribute("aria-selected",null!=i?"true":"false")}connectedCallback(){this.hasAttribute(as.DISABLED)||this.enable(),this.setAttribute("role","option"),aa(this,nb,function e(t,i){if(!t)return null;let{host:a}=t.getRootNode();return!i&&a?e(t,a):(null==i?void 0:i.options)?i:e(i,null==i?void 0:i.parentNode)}(this,this.parentNode)),ar(this,nE,nf).call(this)}disconnectedCallback(){this.disable(),ar(this,nE,nf).call(this),aa(this,nb,null)}handleClick(){}}nv=new WeakMap,nb=new WeakMap,nE=new WeakSet,nf=function(){var e;let t=null==(e=at(this,nb))?void 0:e.options;if(!t)return;let i=t.filter(e=>"true"===e.getAttribute("aria-selected")).pop();i||(i=t[0]),"true"!==at(this,nb).getAttribute("aria-multiselectable")&&t.forEach(e=>{e.setAttribute("tabindex","-1"),e.setAttribute("aria-selected","false")}),null==i||i.setAttribute("tabindex","0"),null==i||i.setAttribute("aria-selected","true")},Y.customElements.get("media-chrome-option")||Y.customElements.define("media-chrome-option",ao);var al=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ad=(e,t,i)=>(al(e,t,"read from private field"),i?i.call(e):t.get(e)),au=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ac=(e,t,i,a)=>(al(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),ah=(e,t,i)=>(al(e,t,"access private method"),i);let am=G.createElement("template");am.innerHTML=`
  <style>
  :host {
    font: var(--media-font,
      var(--media-font-weight, normal)
      var(--media-font-size, 15px) /
      var(--media-text-content-height, var(--media-control-height, 24px))
      var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
    color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
    display: inline-flex;
    position: relative;
    flex-shrink: .5;
  }

  [name="listbox"]::slotted(*),
  [part=listbox] {
    position: absolute;
    left: 0;
    bottom: 100%;
    max-height: 300px;
    overflow: hidden auto;
    transition: var(--media-selectmenu-transition-in,
      visibility 0s, transform .15s ease-out, opacity .15s ease-out);
    transform: var(--media-listbox-transform-in, translateY(0) scale(1));
    visibility: visible;
    opacity: 1;
  }

  [name="listbox"][hidden]::slotted(*),
  [hidden] [part=listbox] {
    transition: var(--media-selectmenu-transition-out,
      visibility .15s ease-out, transform .15s ease-out, opacity .15s ease-out);
    transform: var(--media-listbox-transform-out, translateY(2px) scale(.99));
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }

  slot[name="listbox"][hidden] {
    display: block;
  }
  </style>

  <slot name="button">
    <media-chrome-button aria-haspopup="listbox" part="button">
      <slot name="button-content"></slot>
    </media-chrome-button>
  </slot>
  <slot name="listbox" hidden>
    <media-chrome-listbox id="listbox" part="listbox">
      <slot></slot>
    </media-chrome-listbox>
  </slot>
`;class ap extends Y.HTMLElement{constructor(){var e;super(),au(this,nM),au(this,nO),au(this,nN),au(this,nU),au(this,nW),au(this,ng,void 0),au(this,n_,void 0),au(this,ny,void 0),au(this,nA,!0),au(this,nT,void 0),au(this,nk,void 0),au(this,nw,void 0),au(this,nI,void 0),au(this,nS,!1),au(this,nL,e=>{let{key:t}=e;if(!this.keysUsed.includes(t)){this.removeEventListener("keyup",ad(this,nL));return}let i=e.composedPath().includes(ad(this,nT));i&&("Enter"===t||" "===t)?ad(this,n_).call(this):"Escape"!==t||ad(this,nI).hidden||ah(this,nN,nP).call(this)}),au(this,nD,e=>{let{metaKey:t,altKey:i,key:a}=e;if(t||i||!this.keysUsed.includes(a)){this.removeEventListener("keyup",ad(this,nL));return}e.preventDefault(),this.addEventListener("keyup",ad(this,nL),{once:!0})}),au(this,nR,e=>{e.composedPath().includes(this)||ad(this,nI).hidden||ah(this,nN,nP).call(this)}),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(am.content.cloneNode(!0)));let{style:t}=N(this.shadowRoot,":host");t.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),ac(this,n_,ah(this,nM,nC).bind(this)),ac(this,ny,ah(this,nO,nx).bind(this)),null==(e=this.init)||e.call(this),ac(this,nT,this.shadowRoot.querySelector("[part=button]")),ac(this,nw,this.shadowRoot.querySelector("[part=listbox]")),ac(this,nk,this.shadowRoot.querySelector("slot[name=button]")),ad(this,nk).addEventListener("slotchange",()=>{let e=ad(this,nk).assignedElements()[0];e&&(this.disable(),ac(this,nT,e),ad(this,nT).preventClick=!0,ad(this,nT).hasAttribute("disabled")&&ac(this,nA,!1),ad(this,nA)?(this.enable(),ad(this,nT).setAttribute("aria-haspopup","listbox")):this.disable())}),ac(this,nI,this.shadowRoot.querySelector("slot[name=listbox]")),ad(this,nI).addEventListener("slotchange",()=>{this.disable(),ac(this,nw,ad(this,nI).assignedElements()[0]||ad(this,nw)),this.enable()})}static get observedAttributes(){return["disabled",s.MEDIA_CONTROLLER]}enable(){ad(this,nT).removeAttribute("disabled"),ad(this,nT).addEventListener("click",ad(this,n_)),ad(this,nT).addEventListener("keydown",ad(this,nD)),ad(this,nw).addEventListener("keydown",ad(this,nD)),ah(this,nW,nV).call(this),ad(this,nw).addEventListener("change",ad(this,ny)),G.addEventListener("click",ad(this,nR))}disable(){ad(this,nT).setAttribute("disabled",""),ad(this,nT).removeEventListener("click",ad(this,n_)),ad(this,nT).removeEventListener("keydown",ad(this,nD)),ad(this,nT).removeEventListener("keyup",ad(this,nL)),ad(this,nw).removeEventListener("keydown",ad(this,nD)),ad(this,nw).removeEventListener("keyup",ad(this,nL)),ad(this,nw).addEventListener("change",ad(this,ny)),G.removeEventListener("click",ad(this,nR))}attributeChangedCallback(e,t,i){var a,r,n,o,l;e===s.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=ad(this,ng))?void 0:a.unassociateElement)||r.call(a,this),ac(this,ng,null),ad(this,nw).removeAttribute(s.MEDIA_CONTROLLER)),i&&(ac(this,ng,null==(n=this.getRootNode())?void 0:n.getElementById(i)),null==(l=null==(o=ad(this,ng))?void 0:o.associateElement)||l.call(o,this),ad(this,nw).setAttribute(s.MEDIA_CONTROLLER,i))):"disabled"===e&&i!==t&&(null==i?(ac(this,nA,!0),this.enable()):(ac(this,nA,!1),this.disable()))}connectedCallback(){var e,t,i;this.hasAttribute("disabled")||this.enable();let a=this.getAttribute(s.MEDIA_CONTROLLER);a&&(ac(this,ng,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=ad(this,ng))?void 0:t.associateElement)||i.call(t,this),ad(this,nw).setAttribute(s.MEDIA_CONTROLLER,a))}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=ad(this,ng))?void 0:e.unassociateElement)||t.call(e,this),ac(this,ng,null),ad(this,nw).removeAttribute(s.MEDIA_CONTROLLER)}get keysUsed(){return["Enter","Escape"," ","ArrowUp","ArrowDown","f","c","k","m"]}}ng=new WeakMap,n_=new WeakMap,ny=new WeakMap,nA=new WeakMap,nT=new WeakMap,nk=new WeakMap,nw=new WeakMap,nI=new WeakMap,nS=new WeakMap,nL=new WeakMap,nD=new WeakMap,nR=new WeakMap,nM=new WeakSet,nC=function(){ah(this,nN,nP).call(this)},nO=new WeakSet,nx=function(){ah(this,nN,nP).call(this,!0)},nN=new WeakSet,nP=function(e){ad(this,nI).hidden=!ad(this,nI).hidden||e,ah(this,nW,nV).call(this,e),ad(this,nI).hidden?(this.shadowRoot.activeElement===ad(this,nw)||ad(this,nw).contains(this.shadowRoot.activeElement))&&ad(this,nT).focus():(ad(this,nw).focus(),ah(this,nU,nB).call(this))},nU=new WeakSet,nB=function(){var e;if(0===ad(this,nw).offsetWidth)return;let t=ad(this,nT).getBoundingClientRect();if(this.hasAttribute("mediacontroller")||ad(this,nT).hasAttribute("mediacontroller")||ad(this,nw).hasAttribute("mediacontroller")){ad(this,nw).style.zIndex="1",ad(this,nw).style.bottom="unset",ad(this,nw).style.top=t.height+"px";return}let i=null!=(e=this.getAttribute("bounds")?x(this,`#${this.getAttribute("bounds")}`):this.parentElement)?e:this,a=ad(this,nw).offsetWidth,r=i.getBoundingClientRect(),n=-Math.max(t.x+a-r.right,0);ad(this,nw).style.left=`${n}px`},nW=new WeakSet,nV=function(e=!1){ac(this,nS,!ad(this,nS)||e),ad(this,nT).setAttribute("aria-expanded",ad(this,nS))},Y.customElements.get("media-chrome-selectmenu")||Y.customElements.define("media-chrome-selectmenu",ap);var av=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ab=(e,t,i)=>(av(e,t,"read from private field"),i?i.call(e):t.get(e)),aE=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},af=(e,t,i,a)=>(av(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),ag=(e,t,i)=>(av(e,t,"access private method"),i);let a_=`
<svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,ay=G.createElement("template");ay.innerHTML=`
  <slot name="captions-indicator" hidden>${a_}</slot>
`,nq=new WeakMap,nH=new WeakSet,nF=function(){var e;if(ab(this,nq)===JSON.stringify(this.mediaSubtitlesList))return;af(this,nq,JSON.stringify(this.mediaSubtitlesList));let t=this.shadowRoot.querySelector("#container");t.textContent="";let i=!this.value,a=i7(this.formatOptionText("Off"),"off",i);a.prepend(i8(this,"select-indicator")),t.append(a);let r=this.mediaSubtitlesList;for(let i of r){let a=i7(this.formatOptionText(i.label,i),eR(i),this.value==eR(i));a.prepend(i8(this,"select-indicator"));let r=null!=(e=i.kind)?e:"subs";"captions"===r&&a.append(i8(this,"captions-indicator")),t.append(a)}},n$=new WeakSet,nj=function(){if(eU(this,!1),!this.value)return;let e=new Y.CustomEvent(n.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)};let aA=(e,t)=>{let i=e.getAttribute(t);return i?eL(i):[]},aT=(e,t,i)=>{if(!(null==i?void 0:i.length)){e.removeAttribute(t);return}let a=eM(i),r=e.getAttribute(t);r!==a&&e.setAttribute(t,a)};Y.customElements.get("media-captions-listbox")||Y.customElements.define("media-captions-listbox",class extends i9{constructor(){super({slotTemplate:ay}),aE(this,nH),aE(this,n$),aE(this,nq,void 0)}static get observedAttributes(){return[...super.observedAttributes,"aria-multiselectable",d.MEDIA_SUBTITLES_LIST,d.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===d.MEDIA_SUBTITLES_LIST&&t!==i?ag(this,nH,nF).call(this):e===d.MEDIA_SUBTITLES_SHOWING&&t!==i?this.value=i:"aria-multiselectable"===e&&(this.removeAttribute("aria-multiselectable"),console.warn("Captions List doesn't currently support multiple selections. You can enable multiple items via the media.textTrack API."))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",ag(this,n$,nj))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",ag(this,n$,nj))}get mediaSubtitlesList(){return aA(this,d.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){aT(this,d.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return aA(this,d.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){aT(this,d.MEDIA_SUBTITLES_SHOWING,e)}}),Y.customElements.get("media-captions-selectmenu")||Y.customElements.define("media-captions-selectmenu",class extends ap{init(){let e=G.createElement("media-captions-button");e.part.add("button"),e.preventClick=!0;let t=G.createElement("media-captions-listbox");t.part.add("listbox"),t.setAttribute("exportparts","option, option-selected, indicator");let i=this.shadowRoot.querySelector("slot[name=button]"),a=this.shadowRoot.querySelector("slot[name=listbox]");i.textContent="",a.textContent="",i.append(e),a.append(t)}});var ak=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aw=(e,t,i)=>(ak(e,t,"read from private field"),i?i.call(e):t.get(e)),aI=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aS=(e,t,i)=>(ak(e,t,"access private method"),i);let aL={RATES:"rates"};nK=new WeakMap,nY=new WeakSet,nG=function(){let e=this.shadowRoot.querySelector("#container");for(let t of(e.textContent="",this.rates)){let i=i7(this.formatOptionText(`${t}x`,t),t,this.mediaPlaybackRate==t);i.prepend(i8(this,"select-indicator")),e.append(i)}},nQ=new WeakSet,nZ=function(){if(!this.value)return;let e=new Y.CustomEvent(n.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},Y.customElements.get("media-playback-rate-listbox")||Y.customElements.define("media-playback-rate-listbox",class extends i9{constructor(){super(),aI(this,nY),aI(this,nQ),aI(this,nK,new ew(this,aL.RATES,{defaultValue:iE})),aS(this,nY,nG).call(this)}static get observedAttributes(){return[...super.observedAttributes,"aria-multiselectable",d.MEDIA_PLAYBACK_RATE,aL.RATES]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===d.MEDIA_PLAYBACK_RATE&&t!=i?this.value=i:e===aL.RATES&&t!=i&&(aw(this,nK).value=i,aS(this,nY,nG).call(this))}get rates(){return aw(this,nK)}set rates(e){e?Array.isArray(e)&&(aw(this,nK).value=e.join(" ")):aw(this,nK).value="",aS(this,nY,nG).call(this)}get mediaPlaybackRate(){return P(this,d.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){U(this,d.MEDIA_PLAYBACK_RATE,e)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",aS(this,nQ,nZ))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",aS(this,nQ,nZ))}}),Y.customElements.get("media-playback-rate-selectmenu")||Y.customElements.define("media-playback-rate-selectmenu",class extends ap{init(){let e=G.createElement("media-playback-rate-button");e.part.add("button"),e.preventClick=!0;let t=G.createElement("media-playback-rate-listbox");t.part.add("listbox"),t.setAttribute("exportparts","option, option-selected, indicator");let i=this.shadowRoot.querySelector("slot[name=button]"),a=this.shadowRoot.querySelector("slot[name=listbox]");i.textContent="",a.textContent="",i.append(e),a.append(t)}});var aD=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aR=(e,t,i)=>(aD(e,t,"read from private field"),i?i.call(e):t.get(e)),aM=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aC=(e,t,i,a)=>(aD(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aO=(e,t,i)=>(aD(e,t,"access private method"),i);nz=new WeakMap,nX=new WeakMap,nJ=new WeakSet,n0=function(){if(aR(this,nX)===JSON.stringify(this.mediaRenditionList))return;aC(this,nX,JSON.stringify(this.mediaRenditionList));let e=this.mediaRenditionList.sort((e,t)=>t.height-e.height),t=this.shadowRoot.querySelector("#container");t.textContent="";let i=!this.mediaRenditionSelected;for(let a of e){let e=this.formatOptionText(`${Math.min(a.width,a.height)}p`,a),r=i7(e,`${a.id}`,a.selected&&!i);r.prepend(i8(this,"select-indicator")),t.append(r)}let a=i7(this.formatOptionText("Auto"),"auto",i);a.prepend(i8(this,"select-indicator")),t.append(a)},n1=new WeakSet,n2=function(){if(null==this.value)return;let e=new Y.CustomEvent(n.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},Y.customElements.get("media-rendition-listbox")||Y.customElements.define("media-rendition-listbox",class extends i9{constructor(){super(...arguments),aM(this,nJ),aM(this,n1),aM(this,nz,[]),aM(this,nX,void 0)}static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_RENDITION_LIST,d.MEDIA_RENDITION_SELECTED]}attributeChangedCallback(e,t,i){(super.attributeChangedCallback(e,t,i),e===d.MEDIA_RENDITION_SELECTED&&t!==i)?this.value=null!=i?i:"auto":e===d.MEDIA_RENDITION_LIST&&t!==i&&(aC(this,nz,null==i?void 0:i.split(/\s+/).map(_)),aO(this,nJ,n0).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",aO(this,n1,n2))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",aO(this,n1,n2))}get mediaRenditionList(){return aR(this,nz)}set mediaRenditionList(e){aC(this,nz,e),aO(this,nJ,n0).call(this)}get mediaRenditionSelected(){return V(this,d.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){q(this,d.MEDIA_RENDITION_SELECTED,e)}});let ax=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`,aN=G.createElement("template");aN.innerHTML=`
  <slot name="icon">${ax}</slot>
`,Y.customElements.get("media-rendition-button")||Y.customElements.define("media-rendition-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_RENDITION_SELECTED,d.MEDIA_RENDITION_UNAVAILABLE]}constructor(){super({slotTemplate:aN})}get mediaRenditionSelected(){return V(this,d.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){q(this,d.MEDIA_RENDITION_SELECTED,e)}}),Y.customElements.get("media-rendition-selectmenu")||Y.customElements.define("media-rendition-selectmenu",class extends ap{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_RENDITION_SELECTED,d.MEDIA_RENDITION_UNAVAILABLE]}init(){let e=G.createElement("media-rendition-button");e.part.add("button"),e.preventClick=!0;let t=G.createElement("media-rendition-listbox");t.part.add("listbox"),t.setAttribute("exportparts","option, option-selected, indicator");let i=this.shadowRoot.querySelector("slot[name=button]"),a=this.shadowRoot.querySelector("slot[name=listbox]");i.textContent="",a.textContent="",i.append(e),a.append(t)}});var aP=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aU=(e,t,i)=>(aP(e,t,"read from private field"),i?i.call(e):t.get(e)),aB=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},aW=(e,t,i,a)=>(aP(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aV=(e,t,i)=>(aP(e,t,"access private method"),i);n5=new WeakMap,n3=new WeakMap,n4=new WeakSet,n7=function(){if(aU(this,n3)===JSON.stringify(this.mediaAudioTrackList))return;aW(this,n3,JSON.stringify(this.mediaAudioTrackList));let e=this.mediaAudioTrackList,t=this.shadowRoot.querySelector("#container");for(let i of(t.textContent="",e)){let e=this.formatOptionText(i.label,i),a=i7(e,`${i.id}`,i.enabled);a.prepend(i8(this,"select-indicator")),t.append(a)}},n8=new WeakSet,n6=function(){if(null==this.value)return;let e=new Y.CustomEvent(n.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(e)},Y.customElements.get("media-audio-track-listbox")||Y.customElements.define("media-audio-track-listbox",class extends i9{constructor(){super(...arguments),aB(this,n4),aB(this,n8),aB(this,n5,[]),aB(this,n3,void 0)}static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_AUDIO_TRACK_LIST,d.MEDIA_AUDIO_TRACK_ENABLED]}attributeChangedCallback(e,t,i){(super.attributeChangedCallback(e,t,i),e===d.MEDIA_AUDIO_TRACK_ENABLED&&t!==i)?this.value=i:e===d.MEDIA_AUDIO_TRACK_LIST&&t!==i&&(aW(this,n5,null==i?void 0:i.split(/\s+/).map(A)),aV(this,n4,n7).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",aV(this,n8,n6))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",aV(this,n8,n6))}get mediaAudioTrackList(){return aU(this,n5)}set mediaAudioTrackList(e){aW(this,n5,e),aV(this,n4,n7).call(this)}get mediaAudioTrackEnabled(){return V(this,d.MEDIA_AUDIO_TRACK_ENABLED)}set mediaAudioTrackEnabled(e){q(this,d.MEDIA_AUDIO_TRACK_ENABLED,e)}});let aq=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`,aH=G.createElement("template");aH.innerHTML=`
  <slot name="icon">${aq}</slot>
`,Y.customElements.get("media-audio-track-button")||Y.customElements.define("media-audio-track-button",class extends ea{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_AUDIO_TRACK_ENABLED,d.MEDIA_AUDIO_TRACK_UNAVAILABLE]}constructor(){super({slotTemplate:aH})}get mediaAudioTrackEnabled(){return V(this,d.MEDIA_AUDIO_TRACK_ENABLED)}set mediaAudioTrackEnabled(e){q(this,d.MEDIA_AUDIO_TRACK_ENABLED,e)}}),Y.customElements.get("media-audio-track-selectmenu")||Y.customElements.define("media-audio-track-selectmenu",class extends ap{static get observedAttributes(){return[...super.observedAttributes,d.MEDIA_AUDIO_TRACK_ENABLED,d.MEDIA_AUDIO_TRACK_UNAVAILABLE]}init(){let e=G.createElement("media-audio-track-button");e.part.add("button"),e.preventClick=!0;let t=G.createElement("media-audio-track-listbox");t.part.add("listbox"),t.setAttribute("exportparts","option, option-selected, indicator");let i=this.shadowRoot.querySelector("slot[name=button]"),a=this.shadowRoot.querySelector("slot[name=listbox]");i.textContent="",a.textContent="",i.append(e),a.append(t)}});var aF=i(54125),a$=i(93041).Z,aj=class extends Error{constructor(e,t=aj.MEDIA_ERR_CUSTOM,i,a){var r;super(e),this.name="MediaError",this.code=t,this.context=a,this.fatal=null!=i?i:t>=aj.MEDIA_ERR_NETWORK&&t<=aj.MEDIA_ERR_ENCRYPTED,this.message||(this.message=null!=(r=aj.defaultMessages[this.code])?r:"")}},aK=aj;aK.MEDIA_ERR_ABORTED=1,aK.MEDIA_ERR_NETWORK=2,aK.MEDIA_ERR_DECODE=3,aK.MEDIA_ERR_SRC_NOT_SUPPORTED=4,aK.MEDIA_ERR_ENCRYPTED=5,aK.MEDIA_ERR_CUSTOM=100,aK.defaultMessages={1:"You aborted the media playback",2:"A network error caused the media download to fail.",3:"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.",4:"An unsupported error occurred. The server or network failed, or your browser does not support this format.",5:"The media is encrypted and there are no keys to decrypt it."};var aY=e=>null==e,aG=(e,t)=>!aY(t)&&e in t,aQ={ANY:"any",MUTED:"muted"},aZ={ON_DEMAND:"on-demand",LIVE:"live",UNKNOWN:"unknown"},az={MSE:"mse",NATIVE:"native"},aX={HEADER:"header",QUERY:"query",NONE:"none"},aJ=Object.values(aX),a0={M3U8:"application/vnd.apple.mpegurl",MP4:"video/mp4"},a1={HLS:a0.M3U8};Object.keys(a1),[...Object.values(a0)];var a2=(e,t,i,a,r=e)=>{r.addEventListener(t,i,a),e.addEventListener("teardown",()=>{r.removeEventListener(t,i)},{once:!0})},a5=e=>{let t=e.indexOf("?");return t<0?[e]:[e.slice(0,t),e.slice(t)]},a3=e=>{let t=e.type;if(t){let e=t.toUpperCase();return aG(e,a1)?a1[e]:t}let{src:i}=e;return i?a8(i):""},a4=e=>"VOD"===e?aZ.ON_DEMAND:aZ.LIVE,a7=e=>"EVENT"===e?Number.POSITIVE_INFINITY:"VOD"===e?Number.NaN:0,a8=e=>{let t="";try{t=new URL(e).pathname}catch{console.error("invalid url")}let i=t.lastIndexOf(".");if(i<0)return"";let a=t.slice(i+1).toUpperCase();return aG(a,a0)?a0[a]:""},a6=Object.values(aQ),a9=e=>"boolean"==typeof e||"string"==typeof e&&a6.includes(e),re=({autoplay:e},t,i)=>{let a=!1,r=!1,n=a9(e)?e:!!e,s=()=>{a||a2(t,"playing",()=>{a=!0},{once:!0})};if(s(),a2(t,"loadstart",()=>{a=!1,s(),rt(t,n)},{once:!0}),a2(t,"loadstart",()=>{i||(r=!Number.isFinite(t.duration)),rt(t,n)},{once:!0}),i&&i.once(a$.Events.LEVEL_LOADED,(e,t)=>{var i;r=null!=(i=t.details.live)&&i}),!n){let e=()=>{!r||(null!=i&&i.liveSyncPosition?t.currentTime=i.liveSyncPosition:Number.isFinite(t.seekable.end(0))&&(t.currentTime=t.seekable.end(0)))};i&&a2(t,"play",()=>{"metadata"===t.preload?i.once(a$.Events.LEVEL_UPDATED,e):e()},{once:!0})}return e=>{a||rt(t,n=a9(e)?e:!!e)}},rt=(e,t)=>{if(!t)return;let i=e.muted,a=()=>e.muted=i;switch(t){case aQ.ANY:e.play().catch(()=>{e.muted=!0,e.play().catch(a)});break;case aQ.MUTED:e.muted=!0,e.play().catch(a);break;default:e.play().catch(()=>{})}},ri=({preload:e,src:t},i,a)=>{let r=e=>{null!=e&&["","none","metadata","auto"].includes(e)?i.setAttribute("preload",e):i.removeAttribute("preload")};if(!a)return r(e),r;let n=!1,s=!1,o=a.config.maxBufferLength,l=a.config.maxBufferSize,d=e=>{r(e);let t=null!=e?e:i.preload;s||"none"===t||("metadata"===t?(a.config.maxBufferLength=1,a.config.maxBufferSize=1):(a.config.maxBufferLength=o,a.config.maxBufferSize=l),u())},u=()=>{!n&&t&&(n=!0,a.loadSource(t))};return a2(i,"play",()=>{s=!0,a.config.maxBufferLength=o,a.config.maxBufferSize=l,u()},{once:!0}),d(e),d};function ra(e,t,i,a,r){let n=document.createElement("track");return n.kind=t,n.label=i,a&&(n.srclang=a),r&&(n.id=r),n.track.mode=["subtitles","captions"].includes(t)?"disabled":"hidden",n.setAttribute("data-removeondestroy",""),e.append(n),n.track}var rr="cuepoints",rn=Object.freeze({label:rr}),rs=(e,{label:t=rr}=rn)=>{var i;return null==(i=Array.from(e.querySelectorAll("track")).find(e=>e.track.label===t&&"metadata"===e.track.kind))?void 0:i.track};async function ro(e,t,i=rn){let a=rs(e,i);if(!a){let{label:t=rr}=i;(a=ra(e,"metadata",t)).mode="hidden",await new Promise(e=>setTimeout(()=>e(void 0),0))}return"hidden"!==a.mode&&(a.mode="hidden"),[...t].sort(({time:e},{time:t})=>t-e).forEach(({time:t,value:i})=>{var r,n;let s=Array.prototype.findIndex.call(null==a?void 0:a.cues,e=>e.startTime>=t),o=null==(r=null==a?void 0:a.cues)?void 0:r[s],l=o?o.startTime:Number.isFinite(e.duration)?e.duration:Number.MAX_SAFE_INTEGER,d=null==(n=null==a?void 0:a.cues)?void 0:n[s-1];d&&(d.endTime=t);let u=new VTTCue(t,l,JSON.stringify(null!=i?i:null));a.addCue(u)}),a}var rl=e=>({time:e.startTime,value:JSON.parse(e.text)});function rd(e,t={label:rr}){var i,a;let r=rs(e,t);if(!(null!=(i=null==r?void 0:r.activeCues)&&i.length))return;let{currentTime:n}=e;return rl(Array.prototype.find.call(null!=(a=r.activeCues)?a:[],({startTime:e,endTime:t})=>e<=n&&t>n))}async function ru(e,t=rn){return new Promise(i=>{a2(e,"loadstart",async()=>{let a=await ro(e,[],t);a2(e,"cuechange",()=>{let t=rd(e);if(t){let i=new CustomEvent("cuepointchange",{composed:!0,bubbles:!0,detail:t});e.dispatchEvent(i)}},{},a),i(a)})})}var rc,rh,rm,rp,rv,rb,rE,rf,rg,r_,ry,rA,rT,rk,rw,rI,rS,rL,rD,rR,rM,rC,rO,rx,rN,rP,rU,rB,rW,rV,rq,rH,rF,r$,rj,rK,rY,rG,rQ,rZ,rz,rX,rJ,r0,r1,r2,r5,r3,r4,r7,r8,r6,r9,ne,nt,ni,na,nr,nn,ns,no,nl,nd,nu,nc,nh,nm,np,nv,nb,nE,nf,ng,n_,ny,nA,nT,nk,nw,nI,nS,nL,nD,nR,nM,nC,nO,nx,nN,nP,nU,nB,nW,nV,nq,nH,nF,n$,nj,nK,nY,nG,nQ,nZ,nz,nX,nJ,n0,n1,n2,n5,n3,n4,n7,n8,n6,n9,se,st,si=async e=>fetch(e).then(e=>e.text()).then(e=>{let t=e.split(`
`).find((e,t,i)=>t&&i[t-1].startsWith("#EXT-X-STREAM-INF"));return fetch(t).then(e=>e.text()).then(e=>e.split(`
`))}),sa=e=>{var t,i;let a=null==(i=(null!=(t=e.find(e=>e.startsWith("#EXT-X-PLAYLIST-TYPE")))?t:"").split(":")[1])?void 0:i.trim(),r=a4(a),n=a7(a),s;if(r===aZ.LIVE){let t=e.find(e=>e.startsWith("#EXT-X-PART-INF"));s=t?2*+t.split(":")[1].split("=")[1]:3*+e.find(e=>e.startsWith("#EXT-X-TARGETDURATION")).split(":")[1]}return{streamType:r,targetLiveWindow:n,liveEdgeStartOffset:s}},sr=async(e,t)=>t===a0.MP4?{streamType:aZ.ON_DEMAND,targetLiveWindow:Number.NaN,liveEdgeStartOffset:void 0}:t===a0.M3U8?sa(await si(e)):(console.error(`Media type ${t} is an unrecognized or unsupported type for src ${e}.`),{streamType:void 0,targetLiveWindow:void 0,liveEdgeStartOffset:void 0}),sn=async(e,t,i=a3({src:e}))=>{var a,r,n;let{streamType:s,targetLiveWindow:o,liveEdgeStartOffset:l}=await sr(e,i);(null!=(a=sd.get(t))?a:{}).liveEdgeStartOffset=l,(null!=(r=sd.get(t))?r:{}).targetLiveWindow=o,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(n=sd.get(t))?n:{}).streamType=s,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},ss=e=>{var t;let i=e.type,a=a4(i),r=a7(i),n,s=!!(null!=(t=e.partList)&&t.length);return a===aZ.LIVE&&(n=s?2*e.partTarget:3*e.targetduration),{streamType:a,targetLiveWindow:r,liveEdgeStartOffset:n,lowLatency:s}},so=(e,t,i)=>{var a,r,n,s,o,l,d,u;let{streamType:c,targetLiveWindow:h,liveEdgeStartOffset:m,lowLatency:p}=ss(e);if(c===aZ.LIVE){p?(i.config.backBufferLength=null!=(a=i.userConfig.backBufferLength)?a:4,i.config.maxFragLookUpTolerance=null!=(r=i.userConfig.maxFragLookUpTolerance)?r:.001,i.config.abrBandWidthUpFactor=null!=(n=i.userConfig.abrBandWidthUpFactor)?n:i.config.abrBandWidthFactor):i.config.backBufferLength=null!=(s=i.userConfig.backBufferLength)?s:8;let e=Object.freeze({get length(){return t.seekable.length},start:e=>t.seekable.start(e),end(e){var a;return e>this.length?t.seekable.end(e):null!=(a=i.liveSyncPosition)?a:t.seekable.end(e)}});(null!=(o=sd.get(t))?o:{}).seekable=e}(null!=(l=sd.get(t))?l:{}).liveEdgeStartOffset=m,(null!=(d=sd.get(t))?d:{}).targetLiveWindow=h,t.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),(null!=(u=sd.get(t))?u:{}).streamType=c,t.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},sl=-1!==(null!=(se=null==(n9=null==globalThis?void 0:globalThis.navigator)?void 0:n9.userAgent)?se:"").toLowerCase().indexOf("android"),sd=new WeakMap,su="mux.com",sc=null==(st=a$.isSupported)?void 0:st.call(a$),sh=()=>aF.utils.now(),sm=aF.utils.generateUUID,sp=(e,{domain:t=su,maxResolution:i=""}={})=>{if(!e)return;let[a,r=""]=a5(e),n=new URL(`https://stream.${t}/${a}.m3u8${r}`);return i&&n.searchParams.set("max_resolution",i),n.toString()},sv=e=>{if(!e)return;let[t]=e.split("?");return t||void 0},sb=e=>{if(!e||!e.startsWith("https://stream."))return;let[t]=new URL(e).pathname.slice(1).split(".m3u8");return t||void 0},sE=e=>{var t,i,a;return null!=(t=null==e?void 0:e.metadata)&&t.video_id?e.metadata.video_id:sC(e)&&null!=(a=null!=(i=sv(e.playbackId))?i:sb(e.src))?a:e.src},sf=e=>{var t;return null==(t=sd.get(e))?void 0:t.error},sg=e=>{var t,i;return null!=(i=null==(t=sd.get(e))?void 0:t.streamType)?i:aZ.UNKNOWN},s_=e=>{var t,i;return null!=(i=null==(t=sd.get(e))?void 0:t.targetLiveWindow)?i:Number.NaN},sy=e=>{var t,i;return null!=(i=null==(t=sd.get(e))?void 0:t.seekable)?i:e.seekable},sA=e=>{var t;let i=null==(t=sd.get(e))?void 0:t.liveEdgeStartOffset;if("number"!=typeof i)return Number.NaN;let a=sy(e);return a.length?a.end(a.length-1)-i:Number.NaN},sT=(e,t,i=.001)=>Math.abs(e-t)<=i,sk=(e,t,i=.001)=>e>t||sT(e,t,i),sw=e=>e.paused&&sk(e.currentTime,e.duration),sI=(e,t)=>e.loop||t?e.ended:e.ended||sw(e),sS=(e,t,i)=>{sL(t,i);let{metadata:a={}}=e,{view_session_id:r=sm()}=a,n=sE(e);a.view_session_id=r,a.video_id=n,e.metadata=a,sd.set(t,{});let s=sR(e,t);sO(e,t,s),sx(e,t,s),ru(t);let o=re(e,t,s),l=ri(e,t,s);return{engine:s,setAutoplay:o,setPreload:l}},sL=(e,t)=>{let i=null==t?void 0:t.engine;i&&(i.detachMedia(),i.destroy()),(null==e?void 0:e.mux)&&!e.mux.deleted&&(e.mux.destroy(),delete e.mux),e&&(e.removeAttribute("src"),e.load(),e.removeEventListener("error",sP),e.removeEventListener("error",sU),e.removeEventListener("durationchange",sN),sd.delete(e),e.dispatchEvent(new Event("teardown")))};function sD(e,t){var i;let a=a3(e);if(a!==a0.M3U8)return!0;let r=!a||null==(i=t.canPlayType(a))||i,{preferPlayback:n}=e,s=n===az.MSE,o=n===az.NATIVE;return r&&(o||!(sc&&(s||sl)))}var sR=(e,t)=>{let{debug:i,streamType:a,startTime:r=-1,metadata:n,preferCmcd:s}=e,o=a3(e)===a0.M3U8,l=sD(e,t);if(o&&!l&&sc){let e=sM(a),t=s!==aX.NONE?{useHeaders:s===aX.HEADER,sessionId:null==n?void 0:n.view_session_id,contentId:null==n?void 0:n.video_id}:void 0;return new a$({debug:i,startPosition:r,cmcd:t,backBufferLength:30,renderTextTracksNatively:!1,liveDurationInfinity:!0,capLevelToPlayerSize:!0,capLevelOnFPSDrop:!0,...e})}},sM=e=>e===aZ.LIVE?{backBufferLength:8}:{},sC=({playbackId:e,src:t,customDomain:i})=>{if(e)return!0;if("string"!=typeof t)return!1;let a=null==window?void 0:window.location.href,r=new URL(t,a).hostname.toLocaleLowerCase();return r.includes(su)||!!i&&r.includes(i.toLocaleLowerCase())},sO=(e,t,i)=>{var a;let{envKey:r}=e,n=sC(e);if(r||n){let{playerInitTime:n,playerSoftwareName:s,playerSoftwareVersion:o,beaconCollectionDomain:l,debug:d,disableCookies:u}=e,c={...e.metadata,video_title:(null==(a=null==e?void 0:e.metadata)?void 0:a.video_title)||void 0};aF.monitor(t,{debug:d,beaconCollectionDomain:l,hlsjs:i,Hls:i?a$:void 0,automaticErrorTracking:!1,errorTranslator:t=>"string"!=typeof t.player_error_code&&("function"==typeof e.errorTranslator?e.errorTranslator(t):t),disableCookies:u,data:{...r?{env_key:r}:{},player_software_name:s,player_software:s,player_software_version:o,player_init_time:n,...c}})}},sx=(e,t,i)=>{var a;let r=sD(e,t),{src:n}=e;if(t&&r){let i=a3(e);"string"==typeof n?("none"===t.preload?a2(t,"loadstart",()=>sn(n,t,i)):sn(n,t,i),t.setAttribute("src",n),e.startTime&&((null!=(a=sd.get(t))?a:{}).startTime=e.startTime,t.addEventListener("durationchange",sN,{once:!0}))):t.removeAttribute("src"),t.addEventListener("error",sP),t.addEventListener("error",sU),t.addEventListener("emptied",()=>{t.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})},{once:!0});let r=()=>{t.ended||!sI(t)||t.dispatchEvent(new Event("ended"))};a2(t,"pause",r),a2(t,"seeked",r),a2(t,"play",()=>{t.ended||!sk(t.currentTime,t.duration)||(t.currentTime=t.seekable.start(0))})}else i&&n?(i.once(a$.Events.LEVEL_LOADED,(e,a)=>{so(a.details,t,i)}),i.on(a$.Events.ERROR,(e,i)=>{let a={[a$.ErrorTypes.NETWORK_ERROR]:aK.MEDIA_ERR_NETWORK,[a$.ErrorTypes.MEDIA_ERROR]:aK.MEDIA_ERR_DECODE},r=new aK("",a[i.type]);r.fatal=i.fatal,r.data=i,t.dispatchEvent(new CustomEvent("error",{detail:r}))}),t.addEventListener("error",sU),function(e,t){if(!("videoTracks"in e))return;let i=new WeakMap;t.on(a$.Events.MANIFEST_PARSED,function(t,a){s();let r=e.addVideoTrack("main");for(let[e,t]of(r.selected=!0,a.levels.entries())){let a=r.addRendition(t.url[0],t.width,t.height,t.videoCodec,t.bitrate);i.set(t,`${e}`),a.id=`${e}`}}),t.on(a$.Events.AUDIO_TRACKS_UPDATED,function(t,i){for(let t of(n(),i.audioTracks)){let i=t.default?"main":"alternative",a=e.addAudioTrack(i,t.name,t.lang);a.id=`${t.id}`,t.default&&(a.enabled=!0)}}),e.audioTracks.addEventListener("change",()=>{t.audioTrack=[...e.audioTracks].find(e=>e.enabled).id}),t.on(a$.Events.LEVELS_UPDATED,function(t,a){var r;let n=e.videoTracks[null!=(r=e.videoTracks.selectedIndex)?r:0];if(!n)return;let s=a.levels.map(e=>i.get(e));for(let t of e.videoRenditions)t.id&&!s.includes(t.id)&&n.removeRendition(t)});let a=i=>{let a=e.currentTime,r=!1,n=(e,t)=>{r||(r=!Number.isFinite(t.endOffset))};t.on(a$.Events.BUFFER_FLUSHING,n),t.nextLevel=i,t.off(a$.Events.BUFFER_FLUSHING,n),r||t.trigger(a$.Events.BUFFER_FLUSHING,{startOffset:a+10,endOffset:1/0,type:"video"})};e.videoRenditions.addEventListener("change",e=>{let i=e.target.selectedIndex;i!=t.nextLevel&&a(i)});let r=()=>{for(let t of e.videoTracks)e.removeVideoTrack(t)},n=()=>{for(let t of e.audioTracks)e.removeAudioTrack(t)},s=()=>{r(),n()};t.once(a$.Events.DESTROYING,s)}(e,i),function(e,t){t.on(a$.Events.NON_NATIVE_TEXT_TRACKS_FOUND,(i,{tracks:a})=>{a.forEach(i=>{var a;let r=null!=(a=i.subtitleTrack)?a:i.closedCaptions,n=t.subtitleTracks.findIndex(({lang:e,name:t,type:a})=>e==(null==r?void 0:r.lang)&&t===i.label&&a.toLowerCase()===i.kind);ra(e,i.kind,i.label,null==r?void 0:r.lang,`${i.kind}${n}`)})});let i=()=>{var i;if(!t.subtitleTracks.length)return;let a=Array.from(e.textTracks).find(e=>e.id&&"showing"===e.mode&&["subtitles","captions"].includes(e.kind)),r=`${null==(i=t.subtitleTracks[t.subtitleTrack])?void 0:i.type.toLowerCase()}${t.subtitleTrack}`;if(a&&(t.subtitleTrack<0||(null==a?void 0:a.id)!==r)){let e=t.subtitleTracks.findIndex(({lang:e,name:t,type:i})=>e==a.language&&t===a.label&&i.toLowerCase()===a.kind);t.subtitleTrack=e}a&&(null==a?void 0:a.id)===r&&a.cues&&Array.from(a.cues).forEach(e=>{a.addCue(e)})};e.textTracks.addEventListener("change",i),t.on(a$.Events.CUES_PARSED,(t,{track:i,cues:a})=>{let r=e.textTracks.getTrackById(i);if(!r)return;let n="disabled"===r.mode;n&&(r.mode="hidden"),a.forEach(e=>{var t;null!=(t=r.cues)&&t.getCueById(e.id)||r.addCue(e)}),n&&(r.mode="disabled")}),t.once(a$.Events.DESTROYING,()=>{e.textTracks.removeEventListener("change",i),e.querySelectorAll("track[data-removeondestroy]").forEach(e=>{e.remove()})});let a=()=>{Array.from(e.textTracks).forEach(t=>{var i,a;if(!["subtitles","caption"].includes(t.kind)&&"thumbnails"===t.label){if(!(null!=(i=t.cues)&&i.length)){let t=e.querySelector('track[label="thumbnails"]'),i=null!=(a=null==t?void 0:t.getAttribute("src"))?a:"";null==t||t.removeAttribute("src"),setTimeout(()=>{null==t||t.setAttribute("src",i)},0)}"hidden"!==t.mode&&(t.mode="hidden")}})};t.once(a$.Events.MANIFEST_LOADED,a),t.once(a$.Events.MEDIA_ATTACHED,a)}(t,i),i.attachMedia(t)):console.error("It looks like the video you're trying to play will not work on this system! If possible, try upgrading to the newest versions of your browser or software.")};function sN(e){var t;let i=e.target,a=null==(t=sd.get(i))?void 0:t.startTime;if(a&&function(e,t,i){t&&i>t&&(i=t);for(let t=0;t<e.length;t++)if(e.start(t)<=i&&e.end(t)>=i)return!0;return!1}(i.seekable,i.duration,a)){let e="auto"===i.preload;e&&(i.preload="none"),i.currentTime=a,e&&(i.preload="auto")}}async function sP(e){if(!e.isTrusted)return;e.stopImmediatePropagation();let t=e.target;if(!(null!=t&&t.error))return;let{message:i,code:a}=t.error,r=new aK(i,a);if(t.src&&(a!==aK.MEDIA_ERR_DECODE||void 0!==a))try{let{status:e}=await fetch(t.src);r.data={response:{code:e}}}catch{}t.dispatchEvent(new CustomEvent("error",{detail:r}))}function sU(e){var t,i;if(!(e instanceof CustomEvent)||!(e.detail instanceof aK))return;let a=e.target,r=e.detail;r&&r.fatal&&((null!=(t=sd.get(a))?t:{}).error=r,null==(i=a.mux)||i.emit("error",{player_error_code:r.code,player_error_message:r.message,player_error_context:r.context}))}var sB=Object.defineProperty,sW=(e,t,i)=>t in e?sB(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,sV=(e,t,i)=>(sW(e,"symbol"!=typeof t?t+"":t,i),i),sq=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sH=(e,t,i)=>(sq(e,t,"read from private field"),i?i.call(e):t.get(e)),sF=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},s$=(e,t,i,a)=>(sq(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),sj=(e,t,i)=>(sq(e,t,"access private method"),i),sK=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"undefined"==typeof DocumentFragment&&(globalThis.DocumentFragment=class extends sK{});var sY,sG=class extends sK{},sQ=class{constructor(e,t={}){sF(this,sY,void 0),s$(this,sY,null==t?void 0:t.detail)}get detail(){return sH(this,sY)}initCustomEvent(){}};sY=new WeakMap;var sZ={document:{createElement:function(e,t){return new sG}},DocumentFragment,customElements:{get(e){},define(e,t,i){},upgrade(e){},whenDefined:e=>Promise.resolve(sG)},CustomEvent:sQ,EventTarget:sK,HTMLElement:sG,HTMLVideoElement:class extends sK{}},sz="undefined"==typeof window||void 0===globalThis.customElements,sX=sz?sZ:globalThis;sz&&sZ.document;var sJ=(()=>{try{return"0.16.2"}catch{}return"UNKNOWN"})(),s0=e=>{var t,i,a,r,n,s,o,l,d,u,c,h,m,p,v,b,E,f,g,_,y,A,T,k,w,I,S,L,D,R,M,C,O,x,N,P,U,B,W,V;return t=class extends e{constructor(){super(),sF(this,S),sF(this,D),sF(this,M),sF(this,O),sF(this,N),sF(this,U),sF(this,W),sV(this,"castEnabled",!1),sF(this,y,{paused:!1}),sF(this,A,void 0),sF(this,T,{}),sF(this,k,void 0),sF(this,w,void 0),sF(this,I,void 0),t.instances.add(this),sj(this,N,P).call(this)}static get castElement(){return sH(t,i)}static get castEnabled(){return sH(t,a)}static get castState(){var e;return null==(e=sH(t,d,u))?void 0:e.getCastState()}static async exitCast(){try{await sH(t,d,u).endCurrentSession(!0)}catch(e){console.error(e);return}}get castPlayer(){if(t.castElement===this)return sH(this,A)}attributeChangedCallback(e){if(this.castPlayer)switch(e){case"cast-stream-type":case"cast-src":this.load()}}async requestCast(e={}){sj(t,g,_).call(t,e),s$(t,i,this),Object.entries(sH(this,T)).forEach(([e,t])=>{sH(this,A).controller.addEventListener(e,t)});try{await sH(t,d,u).requestSession()}catch{s$(t,i,void 0);return}sH(this,y).paused=super.paused,super.pause(),this.muted=super.muted;try{await this.load()}catch(e){console.error(e)}}async load(){var e,i;if(!this.castPlayer)return super.load();let a=new chrome.cast.media.MediaInfo(this.castSrc,this.castContentType),r=[...this.querySelectorAll("track")].filter(({kind:e,src:t})=>t&&("subtitles"===e||"captions"===e)),n=[],s=0;r.length&&(a.tracks=r.map(e=>{let t=++s;0===n.length&&"showing"===e.track.mode&&n.push(t);let i=new chrome.cast.media.Track(t,chrome.cast.media.TrackType.TEXT);return i.trackContentId=e.src,i.trackContentType="text/vtt",i.subtype="captions"===e.kind?chrome.cast.media.TextTrackType.CAPTIONS:chrome.cast.media.TextTrackType.SUBTITLES,i.name=e.label,i.language=e.srclang,i})),"live"===this.castStreamType?a.streamType=chrome.cast.media.StreamType.LIVE:a.streamType=chrome.cast.media.StreamType.BUFFERED,a.metadata=new chrome.cast.media.GenericMediaMetadata,a.metadata.title=this.title,a.metadata.images=[{url:this.poster}];let o=new chrome.cast.media.LoadRequest(a);o.currentTime=null!=(e=super.currentTime)?e:0,o.autoplay=!sH(this,y).paused,o.activeTrackIds=n,await (null==(i=sH(t,c,h))?void 0:i.loadMedia(o)),this.dispatchEvent(new Event("volumechange"))}play(){var e;if(this.castPlayer){this.castPlayer.isPaused&&(null==(e=this.castPlayer.controller)||e.playOrPause());return}return super.play()}pause(){var e;if(this.castPlayer){this.castPlayer.isPaused||null==(e=this.castPlayer.controller)||e.playOrPause();return}super.pause()}get castSrc(){var e,t,i;return null!=(i=null!=(t=this.getAttribute("cast-src"))?t:null==(e=this.querySelector("source"))?void 0:e.src)?i:this.currentSrc}set castSrc(e){this.castSrc!=e&&this.setAttribute("cast-src",`${e}`)}get castContentType(){var e;return null!=(e=this.getAttribute("cast-content-type"))?e:void 0}set castContentType(e){this.setAttribute("cast-content-type",`${e}`)}get castStreamType(){var e,t;return null!=(t=null!=(e=this.getAttribute("cast-stream-type"))?e:this.streamType)?t:void 0}set castStreamType(e){this.setAttribute("cast-stream-type",`${e}`)}get readyState(){if(this.castPlayer)switch(this.castPlayer.playerState){case chrome.cast.media.PlayerState.IDLE:return 0;case chrome.cast.media.PlayerState.BUFFERING:return 2;default:return 3}return super.readyState}get paused(){return this.castPlayer?this.castPlayer.isPaused:super.paused}get muted(){var e;return this.castPlayer?null==(e=this.castPlayer)?void 0:e.isMuted:super.muted}set muted(e){var t;if(this.castPlayer){(e&&!this.castPlayer.isMuted||!e&&this.castPlayer.isMuted)&&(null==(t=this.castPlayer.controller)||t.muteOrUnmute());return}super.muted=e}get volume(){var e,t;return this.castPlayer?null!=(t=null==(e=this.castPlayer)?void 0:e.volumeLevel)?t:1:super.volume}set volume(e){var t;if(this.castPlayer){this.castPlayer.volumeLevel=e,null==(t=this.castPlayer.controller)||t.setVolumeLevel();return}super.volume=e}get duration(){var e,t;return this.castPlayer&&sH(this,S,L)?null!=(t=null==(e=this.castPlayer)?void 0:e.duration)?t:NaN:super.duration}get currentTime(){var e,t;return this.castPlayer&&sH(this,S,L)?null!=(t=null==(e=this.castPlayer)?void 0:e.currentTime)?t:0:super.currentTime}set currentTime(e){var t;if(this.castPlayer){this.castPlayer.currentTime=e,null==(t=this.castPlayer.controller)||t.seek();return}super.currentTime=e}get onentercast(){return sH(this,k)}set onentercast(e){sH(this,k)&&(this.removeEventListener("entercast",sH(this,k)),s$(this,k,null)),"function"==typeof e&&(s$(this,k,e),this.addEventListener("entercast",e))}get onleavecast(){return sH(this,w)}set onleavecast(e){sH(this,w)&&(this.removeEventListener("leavecast",sH(this,w)),s$(this,w,null)),"function"==typeof e&&(s$(this,w,e),this.addEventListener("leavecast",e))}get oncastchange(){return sH(this,I)}set oncastchange(e){sH(this,I)&&(this.removeEventListener("castchange",sH(this,I)),s$(this,I,null)),"function"==typeof e&&(s$(this,I,e),this.addEventListener("castchange",e))}},i=new WeakMap,a=new WeakMap,r=new WeakMap,n=new WeakSet,s=function(){return"undefined"!=typeof chrome&&chrome.cast&&chrome.cast.isAvailable},o=new WeakSet,l=function(){return"undefined"!=typeof cast&&cast.framework},d=new WeakSet,u=function(){if(sH(t,o,l))return cast.framework.CastContext.getInstance()},c=new WeakSet,h=function(){var e;return null==(e=sH(t,d,u))?void 0:e.getCurrentSession()},m=new WeakSet,p=function(){var e;return null==(e=sH(t,c,h))?void 0:e.getSessionObj().media[0]},v=new WeakSet,b=function(e){return new Promise((i,a)=>{sH(t,m,p).editTracksInfo(e,i,a)})},E=new WeakSet,f=function(e){return new Promise((i,a)=>{sH(t,m,p).getStatus(e,i,a)})},g=new WeakSet,_=function(e){return sH(t,d,u).setOptions({receiverApplicationId:chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,autoJoinPolicy:chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,androidReceiverCompatible:!1,language:"en-US",resumeSavedSession:!0,...e})},y=new WeakMap,A=new WeakMap,T=new WeakMap,k=new WeakMap,w=new WeakMap,I=new WeakMap,S=new WeakSet,L=function(){var e;return null==(e=this.castPlayer)?void 0:e.isMediaLoaded},D=new WeakSet,R=function(){sH(t,i)===this&&(Object.entries(sH(this,T)).forEach(([e,t])=>{sH(this,A).controller.removeEventListener(e,t)}),s$(t,i,void 0),this.muted=sH(this,A).isMuted,this.currentTime=sH(this,A).savedPlayerState.currentTime,!1===sH(this,A).savedPlayerState.isPaused&&this.play())},M=new WeakSet,C=function(){this.dispatchEvent(new CustomEvent("castchange",{detail:sH(t,d,u).getCastState()}))},O=new WeakSet,x=async function(){var e;let{SESSION_RESUMED:a}=cast.framework.SessionState;if(sH(t,d,u).getSessionState()===a&&this.castSrc===(null==(e=sH(t,m,p))?void 0:e.media.contentId)){s$(t,i,this),Object.entries(sH(this,T)).forEach(([e,t])=>{sH(this,A).controller.addEventListener(e,t)});try{await sj(t,E,f).call(t,new chrome.cast.media.GetStatusRequest)}catch(e){console.error(e)}sH(this,T)[cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED](),sH(this,T)[cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED]()}},N=new WeakSet,P=function(){!sH(t,o,l)||this.castEnabled||(this.castEnabled=!0,sj(t,g,_).call(t),this.textTracks.addEventListener("change",sj(this,W,V).bind(this)),sj(this,M,C).call(this),s$(this,A,new cast.framework.RemotePlayer),new cast.framework.RemotePlayerController(sH(this,A)),s$(this,T,{[cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED]:({value:e})=>{!1===e&&sj(this,D,R).call(this),this.dispatchEvent(new Event(e?"entercast":"leavecast"))},[cast.framework.RemotePlayerEventType.DURATION_CHANGED]:()=>{this.dispatchEvent(new Event("durationchange"))},[cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED]:()=>{this.dispatchEvent(new Event("volumechange"))},[cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED]:()=>{this.dispatchEvent(new Event("volumechange"))},[cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED]:()=>{sH(this,S,L)&&this.dispatchEvent(new Event("timeupdate"))},[cast.framework.RemotePlayerEventType.VIDEO_INFO_CHANGED]:()=>{this.dispatchEvent(new Event("resize"))},[cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED]:()=>{this.dispatchEvent(new Event(this.paused?"pause":"play"))},[cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED]:()=>{var e,t;(null==(e=this.castPlayer)?void 0:e.playerState)!==chrome.cast.media.PlayerState.PAUSED&&this.dispatchEvent(new Event({[chrome.cast.media.PlayerState.PLAYING]:"playing",[chrome.cast.media.PlayerState.BUFFERING]:"waiting",[chrome.cast.media.PlayerState.IDLE]:"emptied"}[null==(t=this.castPlayer)?void 0:t.playerState]))},[cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED]:async()=>{sH(this,S,L)&&(await Promise.resolve(),sj(this,U,B).call(this))}}))},U=new WeakSet,B=function(){sj(this,W,V).call(this)},W=new WeakSet,V=async function(){var e,i,a,r,n,s;if(!this.castPlayer)return;let o=(null!=(i=null==(e=sH(this,A).mediaInfo)?void 0:e.tracks)?i:[]).filter(({type:e})=>e===chrome.cast.media.TrackType.TEXT),l=[...this.textTracks].filter(({kind:e})=>"subtitles"===e||"captions"===e),d=o.map(({language:e,name:t,trackId:i})=>{var a;let{mode:r}=null!=(a=l.find(i=>i.language===e&&i.label===t))?a:{};return!!r&&{mode:r,trackId:i}}).filter(Boolean),u=d.filter(({mode:e})=>"showing"!==e).map(({trackId:e})=>e),m=d.find(({mode:e})=>"showing"===e),p=null!=(n=null==(r=null==(a=sH(t,c,h))?void 0:a.getSessionObj().media[0])?void 0:r.activeTrackIds)?n:[],E=p;if(p.length&&(E=E.filter(e=>!u.includes(e))),null!=m&&m.trackId&&(E=[...E,m.trackId]),s=E=[...new Set(E)],!(p.length===s.length&&p.every(e=>s.includes(e))))try{let e=new chrome.cast.media.EditTracksInfoRequest(E);await sj(t,v,b).call(t,e)}catch(e){console.error(e)}},sF(t,n),sF(t,o),sF(t,d),sF(t,c),sF(t,m),sF(t,v),sF(t,E),sF(t,g),sV(t,"observedAttributes",["cast-src","cast-content-type","cast-stream-type"]),sV(t,"instances",new Set),sF(t,i,void 0),sF(t,a,!1),sV(t,"initCast",()=>{sH(t,n,s)?sH(t,o,l)?sH(t,r).call(t,chrome.cast.isAvailable):customElements.whenDefined("google-cast-button").then(()=>sH(t,r).call(t,chrome.cast.isAvailable)):globalThis.__onGCastApiAvailable=()=>{customElements.whenDefined("google-cast-button").then(()=>sH(t,r).call(t,chrome.cast.isAvailable))}}),sF(t,r,e=>{if(e){s$(t,a,!0);let{CAST_STATE_CHANGED:e}=cast.framework.CastContextEventType;sH(t,d,u).addEventListener(e,e=>{t.instances.forEach(t=>sj(t,M,C).call(t,e))});let{SESSION_STATE_CHANGED:i}=cast.framework.CastContextEventType;sH(t,d,u).addEventListener(i,e=>{t.instances.forEach(t=>sj(t,O,x).call(t,e))}),t.instances.forEach(e=>sj(e,N,P).call(e))}}),t},s1=globalThis.HTMLVideoElement?s0(HTMLVideoElement):s0(Object);globalThis.customElements&&!globalThis.customElements.get("castable-video")&&(customElements.define("castable-video",s1,{extends:"video"}),globalThis.CastableVideoElement=s1),s1.initCast();var s2,s5=["abort","canplay","canplaythrough","durationchange","emptied","encrypted","ended","error","loadeddata","loadedmetadata","loadstart","pause","play","playing","progress","ratechange","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","waitingforkey","resize","enterpictureinpicture","leavepictureinpicture","webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"],s3=null==(s2=globalThis.document)?void 0:s2.createElement("template");s3&&(s3.innerHTML=`
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      audio {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
      }
    </style>
    <slot></slot>
  `);var s4,s7=null==(s4=globalThis.document)?void 0:s4.createElement("template");s7&&(s7.innerHTML=`
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, 50% 50%);
      }

      video::-webkit-media-text-track-container {
        transform: var(--media-webkit-text-track-transform);
        transition: var(--media-webkit-text-track-transition);
      }
    </style>
    <slot></slot>
  `);var s8=(e,{tag:t,is:i})=>{var a,r,n,s,o,l,d,u,c,h,m,p,v;let b=null==(a=globalThis.document)?void 0:a.createElement(t,{is:i}),E=b?function(e){let t=[];for(let i=Object.getPrototypeOf(e);i&&i!==HTMLElement.prototype;i=Object.getPrototypeOf(i))t.push(...Object.getOwnPropertyNames(i));return t}(b):[];return r=class extends e{constructor(){super(),sF(this,u),sF(this,h),sF(this,p),sF(this,l,void 0),sF(this,d,void 0),this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.append(this.constructor.template.content.cloneNode(!0)))}static get observedAttributes(){var e,t;return sj(r,s,o).call(r),[...null!=(t=null==(e=null==b?void 0:b.constructor)?void 0:e.observedAttributes)?t:[],"autopictureinpicture","disablepictureinpicture","disableremoteplayback","autoplay","controls","controlslist","crossorigin","loop","muted","playsinline","poster","preload","src"]}get nativeEl(){var e,i;return null!=(i=null!=(e=sH(this,d))?e:this.shadowRoot.querySelector(t))?i:this.querySelector(t)}set nativeEl(e){s$(this,d,e)}get defaultMuted(){return this.hasAttribute("muted")}set defaultMuted(e){this.toggleAttribute("muted",!!e)}get src(){return this.getAttribute("src")}set src(e){this.setAttribute("src",`${e}`)}get preload(){var e,t;return null!=(t=this.getAttribute("preload"))?t:null==(e=this.nativeEl)?void 0:e.preload}set preload(e){this.setAttribute("preload",`${e}`)}attributeChangedCallback(e,t,i){sj(this,u,c).call(this),sj(this,p,v).call(this,e,t,i)}connectedCallback(){sj(this,u,c).call(this)}},n=new WeakMap,s=new WeakSet,o=function(){if(sH(this,n))return;s$(this,n,!0);let e=new Set(this.observedAttributes);for(let t of(e.delete("muted"),E))if(!(t in this.prototype)){if("function"==typeof b[t])this.prototype[t]=function(...e){return sj(this,u,c).call(this),this.call?this.call(t,...e):this.nativeEl[t].apply(this.nativeEl,e)};else{let i={get(){var i,a,r;sj(this,u,c).call(this);let n=t.toLowerCase();if(e.has(n)){let e=this.getAttribute(n);return null!==e&&(""===e||e)}return null!=(r=null==(i=this.get)?void 0:i.call(this,t))?r:null==(a=this.nativeEl)?void 0:a[t]}};t!==t.toUpperCase()&&(i.set=function(i){sj(this,u,c).call(this);let a=t.toLowerCase();if(e.has(a)){!0===i||!1===i||null==i?this.toggleAttribute(a,!!i):this.setAttribute(a,i);return}if(this.set){this.set(t,i);return}this.nativeEl[t]=i}),Object.defineProperty(this.prototype,t,i)}}},l=new WeakMap,d=new WeakMap,u=new WeakSet,c=function(){var e,a;if(sH(this,l))return;if(s$(this,l,!0),!this.nativeEl){let e=document.createElement(t,{is:i});e.part=t,this.shadowRoot.append(e)}for(let e of(this.nativeEl.muted=this.hasAttribute("muted"),E))sj(this,h,m).call(this,e);let r=new Map,n=this.shadowRoot.querySelector("slot:not([name])");for(let t of(null==n||n.addEventListener("slotchange",()=>{let e=new Map(r);n.assignedElements().filter(e=>["track","source"].includes(e.localName)).forEach(t=>{var i,a;e.delete(t);let n=r.get(t);n||(n=t.cloneNode(),r.set(t,n)),null==(a=(i=this.nativeEl).append)||a.call(i,n)}),e.forEach(e=>e.remove())}),this.constructor.Events))null==(a=(e=this.shadowRoot).addEventListener)||a.call(e,t,e=>{e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{detail:e.detail}))},!0)},h=new WeakSet,m=function(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}},p=new WeakSet,v=function(e,t,i){var a,r,n,s;["id","class"].includes(e)||(null===i?null==(r=(a=this.nativeEl).removeAttribute)||r.call(a,e):null==(s=(n=this.nativeEl).setAttribute)||s.call(n,e,i))},sF(r,s),sV(r,"Events",s5),sV(r,"template",t.endsWith("audio")?s3:s7),sF(r,n,void 0),r};globalThis.document&&s8(HTMLElement,{tag:"video"}),globalThis.document&&s8(HTMLElement,{tag:"audio"});var s6=class extends Event{constructor(e,t){super(e),sV(this,"track"),this.track=t.track}},s9=new WeakMap;function oe(e){var t;let i;return null!=(t=s9.get(e))?t:((i=s9.get(e))||s9.set(e,i={}),Object.assign(i,{}))}function ot(e,t){let i=e.videoTracks;oe(t).media=e,oe(t).renditionSet||(oe(t).renditionSet=new Set);let a=oe(i).trackSet;a.add(t);let r=a.size-1;r in ol.prototype||Object.defineProperty(ol.prototype,r,{get(){return[...oe(this).trackSet][r]}}),queueMicrotask(()=>{i.dispatchEvent(new s6("addtrack",{track:t}))})}function oi(e){var t;let i=null==(t=oe(e).media)?void 0:t.videoTracks;i&&(oe(i).trackSet.delete(e),queueMicrotask(()=>{i.dispatchEvent(new s6("removetrack",{track:e}))}))}var oa,or,on,os,oo,ol=class extends EventTarget{constructor(){super(),sF(this,os),sF(this,oa,void 0),sF(this,or,void 0),sF(this,on,void 0),oe(this).trackSet=new Set}[Symbol.iterator](){return sH(this,os,oo).values()}get length(){return sH(this,os,oo).size}getTrackById(e){var t;return null!=(t=[...sH(this,os,oo)].find(t=>t.id===e))?t:null}get selectedIndex(){return[...sH(this,os,oo)].findIndex(e=>e.selected)}get onaddtrack(){return sH(this,oa)}set onaddtrack(e){sH(this,oa)&&(this.removeEventListener("addtrack",sH(this,oa)),s$(this,oa,void 0)),"function"==typeof e&&(s$(this,oa,e),this.addEventListener("addtrack",e))}get onremovetrack(){return sH(this,or)}set onremovetrack(e){sH(this,or)&&(this.removeEventListener("removetrack",sH(this,or)),s$(this,or,void 0)),"function"==typeof e&&(s$(this,or,e),this.addEventListener("removetrack",e))}get onchange(){return sH(this,on)}set onchange(e){sH(this,on)&&(this.removeEventListener("change",sH(this,on)),s$(this,on,void 0)),"function"==typeof e&&(s$(this,on,e),this.addEventListener("change",e))}};oa=new WeakMap,or=new WeakMap,on=new WeakMap,os=new WeakSet,oo=function(){return oe(this).trackSet};var od=class extends Event{constructor(e,t){super(e),sV(this,"rendition"),this.rendition=t.rendition}};function ou(e){return[...oe(e).media.videoTracks].filter(e=>e.selected).flatMap(e=>[...oe(e).renditionSet])}var oc,oh,om,op=class extends EventTarget{constructor(){super(...arguments),sF(this,oc,void 0),sF(this,oh,void 0),sF(this,om,void 0)}[Symbol.iterator](){return ou(this).values()}get length(){return ou(this).length}getRenditionById(e){var t;return null!=(t=ou(this).find(t=>`${t.id}`==`${e}`))?t:null}get selectedIndex(){return ou(this).findIndex(e=>e.selected)}set selectedIndex(e){for(let[t,i]of ou(this).entries())i.selected=t===e}get onaddrendition(){return sH(this,oc)}set onaddrendition(e){sH(this,oc)&&(this.removeEventListener("addrendition",sH(this,oc)),s$(this,oc,void 0)),"function"==typeof e&&(s$(this,oc,e),this.addEventListener("addrendition",e))}get onremoverendition(){return sH(this,oh)}set onremoverendition(e){sH(this,oh)&&(this.removeEventListener("removerendition",sH(this,oh)),s$(this,oh,void 0)),"function"==typeof e&&(s$(this,oh,e),this.addEventListener("removerendition",e))}get onchange(){return sH(this,om)}set onchange(e){sH(this,om)&&(this.removeEventListener("change",sH(this,om)),s$(this,om,void 0)),"function"==typeof e&&(s$(this,om,e),this.addEventListener("change",e))}};oc=new WeakMap,oh=new WeakMap,om=new WeakMap;var ov,ob=class{constructor(){sV(this,"src"),sV(this,"id"),sV(this,"width"),sV(this,"height"),sV(this,"bitrate"),sV(this,"frameRate"),sV(this,"codec"),sF(this,ov,!1)}get selected(){return sH(this,ov)}set selected(e){var t;let i;sH(this,ov)!==e&&(s$(this,ov,e),t=this,(i=oe(t).media.videoRenditions)&&!oe(i).changeRequested&&(oe(i).changeRequested=!0,queueMicrotask(()=>{delete oe(i).changeRequested,oe(t).track.selected&&i.dispatchEvent(new Event("change"))})))}};ov=new WeakMap;var oE,of=class{constructor(){sV(this,"id"),sV(this,"kind"),sV(this,"label",""),sV(this,"language",""),sV(this,"sourceBuffer"),sF(this,oE,!1)}addRendition(e,t,i,a,r,n){var s;let o,l,d,u=new ob;return u.src=e,u.width=t,u.height=i,u.frameRate=n,u.bitrate=r,u.codec=a,s=this,o=oe(s).media.videoRenditions,oe(u).media=oe(s).media,oe(u).track=s,(l=oe(s).renditionSet).add(u),(d=l.size-1)in op.prototype||Object.defineProperty(op.prototype,d,{get(){return ou(this)[d]}}),queueMicrotask(()=>{s.selected&&o.dispatchEvent(new od("addrendition",{rendition:u}))}),u}removeRendition(e){let t,i;t=oe(e).media.videoRenditions,i=oe(e).track,oe(i).renditionSet.delete(e),queueMicrotask(()=>{oe(e).track.selected&&t.dispatchEvent(new od("removerendition",{rendition:e}))})}get selected(){return sH(this,oE)}set selected(e){sH(this,oE)!==e&&(s$(this,oE,e),!0===e&&function(e){var t;let i=null!=(t=oe(e).media.videoTracks)?t:[],a=!1;for(let t of i)t!==e&&(t.selected=!1,a=!0);if(a){if(oe(i).changeRequested)return;oe(i).changeRequested=!0,queueMicrotask(()=>{delete oe(i).changeRequested,i.dispatchEvent(new Event("change"))})}}(this))}};function og(e){return[...oe(e).media.audioTracks].filter(e=>e.enabled).flatMap(e=>[...oe(e).renditionSet])}oE=new WeakMap;var o_,oy,oA,oT=class extends EventTarget{constructor(){super(...arguments),sF(this,o_,void 0),sF(this,oy,void 0),sF(this,oA,void 0)}[Symbol.iterator](){return og(this).values()}get length(){return og(this).length}getRenditionById(e){var t;return null!=(t=og(this).find(t=>`${t.id}`==`${e}`))?t:null}get selectedIndex(){return og(this).findIndex(e=>e.selected)}set selectedIndex(e){for(let[t,i]of og(this).entries())i.selected=t===e}get onaddrendition(){return sH(this,o_)}set onaddrendition(e){sH(this,o_)&&(this.removeEventListener("addrendition",sH(this,o_)),s$(this,o_,void 0)),"function"==typeof e&&(s$(this,o_,e),this.addEventListener("addrendition",e))}get onremoverendition(){return sH(this,oy)}set onremoverendition(e){sH(this,oy)&&(this.removeEventListener("removerendition",sH(this,oy)),s$(this,oy,void 0)),"function"==typeof e&&(s$(this,oy,e),this.addEventListener("removerendition",e))}get onchange(){return sH(this,oA)}set onchange(e){sH(this,oA)&&(this.removeEventListener("change",sH(this,oA)),s$(this,oA,void 0)),"function"==typeof e&&(s$(this,oA,e),this.addEventListener("change",e))}};o_=new WeakMap,oy=new WeakMap,oA=new WeakMap;var ok,ow=class{constructor(){sV(this,"src"),sV(this,"id"),sV(this,"bitrate"),sV(this,"codec"),sF(this,ok,!1)}get selected(){return sH(this,ok)}set selected(e){var t;let i;sH(this,ok)!==e&&(s$(this,ok,e),t=this,(i=oe(t).media.audioRenditions)&&!oe(i).changeRequested&&(oe(i).changeRequested=!0,queueMicrotask(()=>{delete oe(i).changeRequested,oe(t).track.enabled&&i.dispatchEvent(new Event("change"))})))}};function oI(e,t){let i=e.audioTracks;oe(t).media=e,oe(t).renditionSet||(oe(t).renditionSet=new Set);let a=oe(i).trackSet;a.add(t);let r=a.size-1;r in oO.prototype||Object.defineProperty(oO.prototype,r,{get(){return[...oe(this).trackSet][r]}}),queueMicrotask(()=>{i.dispatchEvent(new s6("addtrack",{track:t}))})}function oS(e){var t;let i=null==(t=oe(e).media)?void 0:t.audioTracks;i&&(oe(i).trackSet.delete(e),queueMicrotask(()=>{i.dispatchEvent(new s6("removetrack",{track:e}))}))}ok=new WeakMap;var oL,oD,oR,oM,oC,oO=class extends EventTarget{constructor(){super(),sF(this,oM),sF(this,oL,void 0),sF(this,oD,void 0),sF(this,oR,void 0),oe(this).trackSet=new Set}[Symbol.iterator](){return sH(this,oM,oC).values()}get length(){return sH(this,oM,oC).size}getTrackById(e){var t;return null!=(t=[...sH(this,oM,oC)].find(t=>t.id===e))?t:null}get onaddtrack(){return sH(this,oL)}set onaddtrack(e){sH(this,oL)&&(this.removeEventListener("addtrack",sH(this,oL)),s$(this,oL,void 0)),"function"==typeof e&&(s$(this,oL,e),this.addEventListener("addtrack",e))}get onremovetrack(){return sH(this,oD)}set onremovetrack(e){sH(this,oD)&&(this.removeEventListener("removetrack",sH(this,oD)),s$(this,oD,void 0)),"function"==typeof e&&(s$(this,oD,e),this.addEventListener("removetrack",e))}get onchange(){return sH(this,oR)}set onchange(e){sH(this,oR)&&(this.removeEventListener("change",sH(this,oR)),s$(this,oR,void 0)),"function"==typeof e&&(s$(this,oR,e),this.addEventListener("change",e))}};oL=new WeakMap,oD=new WeakMap,oR=new WeakMap,oM=new WeakSet,oC=function(){return oe(this).trackSet};var ox,oN=class{constructor(){sV(this,"id"),sV(this,"kind"),sV(this,"label",""),sV(this,"language",""),sV(this,"sourceBuffer"),sF(this,ox,!1)}addRendition(e,t,i){var a;let r,n,s,o=new ow;return o.src=e,o.codec=t,o.bitrate=i,a=this,r=oe(a).media.audioRenditions,oe(o).media=oe(a).media,oe(o).track=a,(n=oe(a).renditionSet).add(o),(s=n.size-1)in oT.prototype||Object.defineProperty(oT.prototype,s,{get(){return og(this)[s]}}),queueMicrotask(()=>{a.enabled&&r.dispatchEvent(new od("addrendition",{rendition:o}))}),o}removeRendition(e){let t,i;t=oe(e).media.audioRenditions,i=oe(e).track,oe(i).renditionSet.delete(e),queueMicrotask(()=>{oe(e).track.enabled&&t.dispatchEvent(new od("removerendition",{rendition:e}))})}get enabled(){return sH(this,ox)}set enabled(e){let t;sH(this,ox)!==e&&(s$(this,ox,e),(t=oe(this).media.audioTracks)&&!oe(t).changeRequested&&(oe(t).changeRequested=!0,queueMicrotask(()=>{delete oe(t).changeRequested,t.dispatchEvent(new Event("change"))})))}};ox=new WeakMap;var oP=oB(globalThis.HTMLMediaElement,"video"),oU=oB(globalThis.HTMLMediaElement,"audio");function oB(e,t){var i;if(null!=e&&e.prototype)return null==(i=Object.getOwnPropertyDescriptor(e.prototype,`${t}Tracks`))?void 0:i.get}s5.push("castchange","entercast","leavecast");var oW,oV,oq,oH,oF,o$,oj,oK,oY,oG=function(e){if(!(null!=e&&e.prototype))return e;let t=oB(e,"video");(!t||`${t}`.includes("[native code]"))&&Object.defineProperty(e.prototype,"videoTracks",{get(){return function(e){var t;let i=oe(e).videoTracks;if(!i&&(i=new ol,oe(e).videoTracks=i,oP)){let a=oP.call(null!=(t=e.nativeEl)?t:e);for(let t of a)ot(e,t);a.addEventListener("change",()=>{i.dispatchEvent(new Event("change"))}),a.addEventListener("addtrack",t=>{if([...i].some(e=>e instanceof of)){for(let e of a)oi(e);return}ot(e,t.track)}),a.addEventListener("removetrack",e=>{oi(e.track)})}return i}(this)}});let i=oB(e,"audio");(!i||`${i}`.includes("[native code]"))&&Object.defineProperty(e.prototype,"audioTracks",{get(){return function(e){var t;let i=oe(e).audioTracks;if(!i&&(i=new oO,oe(e).audioTracks=i,oU)){let a=oU.call(null!=(t=e.nativeEl)?t:e);for(let t of a)oI(e,t);a.addEventListener("change",()=>{i.dispatchEvent(new Event("change"))}),a.addEventListener("addtrack",t=>{if([...i].some(e=>e instanceof oN)){for(let e of a)oS(e);return}oI(e,t.track)}),a.addEventListener("removetrack",e=>{oS(e.track)})}return i}(this)}}),"addVideoTrack"in e.prototype||(e.prototype.addVideoTrack=function(e,t="",i=""){let a=new of;return a.kind=e,a.label=t,a.language=i,ot(this,a),a}),"removeVideoTrack"in e.prototype||(e.prototype.removeVideoTrack=oi),"addAudioTrack"in e.prototype||(e.prototype.addAudioTrack=function(e,t="",i=""){let a=new oN;return a.kind=e,a.label=t,a.language=i,oI(this,a),a}),"removeAudioTrack"in e.prototype||(e.prototype.removeAudioTrack=oS),"videoRenditions"in e.prototype||Object.defineProperty(e.prototype,"videoRenditions",{get(){return a(this)}});let a=e=>{let t=oe(e).videoRenditions;return t||(oe(t=new op).media=e,oe(e).videoRenditions=t),t};"audioRenditions"in e.prototype||Object.defineProperty(e.prototype,"audioRenditions",{get(){return r(this)}});let r=e=>{let t=oe(e).audioRenditions;return t||(oe(t=new oT).media=e,oe(e).audioRenditions=t),t};return e}(s8(sX.HTMLElement,{tag:"video",is:"castable-video"})),oQ={BEACON_COLLECTION_DOMAIN:"beacon-collection-domain",CUSTOM_DOMAIN:"custom-domain",DEBUG:"debug",DISABLE_COOKIES:"disable-cookies",ENV_KEY:"env-key",MAX_RESOLUTION:"max-resolution",METADATA_URL:"metadata-url",PLAYBACK_ID:"playback-id",PLAYER_SOFTWARE_NAME:"player-software-name",PLAYER_SOFTWARE_VERSION:"player-software-version",PREFER_CMCD:"prefer-cmcd",PREFER_PLAYBACK:"prefer-playback",START_TIME:"start-time",STREAM_TYPE:"stream-type",TARGET_LIVE_WINDOW:"target-live-window",LIVE_EDGE_OFFSET:"live-edge-offset",TYPE:"type"},oZ=Object.values(oQ),oz=class extends oG{constructor(){super(),sF(this,oK),sF(this,oW,void 0),sF(this,oV,void 0),sF(this,oq,void 0),sF(this,oH,{}),sF(this,oF,void 0),sF(this,o$,void 0),sF(this,oj,void 0),s$(this,oq,sh())}static get observedAttributes(){var e;return[...oZ,...null!=(e=oG.observedAttributes)?e:[]]}get preferCmcd(){var e;return null!=(e=this.getAttribute(oQ.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?aJ.includes(e)?this.setAttribute(oQ.PREFER_CMCD,e):console.warn(`Invalid value for preferCmcd. Must be one of ${aJ.join()}`):this.removeAttribute(oQ.PREFER_CMCD))}get playerInitTime(){return sH(this,oq)}get playerSoftwareName(){var e;return null!=(e=sH(this,o$))?e:"mux-video"}set playerSoftwareName(e){s$(this,o$,e)}get playerSoftwareVersion(){var e;return null!=(e=sH(this,oF))?e:sJ}set playerSoftwareVersion(e){s$(this,oF,e)}get _hls(){var e;return null==(e=sH(this,oW))?void 0:e.engine}get mux(){return this.nativeEl.mux}get error(){var e;return null!=(e=sf(this.nativeEl))?e:null}get errorTranslator(){return sH(this,oj)}set errorTranslator(e){s$(this,oj,e)}get src(){return this.getAttribute("src")}set src(e){e!==this.src&&(null==e?this.removeAttribute("src"):this.setAttribute("src",e))}get type(){var e;return null!=(e=this.getAttribute(oQ.TYPE))?e:void 0}set type(e){e!==this.type&&(e?this.setAttribute(oQ.TYPE,e):this.removeAttribute(oQ.TYPE))}get autoplay(){let e=this.getAttribute("autoplay");return null!==e&&(""===e||e)}set autoplay(e){e!==this.autoplay&&(e?this.setAttribute("autoplay","string"==typeof e?e:""):this.removeAttribute("autoplay"))}get preload(){let e=this.getAttribute("preload");return""===e?"auto":["none","metadata","auto"].includes(e)?e:super.preload}set preload(e){e!=this.getAttribute("preload")&&(["","none","metadata","auto"].includes(e)?this.setAttribute("preload",e):this.removeAttribute("preload"))}get debug(){return null!=this.getAttribute(oQ.DEBUG)}set debug(e){e!==this.debug&&(e?this.setAttribute(oQ.DEBUG,""):this.removeAttribute(oQ.DEBUG))}get disableCookies(){return this.hasAttribute(oQ.DISABLE_COOKIES)}set disableCookies(e){e!==this.disableCookies&&(e?this.setAttribute(oQ.DISABLE_COOKIES,""):this.removeAttribute(oQ.DISABLE_COOKIES))}get startTime(){let e=this.getAttribute(oQ.START_TIME);if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}set startTime(e){e!==this.startTime&&(null==e?this.removeAttribute(oQ.START_TIME):this.setAttribute(oQ.START_TIME,`${e}`))}get playbackId(){var e;return null!=(e=this.getAttribute(oQ.PLAYBACK_ID))?e:void 0}set playbackId(e){e!==this.playbackId&&(e?this.setAttribute(oQ.PLAYBACK_ID,e):this.removeAttribute(oQ.PLAYBACK_ID))}get maxResolution(){var e;return null!=(e=this.getAttribute(oQ.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(oQ.MAX_RESOLUTION,e):this.removeAttribute(oQ.MAX_RESOLUTION))}get customDomain(){var e;return null!=(e=this.getAttribute(oQ.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(oQ.CUSTOM_DOMAIN,e):this.removeAttribute(oQ.CUSTOM_DOMAIN))}get ended(){return sI(this.nativeEl,this._hls)}get envKey(){var e;return null!=(e=this.getAttribute(oQ.ENV_KEY))?e:void 0}set envKey(e){e!==this.envKey&&(e?this.setAttribute(oQ.ENV_KEY,e):this.removeAttribute(oQ.ENV_KEY))}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(oQ.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(oQ.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(oQ.BEACON_COLLECTION_DOMAIN))}get streamType(){var e;return null!=(e=this.getAttribute(oQ.STREAM_TYPE))?e:sg(this.nativeEl)}set streamType(e){e!==this.streamType&&(e?this.setAttribute(oQ.STREAM_TYPE,e):this.removeAttribute(oQ.STREAM_TYPE))}get targetLiveWindow(){return this.hasAttribute(oQ.TARGET_LIVE_WINDOW)?+this.getAttribute(oQ.TARGET_LIVE_WINDOW):s_(this.nativeEl)}set targetLiveWindow(e){e!=this.targetLiveWindow&&(null==e?this.removeAttribute(oQ.TARGET_LIVE_WINDOW):this.setAttribute(oQ.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e,t;if(this.hasAttribute(oQ.LIVE_EDGE_OFFSET)){let{liveEdgeOffset:i}=this,a=null!=(e=this.nativeEl.seekable.end(0))?e:0;return Math.max(null!=(t=this.nativeEl.seekable.start(0))?t:0,a-i)}return sA(this.nativeEl)}get liveEdgeOffset(){if(this.hasAttribute(oQ.LIVE_EDGE_OFFSET))return+this.getAttribute(oQ.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){e!=this.targetLiveWindow&&(null==e?this.removeAttribute(oQ.LIVE_EDGE_OFFSET):this.setAttribute(oQ.LIVE_EDGE_OFFSET,`${+e}`))}get seekable(){return sy(this.nativeEl)}async addCuePoints(e){return ro(this.nativeEl,e)}get activeCuePoint(){return rd(this.nativeEl)}get cuePoints(){return function(e,t={label:rr}){let i=rs(e,t);return null!=i&&i.cues?Array.from(i.cues,e=>rl(e)):[]}(this.nativeEl)}getStartDate(){return function(e,t){if(t){let i=t.playingDate;if(null!=i)return new Date(i.getTime()-1e3*e.currentTime)}return"function"==typeof e.getStartDate?e.getStartDate():new Date(NaN)}(this.nativeEl,this._hls)}get currentPdt(){return function(e,t){if(t&&t.playingDate)return t.playingDate;if("function"==typeof e.getStartDate){let t=e.getStartDate();return new Date(t.getTime()+1e3*e.currentTime)}return new Date(NaN)}(this.nativeEl,this._hls)}get preferPlayback(){let e=this.getAttribute(oQ.PREFER_PLAYBACK);if(e===az.MSE||e===az.NATIVE)return e}set preferPlayback(e){e!==this.preferPlayback&&(e===az.MSE||e===az.NATIVE?this.setAttribute(oQ.PREFER_PLAYBACK,e):this.removeAttribute(oQ.PREFER_PLAYBACK))}get metadata(){return{...this.getAttributeNames().filter(e=>e.startsWith("metadata-")&&![oQ.METADATA_URL].includes(e)).reduce((e,t)=>{let i=this.getAttribute(t);return null!=i&&(e[t.replace(/^metadata-/,"").replace(/-/g,"_")]=i),e},{}),...sH(this,oH)}}set metadata(e){s$(this,oH,null!=e?e:{}),this.mux&&this.mux.emit("hb",sH(this,oH))}load(){s$(this,oW,sS(this,this.nativeEl,sH(this,oW)))}unload(){sL(this.nativeEl,sH(this,oW)),s$(this,oW,void 0)}attributeChangedCallback(e,t,i){var a,r;switch(oG.observedAttributes.includes(e)&&!["src","autoplay","preload"].includes(e)&&super.attributeChangedCallback(e,t,i),e){case oQ.PLAYER_SOFTWARE_NAME:this.playerSoftwareName=null!=i?i:void 0;break;case oQ.PLAYER_SOFTWARE_VERSION:this.playerSoftwareVersion=null!=i?i:void 0;break;case"src":{let e=!!t,a=!!i;!e&&a?sj(this,oK,oY).call(this):e&&!a?this.unload():e&&a&&(this.unload(),sj(this,oK,oY).call(this));break}case"autoplay":if(i===t)break;null==(a=sH(this,oW))||a.setAutoplay(this.autoplay);break;case"preload":if(i===t)break;null==(r=sH(this,oW))||r.setPreload(i);break;case oQ.PLAYBACK_ID:this.src=sp(null!=i?i:void 0,{maxResolution:this.maxResolution,domain:this.customDomain});break;case oQ.DEBUG:{let e=this.debug;this.mux&&console.info("Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."),this._hls&&(this._hls.config.debug=e);break}case oQ.METADATA_URL:i&&fetch(i).then(e=>e.json()).then(e=>this.metadata=e).catch(()=>console.error(`Unable to load or parse metadata JSON from metadata-url ${i}!`));break;case oQ.STREAM_TYPE:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}));break;case oQ.TARGET_LIVE_WINDOW:(null==i||i!==t)&&this.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0,detail:this.targetLiveWindow}))}}disconnectedCallback(){this.unload()}};oW=new WeakMap,oV=new WeakMap,oq=new WeakMap,oH=new WeakMap,oF=new WeakMap,o$=new WeakMap,oj=new WeakMap,oK=new WeakSet,oY=async function(){sH(this,oV)||(await s$(this,oV,Promise.resolve()),s$(this,oV,null),this.load())},sX.customElements.get("mux-video")||(sX.customElements.define("mux-video",oz),sX.MuxVideoElement=oz);var oX=Object.defineProperty,oJ=(e,t,i)=>t in e?oX(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,o0=(e,t,i)=>(oJ(e,"symbol"!=typeof t?t+"":t,i),i),o1=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},o2=(e,t,i)=>(o1(e,t,"read from private field"),i?i.call(e):t.get(e)),o5=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},o3=(e,t,i,a)=>(o1(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let o4={processCallback(e,t,i){if(i){for(let[e,a]of t)if(e in i){let t=i[e];"boolean"==typeof t&&a instanceof la&&"boolean"==typeof a.element[a.attributeName]?a.booleanValue=t:"function"==typeof t&&a instanceof la?a.element[a.attributeName]=t:a.value=t}}}};class o7 extends Y.DocumentFragment{constructor(e,t,i=o4){var a;super(),o5(this,lP,void 0),o5(this,lU,void 0),this.append(e.content.cloneNode(!0)),o3(this,lP,o8(this)),o3(this,lU,i),null==(a=i.createCallback)||a.call(i,this,o2(this,lP),t),i.processCallback(this,o2(this,lP),t)}update(e){o2(this,lU).processCallback(this,o2(this,lP),e)}}lP=new WeakMap,lU=new WeakMap;let o8=(e,t=[])=>{let i,a;for(let r of e.attributes||[])if(r.value.includes("{{")){let n=new li;for([i,a]of o9(r.value))if(i){let i=new la(e,r.name,r.namespaceURI);n.append(i),t.push([a,i])}else n.append(a);r.value=n.toString()}for(let r of e.childNodes)if(1!==r.nodeType||r instanceof HTMLTemplateElement){if(1===r.nodeType||r.data.includes("{{")){let n=[];if(r.data)for([i,a]of o9(r.data))if(i){let i=new lr(e);n.push(i),t.push([a,i])}else n.push(new Text(a));else if(r instanceof HTMLTemplateElement){let i=new ln(e,r);n.push(i),t.push([i.expression,i])}r.replaceWith(...n.flatMap(e=>e.replacementNodes||[e]))}}else o8(r,t);return t},o6={},o9=e=>{let t="",i=0,a=o6[e],r=0,n;if(a)return a;for(a=[];n=e[r];r++)"{"===n&&"{"===e[r+1]&&"\\"!==e[r-1]&&e[r+2]&&1==++i?(t&&a.push([0,t]),t="",r++):"}"!==n||"}"!==e[r+1]||"\\"===e[r-1]||--i?t+=n||"":(a.push([1,t.trim()]),t="",r++);return t&&a.push([0,(i>0?"{{":"")+t]),o6[e]=a};class le{get value(){return""}set value(e){}toString(){return this.value}}let lt=new WeakMap;class li{constructor(){o5(this,lB,[])}[Symbol.iterator](){return o2(this,lB).values()}get length(){return o2(this,lB).length}item(e){return o2(this,lB)[e]}append(...e){for(let t of e)t instanceof la&&lt.set(t,this),o2(this,lB).push(t)}toString(){return o2(this,lB).join("")}}lB=new WeakMap;class la extends le{constructor(e,t,i){super(),o5(this,lF),o5(this,lW,""),o5(this,lV,void 0),o5(this,lq,void 0),o5(this,lH,void 0),o3(this,lV,e),o3(this,lq,t),o3(this,lH,i)}get attributeName(){return o2(this,lq)}get attributeNamespace(){return o2(this,lH)}get element(){return o2(this,lV)}get value(){return o2(this,lW)}set value(e){o2(this,lW)!==e&&(o3(this,lW,e),o2(this,lF,l$)&&1!==o2(this,lF,l$).length?o2(this,lV).setAttributeNS(o2(this,lH),o2(this,lq),o2(this,lF,l$)):null==e?o2(this,lV).removeAttributeNS(o2(this,lH),o2(this,lq)):o2(this,lV).setAttributeNS(o2(this,lH),o2(this,lq),e))}get booleanValue(){return o2(this,lV).hasAttributeNS(o2(this,lH),o2(this,lq))}set booleanValue(e){if(o2(this,lF,l$)&&1!==o2(this,lF,l$).length)throw new DOMException("Value is not fully templatized");this.value=e?"":null}}lW=new WeakMap,lV=new WeakMap,lq=new WeakMap,lH=new WeakMap,lF=new WeakSet,l$=function(){return lt.get(this)};class lr extends le{constructor(e,t){super(),o5(this,lj,void 0),o5(this,lK,void 0),o3(this,lj,e),o3(this,lK,t?[...t]:[new Text])}get replacementNodes(){return o2(this,lK)}get parentNode(){return o2(this,lj)}get nextSibling(){return o2(this,lK)[o2(this,lK).length-1].nextSibling}get previousSibling(){return o2(this,lK)[0].previousSibling}get value(){return o2(this,lK).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){let t=e.flat().flatMap(e=>null==e?[new Text]:e.forEach?[...e]:11===e.nodeType?[...e.childNodes]:e.nodeType?[e]:[new Text(e)]);t.length||t.push(new Text),o3(this,lK,function(e,t,i,a=null){let r=0,n,s,o,l=i.length,d=t.length;for(;r<l&&r<d&&t[r]==i[r];)r++;for(;r<l&&r<d&&i[l-1]==t[d-1];)a=i[--d,--l];if(r==d)for(;r<l;)e.insertBefore(i[r++],a);if(r==l)for(;r<d;)e.removeChild(t[r++]);else{for(n=t[r];r<l;)o=i[r++],s=n?n.nextSibling:a,n==o?n=s:r<l&&i[r]==s?(e.replaceChild(o,n),n=s):e.insertBefore(o,n);for(;n!=a;)s=n.nextSibling,e.removeChild(n),n=s}return i}(o2(this,lK)[0].parentNode,o2(this,lK),t,this.nextSibling))}}lj=new WeakMap,lK=new WeakMap;class ln extends lr{constructor(e,t){let i=t.getAttribute("directive")||t.getAttribute("type"),a=t.getAttribute("expression")||t.getAttribute(i)||"";a.startsWith("{{")&&(a=a.trim().slice(2,-2).trim()),super(e),o0(this,"directive"),this.expression=a,this.template=t,this.directive=i}}let ls={string:e=>String(e)};class lo{constructor(e){this.template=e,this.state=void 0}}let ll=new WeakMap,ld=new WeakMap,lu={partial:(e,t)=>{t[e.expression]=new lo(e.template)},if:(e,t)=>{var i;if(lp(e.expression,t)){if(ll.get(e)!==e.template){ll.set(e,e.template);let i=new o7(e.template,t,lh);e.replace(i),ld.set(e,i)}else null==(i=ld.get(e))||i.update(t)}else e.replace(""),ll.delete(e),ld.delete(e)}},lc=Object.keys(lu),lh={processCallback(e,t,i){var a,r;if(i)for(let[e,n]of t){if(n instanceof ln){if(!n.directive){let e=lc.find(e=>n.template.hasAttribute(e));e&&(n.directive=e,n.expression=n.template.getAttribute(e))}null==(a=lu[n.directive])||a.call(lu,n,i);continue}let t=lp(e,i);if(t instanceof lo){ll.get(n)!==t.template?(ll.set(n,t.template),t=new o7(t.template,t.state,lh),n.value=t,ld.set(n,t)):null==(r=ld.get(n))||r.update(t.state);continue}t?(n instanceof la&&n.attributeName.startsWith("aria-")&&(t=String(t)),n instanceof la?"boolean"==typeof t?n.booleanValue=t:"function"==typeof t?n.element[n.attributeName]=t:n.value=t:(n.value=t,ll.delete(n),ld.delete(n))):n instanceof la?n.value=void 0:(n.value=void 0,ll.delete(n),ld.delete(n))}}},lm={"!":e=>!e,"!!":e=>!!e,"==":(e,t)=>e==t,"!=":(e,t)=>e!=t,">":(e,t)=>e>t,">=":(e,t)=>e>=t,"<":(e,t)=>e<t,"<=":(e,t)=>e<=t,"??":(e,t)=>null!=e?e:t,"|":(e,t)=>{var i;return null==(i=ls[t])?void 0:i.call(ls,e)}};function lp(e,t={}){var i,a,r,n,s,o,l;let d=(function(e,t){let i,a,r,n=[];for(;e;){for(let n in r=null,i=e.length,t)(a=t[n].exec(e))&&a.index<i&&(r={token:a[0],type:n,matches:a.slice(1)},i=a.index);i&&n.push({token:e.substr(0,i),type:void 0}),r&&n.push(r),e=e.substr(i+(r?r.token.length:0))}return n})(e,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>"ws"!==e);if(0===d.length||d.some(({type:e})=>!e))return lv(e);if((null==(i=d[0])?void 0:i.token)===">"){let i=t[null==(a=d[1])?void 0:a.token];if(!i)return lv(e);let o={...t};i.state=o;let l=d.slice(2);for(let e=0;e<l.length;e+=3){let i=null==(r=l[e])?void 0:r.token,a=null==(n=l[e+1])?void 0:n.token,d=null==(s=l[e+2])?void 0:s.token;i&&"="===a&&(o[i]=lE(d,t))}return i}if(1===d.length)return lb(d[0])?lE(d[0].token,t):lv(e);if(2===d.length){let i=null==(o=d[0])?void 0:o.token,a=lm[i];if(!a||!lb(d[1]))return lv(e);let r=lE(d[1].token,t);return a(r)}if(3===d.length){let i=null==(l=d[1])?void 0:l.token,a=lm[i];if(!a||!lb(d[0])||!lb(d[2]))return lv(e);let r=lE(d[0].token,t);if("|"===i)return a(r,d[2].token);let n=lE(d[2].token,t);return a(r,n)}}function lv(e){return console.warn(`Warning: invalid expression \`${e}\``),!1}function lb({type:e}){return["number","boolean","string","param"].includes(e)}function lE(e,t){let i=e[0],a=e.slice(-1);return"true"===e||"false"===e?"true"===e:i===a&&["'",'"'].includes(i)?e.slice(1,-1):k(e)?parseFloat(e):t[e]}var lf=Object.defineProperty,lg=(e,t,i)=>t in e?lf(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,l_=(e,t,i)=>(lg(e,"symbol"!=typeof t?t+"":t,i),i),ly=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lA=(e,t,i)=>(ly(e,t,"read from private field"),i?i.call(e):t.get(e)),lT=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},lk=(e,t,i,a)=>(ly(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),lw=(e,t,i)=>(ly(e,t,"access private method"),i);let lI={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},lS=G.createElement("template");lS.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-controller:not([mediasubtitleslist]) media-captions-selectmenu,
    media-captions-button:not([mediasubtitleslist]),
    media-rendition-selectmenu[mediarenditionunavailable],
    media-audio-track-selectmenu[mediaaudiotrackunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;class lL extends Y.HTMLElement{constructor(){super(),lT(this,lZ),lT(this,lX),l_(this,"renderRoot"),l_(this,"renderer"),lT(this,lY,void 0),lT(this,lG,void 0),lT(this,lQ,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer());let e=new MutationObserver(e=>{var t;(null==(t=this.mediaController)||!t.breakpointsUncomputed)&&e.some(e=>{let t=e.target;return t===this||"media-controller"===t.localName&&!!(lI[e.attributeName]||e.attributeName.startsWith("breakpoint"))})&&this.render()});e.observe(this,{attributes:!0}),e.observe(this.renderRoot,{attributes:!0,subtree:!0}),lw(this,lZ,lz).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return null!=(e=lA(this,lY))?e:this.constructor.template}set template(e){lk(this,lQ,null),lk(this,lY,e),this.createRenderer()}get props(){var e,t,i;let a=[...Array.from(null!=(t=null==(e=this.mediaController)?void 0:e.attributes)?t:[]).filter(({name:e})=>lI[e]||e.startsWith("breakpoint")),...Array.from(this.attributes)],r={};for(let e of a){let t=null!=(i=lI[e.name])?i:e.name.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase()),{value:a}=e;null!=a?(k(a)&&(a=parseFloat(a)),r[t]=""===a||a):r[t]=!1}return r}attributeChangedCallback(e,t,i){"template"===e&&t!=i&&lw(this,lX,lJ).call(this)}connectedCallback(){lw(this,lX,lJ).call(this)}createRenderer(){this.template&&this.template!==lA(this,lG)&&(lk(this,lG,this.template),this.renderer=new o7(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(lS.content.cloneNode(!0),this.renderer))}render(){var e;null==(e=this.renderer)||e.update(this.props)}}async function lD(e){let t=await fetch(e);if(200!==t.status)throw Error(`Failed to load resource: the server responded with a status of ${t.status}`);return t.text()}lY=new WeakMap,lG=new WeakMap,lQ=new WeakMap,lZ=new WeakSet,lz=function(e){if(Object.prototype.hasOwnProperty.call(this,e)){let t=this[e];delete this[e],this[e]=t}},lX=new WeakSet,lJ=function(){var e;let t=this.getAttribute("template");if(!t||t===lA(this,lQ))return;let i=this.getRootNode(),a=null==(e=null==i?void 0:i.getElementById)?void 0:e.call(i,t);if(a){lk(this,lQ,t),lk(this,lY,a),this.createRenderer();return}(function(e){if(!/^(\/|\.\/|https?:\/\/)/.test(e))return!1;let t=/^https?:\/\//.test(e)?void 0:location.origin;try{new URL(e,t)}catch(e){return!1}return!0})(t)&&(lk(this,lQ,t),lD(t).then(e=>{let t=G.createElement("template");t.innerHTML=e,lk(this,lY,t),this.createRenderer()}).catch(console.error))},l_(lL,"template"),l_(lL,"observedAttributes",["template"]),l_(lL,"processor",lh),Y.customElements.get("media-theme")||Y.customElements.define("media-theme",lL);var lR=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},lM=(e,t,i)=>(lR(e,t,"read from private field"),i?i.call(e):t.get(e)),lC=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},lO=(e,t,i,a)=>(lR(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),lx=(e,t,i)=>(lR(e,t,"access private method"),i),lN=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};"undefined"==typeof DocumentFragment&&(globalThis.DocumentFragment=class extends lN{});var lP,lU,lB,lW,lV,lq,lH,lF,l$,lj,lK,lY,lG,lQ,lZ,lz,lX,lJ,l0,l1=class extends lN{},l2=class{constructor(e,t={}){lC(this,l0,void 0),lO(this,l0,null==t?void 0:t.detail)}get detail(){return lM(this,l0)}initCustomEvent(){}};l0=new WeakMap;var l5={document:{createElement:function(e,t){return new l1}},DocumentFragment,customElements:{get(e){},define(e,t,i){},upgrade(e){},whenDefined:e=>Promise.resolve(l1)},CustomEvent:l2,EventTarget:lN,HTMLElement:l1,HTMLVideoElement:class extends lN{}},l3="undefined"==typeof window||void 0===globalThis.customElements,l4=l3?l5:globalThis,l7=l3?l5.document:globalThis.document,l8={code:"en"};function l6(e,t=!0){var i;let a=t&&null!=(i=null==l8?void 0:l8[e])?i:e,r=t?l8.code:"en";return new l9(a,r)}var l9=class{constructor(e,t=null!=(dn=l8.code)?dn:"en"){this.message=e,this.locale=t}format(e){return this.message.replace(/\{(\w+)\}/g,(t,i)=>{var a;return null!=(a=e[i])?a:""})}toString(){return this.message}};function de(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function dt(e){return e.replace(/[-_]([a-z])/g,(e,t)=>t.toUpperCase())}function di(e){if(null==e)return;let t=+e;return Number.isNaN(t)?void 0:t}function da(e){let t=(function(e){let t={};for(let i in e)null!=e[i]&&(t[i]=e[i]);return new URLSearchParams(t)})(e).toString();return t?"?"+t:""}function dr(e){let t=(null!=e?e:"").split(".")[1];return t?JSON.parse(decodeURIComponent(atob(t.replace(/-/g,"+").replace(/_/g,"/")).split("").map(function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""))):{}}var dn,ds,dl,dd,du=(e,t)=>!!e&&!!t&&(!!e.contains(t)||du(e,t.getRootNode().host)),dc="mux.com",dh=(()=>{try{return"1.14.0"}catch{}return"UNKNOWN"})(),dm=(e,{maxResolution:t,token:i,domain:a=dc}={})=>`https://stream.${a}/${e}.m3u8${da(i?{token:i}:{redundant_streams:!0,...t?{max_resolution:t}:{}})}`,dp=(e,{token:t,thumbnailTime:i,domain:a=dc}={})=>{let r=null==t?i:void 0,{aud:n}=dr(t);if(!(t&&"t"!==n))return`https://image.${a}/${e}/thumbnail.webp${da({token:t,time:r})}`},dv=(e,{token:t,domain:i=dc}={})=>{let{aud:a}=dr(t);if(!(t&&"s"!==a))return`https://image.${i}/${e}/storyboard.vtt${da({token:t,format:"webp"})}`},db=e=>{if(e){if([aZ.LIVE,aZ.ON_DEMAND].includes(e))return e;if(null!=e&&e.includes("live"))return aZ.LIVE}},dE={crossorigin:"crossOrigin",playsinline:"playsInline"},df=class{constructor(e,t){lC(this,ds,void 0),lC(this,dl,void 0),lC(this,dd,[]),lO(this,ds,e),lO(this,dl,t)}[Symbol.iterator](){return lM(this,dd).values()}get length(){return lM(this,dd).length}get value(){var e;return null!=(e=lM(this,dd).join(" "))?e:""}set value(e){var t;e!==this.value&&(lO(this,dd,[]),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return lM(this,dd)[e]}values(){return lM(this,dd).values()}keys(){return lM(this,dd).keys()}forEach(e){lM(this,dd).forEach(e)}add(...e){var t,i;e.forEach(e=>{this.contains(e)||lM(this,dd).push(e)}),(""!==this.value||null!=(t=lM(this,ds))&&t.hasAttribute(`${lM(this,dl)}`))&&null!=(i=lM(this,ds))&&i.setAttribute(`${lM(this,dl)}`,`${this.value}`)}remove(...e){var t;e.forEach(e=>{lM(this,dd).splice(lM(this,dd).indexOf(e),1)}),null==(t=lM(this,ds))||t.setAttribute(`${lM(this,dl)}`,`${this.value}`)}contains(e){return lM(this,dd).includes(e)}toggle(e,t){return void 0!==t?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){this.remove(e),this.add(t)}};ds=new WeakMap,dl=new WeakMap,dd=new WeakMap;var dg=`[mux-player ${dh}]`;function d_(...e){console.warn(dg,...e)}function dy(...e){console.error(dg,...e)}function dA(e){var t;let i=null!=(t=e.message)?t:"";e.context&&(i+=` ${e.context}`),e.file&&(i+=` ${l6("Read more: ")}
https://github.com/muxinc/elements/blob/main/errors/${e.file}`),d_(i)}var dT={AUTOPLAY:"autoplay",CROSSORIGIN:"crossorigin",LOOP:"loop",MUTED:"muted",PLAYSINLINE:"playsinline",PRELOAD:"preload"},dk={VOLUME:"volume",PLAYBACKRATE:"playbackrate",MUTED:"muted"},dw=Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}}),dI=s5.filter(e=>"error"!==e),dS=Object.values(dT).filter(e=>![dT.PLAYSINLINE].includes(e)),dL=Object.values(dk);function dD(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}var dR=class extends l4.HTMLElement{static get observedAttributes(){return[...dS,...dL]}constructor(){super(),this.querySelectorAll(":scope > track").forEach(e=>{var t;null==(t=this.media)||t.append(e.cloneNode())}),new MutationObserver(e=>{for(let t of e)"childList"===t.type&&(t.removedNodes.forEach(e=>{var t,i;let a=null==(t=this.media)?void 0:t.querySelector(`track[src="${e.src}"]`);a&&(null==(i=this.media)||i.removeChild(a))}),t.addedNodes.forEach(e=>{var t;null==(t=this.media)||t.append(e.cloneNode())}))}).observe(this,{childList:!0,subtree:!0})}attributeChangedCallback(e,t,i){var a,r;switch(e){case dk.MUTED:this.media&&(this.media.muted=null!=i,this.media.defaultMuted=null!=i);return;case dk.VOLUME:{let e=null!=(a=di(i))?a:1;this.media&&(this.media.volume=e);return}case dk.PLAYBACKRATE:{let e=null!=(r=di(i))?r:1;this.media&&(this.media.playbackRate=e,this.media.defaultPlaybackRate=e);return}}}play(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.play())?t:Promise.reject()}pause(){var e;null==(e=this.media)||e.pause()}requestCast(e){var t;return null==(t=this.media)?void 0:t.requestCast(e)}get media(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("mux-video")}get audioTracks(){return this.media.audioTracks}get videoTracks(){return this.media.videoTracks}get audioRenditions(){return this.media.audioRenditions}get videoRenditions(){return this.media.videoRenditions}get paused(){var e,t;return null==(t=null==(e=this.media)?void 0:e.paused)||t}get duration(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.duration)?t:NaN}get ended(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.ended)&&t}get buffered(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.buffered)?t:dw}get seekable(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.seekable)?t:dw}get readyState(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.readyState)?t:0}get videoWidth(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoWidth)?t:0}get videoHeight(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.videoHeight)?t:0}get currentTime(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.currentTime)?t:0}set currentTime(e){this.media&&(this.media.currentTime=Number(e))}get volume(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.volume)?t:1}set volume(e){this.media&&(this.media.volume=Number(e))}get playbackRate(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.playbackRate)?t:1}set playbackRate(e){this.media&&(this.media.playbackRate=Number(e))}get defaultPlaybackRate(){var e;return null!=(e=di(this.getAttribute(dk.PLAYBACKRATE)))?e:1}set defaultPlaybackRate(e){null!=e?this.setAttribute(dk.PLAYBACKRATE,`${e}`):this.removeAttribute(dk.PLAYBACKRATE)}get crossOrigin(){return dD(this,dT.CROSSORIGIN)}set crossOrigin(e){this.setAttribute(dT.CROSSORIGIN,`${e}`)}get autoplay(){return null!=dD(this,dT.AUTOPLAY)}set autoplay(e){e?this.setAttribute(dT.AUTOPLAY,"string"==typeof e?e:""):this.removeAttribute(dT.AUTOPLAY)}get loop(){return null!=dD(this,dT.LOOP)}set loop(e){e?this.setAttribute(dT.LOOP,""):this.removeAttribute(dT.LOOP)}get muted(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.muted)&&t}set muted(e){this.media&&(this.media.muted=!!e)}get defaultMuted(){return null!=dD(this,dT.MUTED)}set defaultMuted(e){e?this.setAttribute(dT.MUTED,""):this.removeAttribute(dT.MUTED)}get playsInline(){return null!=dD(this,dT.PLAYSINLINE)}set playsInline(e){dy("playsInline is set to true by default and is not currently supported as a setter.")}get preload(){return this.media?this.media.preload:this.getAttribute("preload")}set preload(e){["","none","metadata","auto"].includes(e)?this.setAttribute(dT.PRELOAD,e):this.removeAttribute(dT.PRELOAD)}},dM=`:host {
  --media-control-display: var(--controls);
  --media-loading-indicator-display: var(--loading-indicator);
  --media-dialog-display: var(--dialog);
  --media-play-button-display: var(--play-button);
  --media-live-button-display: var(--live-button);
  --media-seek-backward-button-display: var(--seek-backward-button);
  --media-seek-forward-button-display: var(--seek-forward-button);
  --media-mute-button-display: var(--mute-button);
  --media-captions-button-display: var(--captions-button);
  --media-captions-selectmenu-display: var(--captions-selectmenu, var(--media-captions-button-display));
  --media-rendition-selectmenu-display: var(--rendition-selectmenu);
  --media-audio-track-selectmenu-display: var(--audio-track-selectmenu);
  --media-airplay-button-display: var(--airplay-button);
  --media-pip-button-display: var(--pip-button);
  --media-fullscreen-button-display: var(--fullscreen-button);
  --media-cast-button-display: var(--cast-button);
  --media-playback-rate-button-display: var(--playback-rate-button);
  --media-volume-range-display: var(--volume-range);
  --media-time-range-display: var(--time-range);
  --media-time-display-display: var(--time-display);
  --media-duration-display-display: var(--duration-display);
  --media-title-display-display: var(--title-display);

  display: inline-block;
  width: 100%;
}

/* Hide custom elements that are not defined yet */
:not(:defined) {
  display: none;
}

a {
  color: #fff;
  font-size: 0.9em;
  text-decoration: underline;
}

media-theme {
  width: 100%;
  height: 100%;
  direction: ltr;
}

media-poster-image {
  width: 100%;
  height: 100%;
}

media-poster-image:not([src]) {
  display: none;
}

::part(top),
[part~='top'] {
  --media-control-display: var(--controls, var(--top-controls));
  --media-play-button-display: var(--play-button, var(--top-play-button));
  --media-live-button-display: var(--live-button, var(--top-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--top-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--top-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--top-mute-button));
  --media-captions-button-display: var(--captions-button, var(--top-captions-button));
  --media-captions-selectmenu-display: var(
    --captions-selectmenu,
    var(--media-captions-button-display, var(--top-captions-selectmenu))
  );
  --media-rendition-selectmenu-display: var(--rendition-selectmenu, var(--top-rendition-selectmenu));
  --media-audio-track-selectmenu-display: var(--audio-track-selectmenu, var(--top-audio-track-selectmenu));
  --media-airplay-button-display: var(--airplay-button, var(--top-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--top-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--top-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--top-cast-button));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--top-playback-rate-button));
  --media-volume-range-display: var(--volume-range, var(--top-volume-range));
  --media-time-range-display: var(--time-range, var(--top-time-range));
  --media-time-display-display: var(--time-display, var(--top-time-display));
  --media-duration-display-display: var(--duration-display, var(--top-duration-display));
  --media-title-display-display: var(--title-display, var(--top-title-display));
}

::part(center),
[part~='center'] {
  --media-control-display: var(--controls, var(--center-controls));
  --media-play-button-display: var(--play-button, var(--center-play-button));
  --media-live-button-display: var(--live-button, var(--center-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--center-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--center-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--center-mute-button));
  --media-captions-button-display: var(--captions-button, var(--center-captions-button));
  --media-captions-selectmenu-display: var(
    --captions-selectmenu,
    var(--media-captions-button-display, var(--center-captions-selectmenu))
  );
  --media-rendition-selectmenu-display: var(--rendition-selectmenu, var(--center-rendition-selectmenu));
  --media-audio-track-selectmenu-display: var(--audio-track-selectmenu, var(--center-audio-track-selectmenu));
  --media-airplay-button-display: var(--airplay-button, var(--center-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--center-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--center-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--center-cast-button));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--center-playback-rate-button));
  --media-volume-range-display: var(--volume-range, var(--center-volume-range));
  --media-time-range-display: var(--time-range, var(--center-time-range));
  --media-time-display-display: var(--time-display, var(--center-time-display));
  --media-duration-display-display: var(--duration-display, var(--center-duration-display));
}

::part(bottom),
[part~='bottom'] {
  --media-control-display: var(--controls, var(--bottom-controls));
  --media-play-button-display: var(--play-button, var(--bottom-play-button));
  --media-live-button-display: var(--live-button, var(--bottom-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--bottom-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--bottom-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--bottom-mute-button));
  --media-captions-button-display: var(--captions-button, var(--bottom-captions-button));
  --media-captions-selectmenu-display: var(
    --captions-selectmenu,
    var(--media-captions-button-display, var(--bottom-captions-selectmenu))
  );
  --media-rendition-selectmenu-display: var(--rendition-selectmenu, var(--bottom-rendition-selectmenu));
  --media-audio-track-selectmenu-display: var(--audio-track-selectmenu, var(--bottom-audio-track-selectmenu));
  --media-airplay-button-display: var(--airplay-button, var(--bottom-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--bottom-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--bottom-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--bottom-cast-button));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--bottom-playback-rate-button));
  --media-volume-range-display: var(--volume-range, var(--bottom-volume-range));
  --media-time-range-display: var(--time-range, var(--bottom-time-range));
  --media-time-display-display: var(--time-display, var(--bottom-time-display));
  --media-duration-display-display: var(--duration-display, var(--bottom-duration-display));
  --media-title-display-display: var(--title-display, var(--bottom-title-display));
}
`,dC=`
  :host {
    z-index: 100;
    display: var(--media-dialog-display, flex);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    color: #fff;
    line-height: 18px;
    font-family: Arial, sans-serif;
    padding: var(--media-dialog-backdrop-padding, 0);
    background: var(--media-dialog-backdrop-background,
      linear-gradient(to bottom, rgba(20, 20, 30, 0.7) 50%, rgba(20, 20, 30, 0.9))
    );
    /* Needs to use !important to prevent overwrite of media-chrome */
    transition: var(--media-dialog-transition-open, visibility .2s, opacity .2s) !important;
    transform: var(--media-dialog-transform-open, none) !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  :host(:not([open])) {
    /* Needs to use !important to prevent overwrite of media-chrome */
    transition: var(--media-dialog-transition-close, visibility .1s, opacity .1s) !important;
    transform: var(--media-dialog-transform-close, none) !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  :focus-visible {
    box-shadow: 0 0 0 2px rgba(27, 127, 204, 0.9);
  }

  .dialog {
    position: relative;
    box-sizing: border-box;
    background: var(--media-dialog-background, none);
    padding: var(--media-dialog-padding, 10px);
    width: min(320px, 100%);
    word-wrap: break-word;
    max-height: 100%;
    overflow: auto;
    text-align: center;
    line-height: 1.4;
  }
`,dO=l7.createElement("template");dO.innerHTML=`
  <style>
    ${dC}
  </style>

  <div class="dialog">
    <slot></slot>
  </div>
`;var dx=class extends l4.HTMLElement{constructor(){var e;super(),this.attachShadow({mode:"open"}),null==(e=this.shadowRoot)||e.appendChild(this.constructor.template.content.cloneNode(!0))}show(){this.setAttribute("open",""),this.dispatchEvent(new CustomEvent("open",{composed:!0,bubbles:!0})),dN(this)}close(){this.hasAttribute("open")&&(this.removeAttribute("open"),this.dispatchEvent(new CustomEvent("close",{composed:!0,bubbles:!0})),this._previouslyFocusedElement instanceof HTMLElement&&this._previouslyFocusedElement.focus())}attributeChangedCallback(e,t,i){"open"===e&&t!==i&&(null!=i?this.show():this.close())}connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","dialog"),this.hasAttribute("open")&&dN(this)}};function dN(e){let t=new CustomEvent("initfocus",{composed:!0,bubbles:!0,cancelable:!0});if(e.dispatchEvent(t),t.defaultPrevented)return;let i=e.querySelector("[autofocus]:not([disabled])");!i&&e.tabIndex>=0&&(i=e),i||(i=function e(t){let i=["button","input","keygen","select","textarea"].map(function(e){return e+":not([disabled])"});i.push('[tabindex]:not([disabled]):not([tabindex=""])');let a=null==t?void 0:t.querySelector(i.join(", "));if(!a&&"attachShadow"in Element.prototype){let i=(null==t?void 0:t.querySelectorAll("*"))||[];for(let t=0;t<i.length&&!(i[t].tagName&&i[t].shadowRoot&&(a=e(i[t].shadowRoot)));t++);}return a}(e.shadowRoot)),e._previouslyFocusedElement=l7.activeElement,l7.activeElement instanceof HTMLElement&&l7.activeElement.blur(),e.addEventListener("transitionend",()=>{i instanceof HTMLElement&&i.focus({preventScroll:!0})},{once:!0})}dx.styles=dC,dx.template=dO,dx.observedAttributes=["open"],l4.customElements.get("media-dialog")||(l4.customElements.define("media-dialog",dx),l4.MediaDialog=dx);var dP=dx,dU=l7.createElement("template");dU.innerHTML=`
  <style>
    ${dP.styles}

    .close {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: inherit;
      width: 28px;
      height: 28px;
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
  </style>

  <div class="dialog">
    <slot></slot>
  </div>

  <slot name="close">
    <button class="close" tabindex="0">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </slot>
`;var dB=class extends dP{constructor(){var e,t;super(),null==(t=null==(e=this.shadowRoot)?void 0:e.querySelector(".close"))||t.addEventListener("click",()=>{this.close()})}};dB.template=dU,l4.customElements.get("mxp-dialog")||(l4.customElements.define("mxp-dialog",dB),l4.MxpDialog=dB);var dW=new WeakMap,dV=class{constructor(e,t){this.element=e,this.type=t,this.element.addEventListener(this.type,this);let i=dW.get(this.element);i&&i.set(this.type,this)}set(e){if("function"==typeof e)this.handleEvent=e.bind(this.element);else if("object"==typeof e&&"function"==typeof e.handleEvent)this.handleEvent=e.handleEvent.bind(e);else{this.element.removeEventListener(this.type,this);let e=dW.get(this.element);e&&e.delete(this.type)}}static for(e){dW.has(e.element)||dW.set(e.element,new Map);let t=e.attributeName.slice(2),i=dW.get(e.element);return i&&i.has(t)?i.get(t):new dV(e.element,t)}},dq=new Map,dH=new WeakMap,dF=new WeakMap,d$=class{constructor(e,t,i){this.strings=e,this.values=t,this.processor=i,this.stringsKey=this.strings.join("\x01")}get template(){if(dq.has(this.stringsKey))return dq.get(this.stringsKey);{let e=l7.createElement("template"),t=this.strings.length-1;return e.innerHTML=this.strings.reduce((e,i,a)=>e+i+(a<t?`{{ ${a} }}`:""),""),dq.set(this.stringsKey,e),e}}renderInto(e){var t;let i=this.template;if(dH.get(e)!==i){dH.set(e,i);let t=new o7(i,this.values,this.processor);dF.set(e,t),e instanceof lr?e.replace(...t.children):e.appendChild(t);return}let a=dF.get(e);null==(t=null==a?void 0:a.update)||t.call(a,this.values)}},dj={processCallback(e,t,i){var a,r,n;if(i)for(let[e,s]of t){e in i&&(function(e,t){if(e instanceof la&&t instanceof Element){let i=e.element;return i[e.attributeName]!==t&&(e.element.removeAttributeNS(e.attributeNamespace,e.attributeName),i[e.attributeName]=t),!0}return!1}(r=s,n=null!=(a=i[e])?a:"")||function(e,t){if("boolean"==typeof t&&e instanceof la){let i=e.attributeNamespace,a=e.element.hasAttributeNS(i,e.attributeName);return t!==a&&(e.booleanValue=t),!0}return!1}(r,n)||r instanceof la&&r.attributeName.startsWith("on")&&(dV.for(r).set(n),r.element.removeAttributeNS(r.attributeNamespace,r.attributeName),1)||!1===n&&r instanceof lr&&(r.replace(""),1)||n instanceof d$&&r instanceof lr&&(n.renderInto(r),1)||n instanceof DocumentFragment&&r instanceof lr&&(n.childNodes.length&&r.replace(...n.childNodes),1)||function(e,t){if(e instanceof la){let i=e.attributeNamespace,a=e.element.getAttributeNS(i,e.attributeName);return String(t)!==a&&(e.value=String(t))}e.value=String(t)}(r,n))}}};function dK(e,...t){return new d$(e,t,dj)}var dY=e=>dK`
  <style>
    ${dM}
  </style>
  ${dQ(e)}
`,dG=e=>{let t=e.hotKeys?`${e.hotKeys}`:"";return"live"===db(e.streamType)&&(t+=" noarrowleft noarrowright"),t},dQ=e=>{var t,i,a,r,n,s,o,l,d,u,c,h,m,p,v,b,E,f,g,_,y,A,T,k,w,I,S,L,D,R,M,C,O,x,N;let P;return dK`
  <media-theme
    template="${e.themeTemplate||!1}"
    defaultstreamtype="${null!=(t=e.defaultStreamType)&&t}"
    hotkeys="${dG(e)||!1}"
    nohotkeys="${e.noHotKeys||!e.hasSrc||e.isDialogOpen||!1}"
    noautoseektolive="${!!(null!=(i=e.streamType)&&i.includes(aZ.LIVE))&&0!==e.targetLiveWindow}"
    novolumepref="${e.novolumepref||!1}"
    disabled="${!e.hasSrc||e.isDialogOpen}"
    audio="${null!=(a=e.audio)&&a}"
    style="${null!=(N={"--media-primary-color":e.primaryColor,"--media-secondary-color":e.secondaryColor},P="",Object.entries(N).forEach(([e,t])=>{null!=t&&(P+=`${de(e)}: ${t}; `)}),r=P?P.trim():void 0)&&r}"
    defaultsubtitles="${!e.defaultHiddenCaptions}"
    forwardseekoffset="${null!=(n=e.forwardSeekOffset)&&n}"
    backwardseekoffset="${null!=(s=e.backwardSeekOffset)&&s}"
    playbackrates="${null!=(o=e.playbackRates)&&o}"
    defaultshowremainingtime="${null!=(l=e.defaultShowRemainingTime)&&l}"
    hideduration="${null!=(d=e.hideDuration)&&d}"
    title="${null!=(u=e.title)&&u}"
    exportparts="top, center, bottom, layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer, controller, poster, live, play, button, seek-backward, seek-forward, mute, captions, airplay, pip, fullscreen, cast, playback-rate, volume, range, time, display"
  >
    <mux-video
      slot="media"
      target-live-window="${null!=(c=e.targetLiveWindow)&&c}"
      stream-type="${null!=(h=db(e.streamType))&&h}"
      crossorigin="${null!=(m=e.crossOrigin)?m:""}"
      playsinline
      autoplay="${null!=(p=e.autoplay)&&p}"
      muted="${null!=(v=e.muted)&&v}"
      loop="${null!=(b=e.loop)&&b}"
      preload="${null!=(E=e.preload)&&E}"
      debug="${null!=(f=e.debug)&&f}"
      prefer-cmcd="${null!=(g=e.preferCmcd)&&g}"
      disable-cookies="${null!=(_=e.disableCookies)&&_}"
      prefer-playback="${null!=(y=e.preferPlayback)&&y}"
      start-time="${null!=e.startTime&&e.startTime}"
      beacon-collection-domain="${null!=(A=e.beaconCollectionDomain)&&A}"
      player-software-name="${null!=(T=e.playerSoftwareName)&&T}"
      player-software-version="${null!=(k=e.playerSoftwareVersion)&&k}"
      env-key="${null!=(w=e.envKey)&&w}"
      custom-domain="${null!=(I=e.customDomain)&&I}"
      src="${e.src?e.src:!!e.playbackId&&dm(e.playbackId,{maxResolution:e.maxResolution,domain:e.customDomain,token:e.tokens.playback})}"
      cast-src="${e.src?e.src:!!e.playbackId&&dm(e.playbackId,{maxResolution:e.maxResolution,domain:e.customDomain,token:e.tokens.playback})}"
      exportparts="video"
    >
      ${e.storyboard?dK`<track label="thumbnails" default kind="metadata" src="${e.storyboard}" />`:dK``}
    </mux-video>
    <slot name="poster" slot="poster">
      <media-poster-image
        part="poster"
        exportparts="poster, img"
        src="${""!==e.poster&&null!=(S=e.poster)&&S}"
        placeholder-src="${null!=(L=e.placeholder)&&L}"
      ></media-poster-image>
    </slot>
    <mxp-dialog
      no-auto-hide
      open="${null!=(D=e.isDialogOpen)&&D}"
      onclose="${e.onCloseErrorDialog}"
      oninitfocus="${e.onInitFocusDialog}"
    >
      ${null!=(R=e.dialog)&&R.title?dK`<h3>${e.dialog.title}</h3>`:dK``}
      <p>
        ${null==(M=e.dialog)?void 0:M.message}
        ${null!=(C=e.dialog)&&C.linkUrl?dK`<a
              href="${e.dialog.linkUrl}"
              target="_blank"
              rel="external noopener"
              aria-label="${null!=(O=e.dialog.linkText)?O:""} ${l6("(opens in a new window)")}"
              >${null!=(x=e.dialog.linkText)?x:e.dialog.linkUrl}</a
            >`:dK``}
      </p>
    </mxp-dialog>
  </media-theme>
`};function dZ(e,t,i,a,r){var n,s,o;let l={},d={};switch(e.code){case aK.MEDIA_ERR_NETWORK:switch(l.title=l6("Network Error",r),l.message=e.message,null==(n=e.data)?void 0:n.response.code){case 412:l.title=l6("Video is not currently available",r),l.message=l6("The live stream or video file are not yet ready.",r),d.message=l6("This playback-id may belong to a live stream that is not currently active or an asset that is not ready.",r),d.file="412-not-playable.md";break;case 404:l.title=l6("Video does not exist",r),l.message="",d.message=l6("This playback-id does not exist. You may have used an Asset ID or an ID from a different resource.",r),d.file="404-not-found.md";break;case 403:{if(l.title=l6("Invalid playback URL",r),l.message=l6("The video URL or playback-token are formatted with incorrect or incomplete information.",r),d.message=l6("403 error trying to access this playback URL. If this is a signed URL, you might need to provide a playback-token.",r),d.file="missing-signed-tokens.md",!a)break;let{exp:e,aud:t,sub:n}=dr(a),s=Date.now()>1e3*e,o=n!==i,u="v"!==t,c={timeStyle:"medium",dateStyle:"medium"};if(s){l.title=l6("Video URL has expired",r),l.message=l6("The video’s secured playback-token has expired.",r),d.message=l6("The video’s secured playback-token has expired.",r),d.context=l6("Expired at: {expiredDate}. Current time: {currentDate}.",r).format({expiredDate:new Intl.DateTimeFormat(l8.code,c).format(1e3*e),currentDate:new Intl.DateTimeFormat(l8.code,c).format(Date.now())}),d.file="403-expired-token.md";break}if(o){l.title=l6("Video URL is formatted incorrectly",r),l.message=l6("The video’s playback ID does not match the one encoded in the playback-token.",r),d.message=l6("The video’s playback ID does not match the one encoded in the playback-token.",r),d.context=l6("Specified playback ID: {playbackId} and the playback ID encoded in the playback-token: {tokenPlaybackId}",r).format({playbackId:i,tokenPlaybackId:n}),d.file="403-playback-id-mismatch.md";break}if(u){l.title=l6("Video URL is formatted incorrectly",r),l.message=l6("The playback-token is formatted with incorrect information.",r),d.message=l6("The playback-token is formatted with incorrect information.",r),d.context=l6("The playback-token has an incorrect aud value: {tokenType}. aud value should be v.",r).format({tokenType:t}),d.file="403-incorrect-aud-value.md";break}d.message=l6("403 error trying to access this playback URL. If this is a signed playback ID, the token might not have been generated correctly.",r),d.file="403-malformatted-token.md"}}break;case aK.MEDIA_ERR_DECODE:{let{message:t}=e;l={title:l6("Media Error",r),message:t},d.file="media-decode-error.md";break}case aK.MEDIA_ERR_SRC_NOT_SUPPORTED:{let n=null==(o=null==(s=e.data)?void 0:s.response)?void 0:o.code;if(n>=400&&n<500){e.code=aK.MEDIA_ERR_NETWORK,e.data={response:{code:n}},{dialog:l,devlog:d}=dZ(e,t,i,a);break}l={title:l6("Source Not Supported",r),message:e.message},d.file="media-src-not-supported.md";break}default:l={title:l6("Error",r),message:e.message}}return t&&(l={title:l6("Your device appears to be offline",r),message:l6("Check your internet connection and try reloading this video.",r)}),{dialog:l,devlog:d}}var dz=`<!-- prettier-ignore -->
<template id="media-theme-classic">
  <style>
    :host {
      --_primary-color: var(--media-primary-color, white);
      --_secondary-color: var(--media-secondary-color, rgb(0 0 0 / .75));

      --media-icon-color: var(--_primary-color);
      --media-range-thumb-background: var(--_primary-color);
      --media-range-bar-color: var(--_primary-color);
      --media-control-background: var(--_secondary-color);
      --media-control-hover-background: var(--_secondary-color);
      --media-time-range-buffered-color: rgba(255, 255, 255, 0.4);
      --media-range-track-background:
        linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
        linear-gradient(rgba(20, 20, 30, 0.7), rgba(20, 20, 30, 0.7));
      --media-preview-thumbnail-border: 0;
      --media-preview-thumbnail-border-radius: 2px 2px 0 0;
      --media-preview-time-border-radius: 0 0 2px 2px;
      --media-preview-time-margin: 0 0 8px;
      --media-preview-time-text-shadow: none;
      --media-listbox-border-radius: 2px;
      --media-listbox-transform-in: translateY(-8px) scale(1);
      --media-listbox-transform-out: translateY(-6px) scale(.99);
      --media-option-hover-background: rgba(255, 255, 255, 0.28);

      color: var(--_primary-color);
      display: inline-block;
      width: 100%;
      height: 100%;
    }

    :host([audio]) {
      --media-preview-time-border-radius: 3px;
      --media-preview-time-margin: 0 0 5px;
      --media-preview-time-text-shadow: none;
    }

    :host([audio]) ::slotted([slot='media']) {
      height: 0px;
    }

    :host([audio]) media-loading-indicator {
      display: none;
    }

    :host([audio]) media-controller {
      background: transparent;
    }

    :host([audio]) media-controller::part(vertical-layer) {
      background: transparent;
    }

    :host([audio]) media-control-bar {
      width: 100%;
    }

    [disabled]:not(media-live-button),
    [aria-disabled='true']:not(media-live-button) {
      opacity: 60%;
      cursor: not-allowed;
    }

    /* 0.433s is the transition duration for VTT Regions.
     * Borrowed here, so the captions don't move too fast. */
    media-controller ::slotted([slot='media']) {
      --media-webkit-text-track-transition: transform 0.433s ease-out 0.3s;
    }
    media-controller:is([mediapaused],:not([userinactive])) ::slotted([slot='media']) {
      /* 42px is the height of the control bar and progress bar
       * with an additional 5px as a buffer, to get 47px */
      --media-webkit-text-track-transform: translateY(-47px);
      --media-webkit-text-track-transition: transform 0.15s ease;
    }

    :host media-time-range {
      color: var(--_primary-color);
      --media-range-thumb-opacity: 0;
    }

    :host(:not([audio])) media-time-range {
      --media-range-padding: 0;
      background: transparent;
      z-index: 10;
      height: 10px;
      bottom: -3px;
      width: 100%;
    }

    media-control-bar {
      --media-control-padding: 4px 3px;
    }

    [breakpointsm] media-control-bar {
      --media-control-padding: 9px 5px;
    }

    [breakpointmd] media-control-bar {
      --media-control-padding: 9px 7px;
    }

    media-control-bar :is([role='button'], [role='switch'], button) {
      line-height: 0;
    }

    media-control-bar :is(media-text-display, media-time-display):first-child {
      --media-control-padding: 9px 5px 9px 10px;
    }

    .spacer {
      flex-grow: 1;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }

    /* Add a small space on the right to have the play button and
     * fullscreen button aligned in relation to the progress bar. */
    media-control-bar:not([slot])::after {
      content: '';
      width: 2px;
      height: 100%;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }

    media-control-bar[slot='top-chrome'] {
      min-height: 42px;
      pointer-events: none;
    }

    :host([title]) media-control-bar[slot='top-chrome']::before {
      content: '';
      position: absolute;
      width: 100%;
      padding-bottom: min(160px, 25%);
      background: linear-gradient(rgb(0 0 0 / 0.4), transparent);
    }

    media-control-bar[slot='top-chrome'] > * {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      position: relative;
    }

    media-controller::part(vertical-layer) {
      transition: background-color 1s;
    }

    media-controller:is([mediapaused], :not([userinactive]))::part(vertical-layer) {
      background-color: var(--controls-backdrop-color, var(--controls, transparent));
      transition: background-color 0.25s;
    }

    .center-controls {
      --media-button-icon-width: 100%;
      --media-button-icon-height: auto;
      pointer-events: none;
      width: 100%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
      paint-order: stroke;
      stroke: rgba(102, 102, 102, 1);
      stroke-width: 0.3px;
      text-shadow: 0 0 2px rgb(0 0 0 / 0.25), 0 0 6px rgb(0 0 0 / 0.25);
    }

    .center-controls media-play-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      width: max(43px, min(10%, 55px));
    }

    .center-controls media-seek-backward-button,
    .center-controls media-seek-forward-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      margin: 0 2%;
      width: max(33px, min(8%, 40px));
    }

    media-control-bar:not([slot]) media-seek-backward-button {
      padding-right: 5px;
    }

    media-control-bar:not([slot]) media-seek-forward-button {
      padding-left: 5px;
    }

    media-loading-indicator {
      --media-loading-icon-width: 100%;
      --media-button-icon-height: auto;
      display: var(--media-control-display, var(--media-loading-indicator-display, flex));
      pointer-events: none;
      position: absolute;
      width: min(15%, 150px);
      flex-flow: row;
      align-items: center;
      justify-content: center;
    }

    /* Intentionally don't target the div for transition but the children
     of the div. Prevents messing with media-chrome's autohide feature. */
    media-loading-indicator + div * {
      transition: opacity 0.15s;
      opacity: 1;
    }

    media-loading-indicator[medialoading]:not([mediapaused]) ~ div > * {
      opacity: 0;
      transition-delay: 400ms;
    }

    media-volume-range {
      width: min(100%, 100px);
    }

    media-time-display {
      white-space: nowrap;
    }

    :is(media-time-display, media-text-display, media-playback-rate-button[role='button']) {
      color: inherit;
      line-height: 24px;
    }

    :is(.title-display, media-live-button) {
      color: inherit;
      font-size: 16px;
      text-shadow: 0 0 2px rgb(0 0 0 / 0.6);
    }

    :host([audio]) .title-display {
      flex-grow: 1;
      font-size: 21px;
    }
  </style>

  <template partial="TitleDisplay">
    <template if="title">
      <media-text-display part="top title display" class="title-display">
        {{title}}
      </media-text-display>
    </template>
  </template>

  <template partial="PlayButton">
    <media-play-button
      part="{{section ?? 'bottom'}} play button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="play">
        <path d="m6.73 20.93 14.05-8.54a.46.46 0 0 0 0-.78L6.73 3.07a.48.48 0 0 0-.73.39v17.07a.48.48 0 0 0 .73.4Z" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="pause">
        <path
          d="M6 19.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v15ZM14.5 4a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-3Z"
        />
      </svg>
    </media-play-button>
  </template>

  <template partial="SeekBackwardButton">
    <media-seek-backward-button
      seekoffset="{{backwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-backward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 22 24" slot="backward">
        <path d="M11 6V3L5.37 7 11 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 11 6Z" />
        <text class="value" transform="translate(2.5 21)" style="font-size: 8px; font-family: 'ArialMT', 'Arial'">
          {{backwardseekoffset}}
        </text>
      </svg>
    </media-seek-backward-button>
  </template>

  <template partial="SeekForwardButton">
    <media-seek-forward-button
      seekoffset="{{forwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-forward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 22 24" slot="forward">
        <path d="M11 6V3l5.61 4L11 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 11 6Z" />
        <text class="value" transform="translate(10 21)" style="font-size: 8px; font-family: 'ArialMT', 'Arial'">
          {{forwardseekoffset}}
        </text>
      </svg>
    </media-seek-forward-button>
  </template>

  <template partial="MuteButton">
    <media-mute-button part="bottom mute button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="high">
        <path
          d="m11.14 4.86-4 4a.49.49 0 0 1-.35.14H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.5.5 0 0 0 .85-.36V5.21a.5.5 0 0 0-.86-.35Zm2.74-1.56v1.52A7.52 7.52 0 0 1 19.47 12a7.52 7.52 0 0 1-5.59 7.18v1.52A9 9 0 0 0 21 12a9 9 0 0 0-7.12-8.7Zm3.56 8.7a5.49 5.49 0 0 0-3.56-5.1v1.66a3.93 3.93 0 0 1 0 6.88v1.66a5.49 5.49 0 0 0 3.56-5.1Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="low">
        <path
          d="m11.14 4.853-4 4a.49.49 0 0 1-.35.14H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.5.5 0 0 0 .85-.36V5.203a.5.5 0 0 0-.86-.35Zm6.3 7.14a5.49 5.49 0 0 0-3.56-5.1v1.66a3.93 3.93 0 0 1 0 6.88v1.66a5.49 5.49 0 0 0 3.56-5.1Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="medium">
        <path
          d="m11.14 4.853-4 4a.49.49 0 0 1-.35.14H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.5.5 0 0 0 .85-.36V5.203a.5.5 0 0 0-.86-.35Zm6.3 7.14a5.49 5.49 0 0 0-3.56-5.1v1.66a3.93 3.93 0 0 1 0 6.88v1.66a5.49 5.49 0 0 0 3.56-5.1Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="off">
        <path
          d="m3 4.05 4.48 4.47-.33.33a.49.49 0 0 1-.36.15H3.25a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 0 .25.25h3.54a.49.49 0 0 1 .36.15l4 4a.48.48 0 0 0 .36.15.5.5 0 0 0 .5-.5v-5.75l4.67 4.66a7.71 7.71 0 0 1-2.79 1.47v1.52a9.32 9.32 0 0 0 3.87-1.91L20 21l1-1L4.06 3 3 4.05Zm5.36 5.36 2.39 2.39V17L8 14.26a1.74 1.74 0 0 0-1.24-.51H4.25v-3.5h2.54A1.74 1.74 0 0 0 8 9.74l.36-.33ZM19.47 12a7.19 7.19 0 0 1-.89 3.47l1.11 1.1A8.64 8.64 0 0 0 21 12a9 9 0 0 0-7.12-8.7v1.52A7.52 7.52 0 0 1 19.47 12ZM12 8.88V5.21a.5.5 0 0 0-.5-.5.48.48 0 0 0-.36.15L9.56 6.44 12 8.88ZM15.91 12a4.284 4.284 0 0 1-.07.72l1.22 1.22a5.2 5.2 0 0 0 .38-1.94 5.49 5.49 0 0 0-3.56-5.1v1.66A4 4 0 0 1 15.91 12Z"
        />
      </svg>
    </media-mute-button>
  </template>

  <template partial="RenditionSelect">
    <media-rendition-selectmenu part="bottom rendition selectmenu" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <media-rendition-button slot="button" part="bottom rendition button">
        <svg aria-hidden="true" slot="icon" viewBox="0 0 18 24">
          <path d="M2.25 14.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.75 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.75 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        </svg>
      </media-rendition-button>
      <media-rendition-listbox slot="listbox" part="bottom rendition listbox">
        <div slot="header">Quality</div>
      </media-rendition-listbox>
    </media-rendition-selectmenu>
  </template>

  <template partial="AudioTrackSelect">
    <media-audio-track-selectmenu part="bottom audio-track selectmenu" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <media-audio-track-button slot="button" part="bottom audio-track button">
        <svg aria-hidden="true" slot="icon" viewBox="0 0 24 24">
          <path d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm0 1.5C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z"/>
          <path d="M7.25 9.75a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3-3a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0v-9a.75.75 0 0 1 .75-.75Zm3 2a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75Zm3-1a.75.75 0 0 1 .75.75v7a.75.75 0 0 1-1.5 0v-7a.75.75 0 0 1 .75-.75Z"/>
        </svg>
      </media-audio-track-button>
      <media-audio-track-listbox slot="listbox" part="bottom audio-track listbox">
        <div slot="header">Audio</div>
      </media-audio-track-listbox>
    </media-audio-track-selectmenu>
  </template>

  <template partial="CaptionsSelect">
    <media-captions-selectmenu part="bottom captions selectmenu" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <media-captions-button slot="button" part="bottom captions button">
        <svg aria-hidden="true" viewBox="0 0 26 24" slot="on">
          <path d="M22.832 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.41 10.1a3.63 3.63 0 0 1-1.51.32 4.76 4.76 0 0 1-1.63-.27 4 4 0 0 1-1.28-.83 3.67 3.67 0 0 1-.84-1.26 4.23 4.23 0 0 1-.3-1.63 4.28 4.28 0 0 1 .3-1.64 3.53 3.53 0 0 1 .84-1.21 3.89 3.89 0 0 1 1.29-.8 4.76 4.76 0 0 1 1.63-.27 4.06 4.06 0 0 1 1.35.24c.225.091.44.205.64.34a2.7 2.7 0 0 1 .55.52l-1.27 1a1.79 1.79 0 0 0-.6-.46 2 2 0 0 0-.83-.16 2 2 0 0 0-1.56.69 2.35 2.35 0 0 0-.46.77 2.78 2.78 0 0 0-.16 1c-.009.34.046.68.16 1 .104.283.26.545.46.77.188.21.415.38.67.5a2 2 0 0 0 .84.18 1.87 1.87 0 0 0 .9-.21 1.78 1.78 0 0 0 .65-.6l1.38 1a2.88 2.88 0 0 1-1.22 1.01Zm7.52 0a3.63 3.63 0 0 1-1.51.32 4.76 4.76 0 0 1-1.63-.27 3.89 3.89 0 0 1-1.28-.83 3.55 3.55 0 0 1-.85-1.26 4.23 4.23 0 0 1-.3-1.63 4.28 4.28 0 0 1 .3-1.64 3.43 3.43 0 0 1 .85-1.25 3.75 3.75 0 0 1 1.28-.8 4.76 4.76 0 0 1 1.63-.27 4 4 0 0 1 1.35.24c.225.091.44.205.64.34.21.144.395.32.55.52l-1.27 1a1.79 1.79 0 0 0-.6-.46 2 2 0 0 0-.83-.16 2 2 0 0 0-1.56.69 2.352 2.352 0 0 0-.46.77 3.01 3.01 0 0 0-.16 1c-.003.34.05.678.16 1 .108.282.263.542.46.77.188.21.416.38.67.5a2 2 0 0 0 .84.18 1.87 1.87 0 0 0 .9-.21 1.78 1.78 0 0 0 .65-.6l1.38 1a2.82 2.82 0 0 1-1.21 1.05Z"/>
        </svg>
        <svg aria-hidden="true" viewBox="0 0 26 24" slot="off">
          <path d="M22.832 5.68a2.58 2.58 0 0 0-2.3-2.5c-1.81-.12-4.67-.18-7.53-.18-2.86 0-5.72.06-7.53.18a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c1.81.12 4.67.18 7.53.18 2.86 0 5.72-.06 7.53-.18a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.137-.21-8.283 0-12.42a1.11 1.11 0 0 1 .91-1.11c1.67-.11 4.43-.18 7.43-.18s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.137.21 8.283 0 12.42ZM10.843 14a1.55 1.55 0 0 1-.76.18 1.57 1.57 0 0 1-.71-.18 1.69 1.69 0 0 1-.57-.42 2.099 2.099 0 0 1-.38-.58 2.47 2.47 0 0 1 0-1.64 2 2 0 0 1 .39-.66 1.73 1.73 0 0 1 .58-.42c.23-.103.479-.158.73-.16.241-.004.48.044.7.14.199.088.373.222.51.39l1.08-.89a2.179 2.179 0 0 0-.47-.44 2.81 2.81 0 0 0-.54-.32 2.91 2.91 0 0 0-.58-.15 2.71 2.71 0 0 0-.56 0 4.08 4.08 0 0 0-1.38.15 3.27 3.27 0 0 0-1.09.67 3.14 3.14 0 0 0-.71 1.06 3.62 3.62 0 0 0-.26 1.39 3.57 3.57 0 0 0 .26 1.38 3 3 0 0 0 .71 1.06c.316.293.687.52 1.09.67.443.16.91.238 1.38.23a3.2 3.2 0 0 0 1.28-.27c.401-.183.747-.47 1-.83l-1.17-.88a1.42 1.42 0 0 1-.53.52Zm6.62 0a1.58 1.58 0 0 1-.76.18 1.54 1.54 0 0 1-.7-.18 1.69 1.69 0 0 1-.57-.42 2.12 2.12 0 0 1-.43-.58 2.29 2.29 0 0 1 .39-2.3 1.84 1.84 0 0 1 1.32-.58c.241-.003.48.045.7.14.199.088.373.222.51.39l1.08-.92a2.43 2.43 0 0 0-.47-.44 3.22 3.22 0 0 0-.53-.29 2.999 2.999 0 0 0-.57-.15 2.87 2.87 0 0 0-.57 0 4.06 4.06 0 0 0-1.36.15 3.17 3.17 0 0 0-1.09.67 3 3 0 0 0-.72 1.06 3.62 3.62 0 0 0-.25 1.39 3.57 3.57 0 0 0 .25 1.38c.16.402.405.764.72 1.06a3.17 3.17 0 0 0 1.09.67c.44.16.904.237 1.37.23.441 0 .877-.092 1.28-.27a2.45 2.45 0 0 0 1-.83l-1.15-.85a1.49 1.49 0 0 1-.54.49Z"/>
        </svg>
      </media-captions-button>
      <media-captions-listbox slot="listbox" part="bottom captions listbox"></media-captions-listbox>
    </media-captions-selectmenu>
  </template>

  <template partial="AirplayButton">
    <media-airplay-button part="bottom airplay button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg aria-hidden="true" viewBox="0 0 26 24" slot="airplay">
        <path
          d="M13.19 14.22a.25.25 0 0 0-.38 0l-5.46 6.37a.25.25 0 0 0 .19.41h10.92a.25.25 0 0 0 .19-.41l-5.46-6.37Z"
        />
        <path
          d="M22 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h2.94L8 16.75H4.25V4.25h17.5v12.5H18L19.06 18H22a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
        />
      </svg>
    </media-airplay-button>
  </template>

  <template partial="CastButton">
    <media-cast-button part="bottom cast button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg aria-hidden="true" viewBox="0 0 26 24" slot="enter">
        <path d="M3 15.5V17c2.206 0 4 1.794 4 4h1.5A5.5 5.5 0 0 0 3 15.5Zm0 3V21h2.5A2.5 2.5 0 0 0 3 18.5Z" />
        <path d="M3 12.5V14c3.86 0 7 3.14 7 7h1.5A8.5 8.5 0 0 0 3 12.5Z" />
        <path
          d="M22 3H4a1 1 0 0 0-1 1v6.984c.424 0 .84.035 1.25.086V4.25h17.5v15.5h-8.82c.051.41.086.826.086 1.25H22a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 26 24" slot="exit">
        <path d="M3 15.5V17c2.206 0 4 1.794 4 4h1.5A5.5 5.5 0 0 0 3 15.5Zm0 3V21h2.5A2.5 2.5 0 0 0 3 18.5Z" />
        <path d="M3 12.5V14c3.86 0 7 3.14 7 7h1.5A8.5 8.5 0 0 0 3 12.5Z" />
        <path
          d="M22 3H4a1 1 0 0 0-1 1v6.984c.424 0 .84.035 1.25.086V4.25h17.5v15.5h-8.82c.051.41.086.826.086 1.25H22a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
        />
        <path d="M20.5 5.5h-15v5.811c3.52.906 6.283 3.67 7.189 7.19H20.5V5.5Z" />
      </svg>
    </media-cast-button>
  </template>

  <template partial="PipButton">
    <media-pip-button part="bottom pip button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg aria-hidden="true" viewBox="0 0 26 24" slot="enter">
        <path
          d="M22 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6.75v-1.25h-6.5V4.25h17.5v6.5H23V4a1 1 0 0 0-1-1Zm0 10h-8a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1Zm-.5 6.5h-7v-5h7v5Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 26 24" slot="exit">
        <path
          d="M22 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6.75v-1.25h-6.5V4.25h17.5v6.5H23V4a1 1 0 0 0-1-1Zm0 10h-8a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1Zm-.5 6.5h-7v-5h7v5Z"
        />
      </svg>
    </media-pip-button>
  </template>

  <template partial="FullscreenButton">
    <media-fullscreen-button part="bottom fullscreen button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="enter">
        <path
          d="M20.25 14.5a.76.76 0 0 0-.75.75v4.25h-4.25a.75.75 0 1 0 0 1.5h5a.76.76 0 0 0 .75-.75v-5a.76.76 0 0 0-.75-.75Zm0-11.5h-5a.76.76 0 0 0-.75.75.76.76 0 0 0 .75.75h4.25v4.25a.75.75 0 1 0 1.5 0v-5a.76.76 0 0 0-.75-.75ZM8.75 19.5H4.5v-4.25a.76.76 0 0 0-.75-.75.76.76 0 0 0-.75.75v5a.76.76 0 0 0 .75.75h5a.75.75 0 1 0 0-1.5Zm0-16.5h-5a.76.76 0 0 0-.75.75v5a.76.76 0 0 0 .75.75.76.76 0 0 0 .75-.75V4.5h4.25a.76.76 0 0 0 .75-.75.76.76 0 0 0-.75-.75Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" slot="exit">
        <path
          d="M20.25 14.5h-5a.76.76 0 0 0-.75.75v5a.75.75 0 1 0 1.5 0V16h4.25a.75.75 0 1 0 0-1.5Zm-5-5h5a.75.75 0 1 0 0-1.5H16V3.75a.75.75 0 1 0-1.5 0v5a.76.76 0 0 0 .75.75Zm-6.5 5h-5a.75.75 0 1 0 0 1.5H8v4.25a.75.75 0 1 0 1.5 0v-5a.76.76 0 0 0-.75-.75Zm0-11.5a.76.76 0 0 0-.75.75V8H3.75a.75.75 0 0 0 0 1.5h5a.76.76 0 0 0 .75-.75v-5A.76.76 0 0 0 8.75 3Z"
        />
      </svg>
    </media-fullscreen-button>
  </template>

  <template partial="LiveButton">
    <media-live-button
      part="{{section ?? 'top'}} live button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-live-button>
  </template>

  <template partial="PlaybackRateButton">
    <media-playback-rate-button
      rates="{{playbackrates}}"
      part="bottom playback-rate button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-playback-rate-button>
  </template>

  <template partial="VolumeRange">
    <media-volume-range
      part="bottom volume range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-volume-range>
  </template>

  <template partial="TimeDisplay">
    <media-time-display
      remaining="{{defaultshowremainingtime}}"
      showduration="{{!hideduration}}"
      part="bottom time display"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-time-display>
  </template>

  <template partial="TimeRange">
    <media-time-range
      part="bottom time range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-time-range>
  </template>

  <media-controller
    part="controller"
    defaultstreamtype="{{defaultstreamtype ?? 'on-demand'}}"
    breakpoints="sm:300 md:700"
    gesturesdisabled="{{disabled}}"
    hotkeys="{{hotkeys}}"
    nohotkeys="{{nohotkeys}}"
    novolumepref="{{novolumepref}}"
    audio="{{audio}}"
    noautoseektolive="{{noautoseektolive}}"
    defaultsubtitles="{{defaultsubtitles}}"
    exportparts="layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer"
  >
    <slot name="media" slot="media"></slot>
    <slot name="poster" slot="poster"></slot>
    <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

    <template if="audio">

      <template if="streamtype == 'on-demand'">
        <template if="title">
          <media-control-bar>{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar>
          {{>PlayButton}}
          {{>SeekBackwardButton}}
          {{>SeekForwardButton}}
          {{>TimeDisplay}}
          {{>TimeRange}}
          {{>MuteButton}}
          {{>VolumeRange}}
          {{>PlaybackRateButton}}
          {{>AudioTrackSelect}}
          {{>AirplayButton}}
          {{>CastButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">

        <template if="targetlivewindow > 0">
          <template if="title">
            <media-control-bar>{{>TitleDisplay}}</media-control-bar>
          </template>
          <media-control-bar>
            {{>PlayButton}}
            {{>LiveButton section="bottom"}}
            {{>SeekBackwardButton}}
            {{>SeekForwardButton}}
            {{>TimeDisplay}}
            {{>TimeRange}}
            {{>MuteButton}}
            {{>VolumeRange}}
            {{>PlaybackRateButton}}
            {{>AudioTrackSelect}}
            {{>AirplayButton}}
            {{>CastButton}}
          </media-control-bar>
        </template>

        <template if="!targetlivewindow">
          <template if="title">
            <media-control-bar>{{>TitleDisplay}}</media-control-bar>
          </template>
          <media-control-bar>
            {{>PlayButton}}
            {{>LiveButton section="bottom"}}
            {{>MuteButton}}
            {{>VolumeRange}}
            <div class="spacer"></div>
            {{>AudioTrackSelect}}
            {{>AirplayButton}}
            {{>CastButton}}
          </media-control-bar>
        </template>

      </template>
    </template>

    <template if="!audio">

      <template if="streamtype == 'on-demand'">

        <template if="!breakpointsm">
          {{>TimeRange}}
          <media-control-bar>
            {{>PlayButton}}
            {{>MuteButton}}
            <div class="spacer"></div>
            {{>CaptionsSelect}}
            {{>FullscreenButton}}
          </media-control-bar>
        </template>

        <template if="breakpointsm">
          <template if="!breakpointmd">
            <media-control-bar slot="top-chrome">
              {{>TitleDisplay}}
            </media-control-bar>
            <div slot="centered-chrome" class="center-controls">
              {{>SeekBackwardButton section="center"}}
              {{>PlayButton section="center"}}
              {{>SeekForwardButton section="center"}}
            </div>
            {{>TimeRange}}
            <media-control-bar>
              {{>PlayButton}}
              {{>TimeDisplay}}
              {{>MuteButton}}
              {{>VolumeRange}}
              <div class="spacer"></div>
              {{>RenditionSelect}}
              {{>PlaybackRateButton}}
              {{>AudioTrackSelect}}
              {{>CaptionsSelect}}
              {{>AirplayButton}}
              {{>CastButton}}
              {{>PipButton}}
              {{>FullscreenButton}}
            </media-control-bar>
          </template>
        </template>

        <template if="breakpointmd">
          <media-control-bar slot="top-chrome">
            {{>TitleDisplay}}
          </media-control-bar>
          <div slot="centered-chrome" class="center-controls">
            {{>PlayButton section="center"}}
          </div>
          {{>TimeRange}}
          <media-control-bar>
            {{>PlayButton}}
            {{>SeekBackwardButton}}
            {{>SeekForwardButton}}
            {{>TimeDisplay}}
            {{>MuteButton}}
            {{>VolumeRange}}
            <div class="spacer"></div>
            {{>RenditionSelect}}
            {{>PlaybackRateButton}}
            {{>AudioTrackSelect}}
            {{>CaptionsSelect}}
            {{>AirplayButton}}
            {{>CastButton}}
            {{>PipButton}}
            {{>FullscreenButton}}
          </media-control-bar>
        </template>

      </template>

      <template if="streamtype == 'live'">

        <template if="!targetlivewindow">

          <template if="!breakpointsm">
            <media-control-bar slot="top-chrome">
              {{>LiveButton}}
            </media-control-bar>
            <media-control-bar>
              {{>PlayButton}}
              {{>MuteButton}}
              <div class="spacer"></div>
              {{>CaptionsSelect}}
              {{>FullscreenButton}}
            </media-control-bar>
          </template>

          <template if="breakpointsm">
            <template if="!breakpointmd">
              <media-control-bar slot="top-chrome">
                {{>LiveButton}}
                {{>TitleDisplay}}
              </media-control-bar>
              <div slot="centered-chrome" class="center-controls">
                {{>PlayButton section="center"}}
              </div>
              <media-control-bar>
                {{>PlayButton}}
                {{>MuteButton}}
                {{>VolumeRange}}
                <div class="spacer"></div>
                {{>RenditionSelect}}
                {{>AudioTrackSelect}}
                {{>CaptionsSelect}}
                {{>AirplayButton}}
                {{>CastButton}}
                {{>PipButton}}
                {{>FullscreenButton}}
              </media-control-bar>
            </template>
          </template>

          <template if="breakpointmd">
            <media-control-bar slot="top-chrome">
              {{>LiveButton}}
              {{>TitleDisplay}}
            </media-control-bar>
            <div slot="centered-chrome" class="center-controls">
              {{>PlayButton section="center"}}
            </div>
            <media-control-bar>
              {{>PlayButton}}
              {{>MuteButton}}
              {{>VolumeRange}}
              <div class="spacer"></div>
              {{>RenditionSelect}}
              {{>AudioTrackSelect}}
              {{>CaptionsSelect}}
              {{>AirplayButton}}
              {{>CastButton}}
              {{>PipButton}}
              {{>FullscreenButton}}
            </media-control-bar>
          </template>
        </template>

        <template if="targetlivewindow > 0">

          <template if="!breakpointsm">
            <media-control-bar slot="top-chrome">
              {{>LiveButton}}
            </media-control-bar>
            {{>TimeRange}}
            <media-control-bar>
              {{>PlayButton}}
              {{>MuteButton}}
              <div class="spacer"></div>
              {{>CaptionsSelect}}
              {{>FullscreenButton}}
            </media-control-bar>
          </template>

          <template if="breakpointsm">
            <template if="!breakpointmd">
              <media-control-bar slot="top-chrome">
                {{>LiveButton}}
                {{>TitleDisplay}}
              </media-control-bar>
              <div slot="centered-chrome" class="center-controls">
                {{>SeekBackwardButton section="center"}}
                {{>PlayButton section="center"}}
                {{>SeekForwardButton section="center"}}
              </div>
              {{>TimeRange}}
              <media-control-bar>
                {{>PlayButton}}
                {{>MuteButton}}
                {{>VolumeRange}}
                <div class="spacer"></div>
                {{>RenditionSelect}}
                {{>AudioTrackSelect}}
                {{>CaptionsSelect}}
                {{>AirplayButton}}
                {{>CastButton}}
                {{>PipButton}}
                {{>FullscreenButton}}
              </media-control-bar>
            </template>
          </template>

          <template if="breakpointmd">
            <media-control-bar slot="top-chrome">
              {{>LiveButton}}
              {{>TitleDisplay}}
            </media-control-bar>
            <div slot="centered-chrome" class="center-controls">
              {{>PlayButton section="center"}}
            </div>
            {{>TimeRange}}
            <media-control-bar>
              {{>PlayButton}}
              {{>SeekBackwardButton}}
              {{>SeekForwardButton}}
              {{>MuteButton}}
              {{>VolumeRange}}
              <div class="spacer"></div>
              {{>RenditionSelect}}
              {{>AudioTrackSelect}}
              {{>CaptionsSelect}}
              {{>AirplayButton}}
              {{>CastButton}}
              {{>PipButton}}
              {{>FullscreenButton}}
            </media-control-bar>
          </template>

        </template>

      </template>

    </template>

    <slot></slot>

  </media-controller>
</template>
`,dX=l7.createElement("template");"innerHTML"in dX&&(dX.innerHTML=dz);var dJ,d0,d1=class extends lL{};d1.template=null==(d0=null==(dJ=dX.content)?void 0:dJ.children)?void 0:d0[0],l4.customElements.get("media-theme-classic")||l4.customElements.define("media-theme-classic",d1);var d2={SRC:"src",POSTER:"poster"},d5={STYLE:"style",DEFAULT_HIDDEN_CAPTIONS:"default-hidden-captions",PRIMARY_COLOR:"primary-color",SECONDARY_COLOR:"secondary-color",FORWARD_SEEK_OFFSET:"forward-seek-offset",BACKWARD_SEEK_OFFSET:"backward-seek-offset",PLAYBACK_TOKEN:"playback-token",THUMBNAIL_TOKEN:"thumbnail-token",STORYBOARD_TOKEN:"storyboard-token",STORYBOARD_SRC:"storyboard-src",THUMBNAIL_TIME:"thumbnail-time",AUDIO:"audio",NOHOTKEYS:"nohotkeys",HOTKEYS:"hotkeys",PLAYBACK_RATES:"playbackrates",DEFAULT_SHOW_REMAINING_TIME:"default-show-remaining-time",TITLE:"title",PLACEHOLDER:"placeholder",THEME:"theme",DEFAULT_STREAM_TYPE:"default-stream-type",TARGET_LIVE_WINDOW:"target-live-window",NO_VOLUME_PREF:"no-volume-pref"},d3=["audio","backwardseekoffset","defaultshowremainingtime","defaultsubtitles","noautoseektolive","disabled","exportparts","forwardseekoffset","hideduration","hotkeys","nohotkeys","playbackrates","defaultstreamtype","streamtype","style","targetlivewindow","template","title","novolumepref"];function d4(e){return e.getAttributeNames().filter(e=>e.startsWith("metadata-")).reduce((t,i)=>{let a=e.getAttribute(i);return null!==a&&(t[i.replace(/^metadata-/,"").replace(/-/g,"_")]=a),t},{})}var d7,d8,d6,d9,ue,ut,ui,ua,ur,un,us,uo,ul,ud,uu,uc,uh,um,up,uv,ub,uE=Object.values(oQ),uf=Object.values(d2),ug=Object.values(d5),u_={dialog:void 0,isDialogOpen:!1},uy=class extends dR{constructor(){super(),lC(this,ut),lC(this,ua),lC(this,un),lC(this,uo),lC(this,ud),lC(this,uc),lC(this,um),lC(this,uv),lC(this,d7,!1),lC(this,d8,{}),lC(this,d6,!0),lC(this,d9,new df(this,"hotkeys")),lC(this,ue,{...u_,onCloseErrorDialog:()=>lx(this,un,us).call(this,{dialog:void 0,isDialogOpen:!1}),onInitFocusDialog:e=>{du(this,l7.activeElement)||e.preventDefault()}}),this.attachShadow({mode:"open"}),lx(this,ua,ur).call(this),this.isConnected&&lx(this,ut,ui).call(this)}static get observedAttributes(){var e;return[...null!=(e=dR.observedAttributes)?e:[],...uf,...uE,...ug]}get mediaTheme(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("media-theme")}get mediaController(){var e,t;return null==(t=null==(e=this.mediaTheme)?void 0:e.shadowRoot)?void 0:t.querySelector("media-controller")}connectedCallback(){var e;let t=null==(e=this.shadowRoot)?void 0:e.querySelector("mux-video");t&&(t.metadata=d4(this))}attributeChangedCallback(e,t,i){var a;switch(lx(this,ut,ui).call(this),super.attributeChangedCallback(e,t,i),e){case d5.HOTKEYS:lM(this,d9).value=i;break;case d5.THUMBNAIL_TIME:null!=i&&this.tokens.thumbnail&&d_(l6("Use of thumbnail-time with thumbnail-token is currently unsupported. Ignore thumbnail-time.").format({}));break;case d5.THUMBNAIL_TOKEN:{let{aud:e}=dr(i);i&&"t"!==e&&d_(l6("The provided thumbnail-token should have audience value 't' instead of '{aud}'.").format({aud:e}));break}case d5.STORYBOARD_TOKEN:{let{aud:e}=dr(i);i&&"s"!==e&&d_(l6("The provided storyboard-token should have audience value 's' instead of '{aud}'.").format({aud:e}));break}case oQ.PLAYBACK_ID:null!=i&&i.includes("?token")&&dy(l6("The specificed playback ID {playbackId} contains a token which must be provided via the playback-token attribute.").format({playbackId:i}));break;case oQ.STREAM_TYPE:i&&![aZ.LIVE,aZ.ON_DEMAND,aZ.UNKNOWN].includes(i)?["ll-live","live:dvr","ll-live:dvr"].includes(this.streamType)?this.targetLiveWindow=i.includes("dvr")?Number.POSITIVE_INFINITY:0:dA({file:"invalid-stream-type.md",message:l6("Invalid stream-type value supplied: `{streamType}`. Please provide stream-type as either: `on-demand` or `live`").format({streamType:this.streamType})}):this.targetLiveWindow=i===aZ.LIVE?0:Number.NaN}[oQ.PLAYBACK_ID,d2.SRC,d5.PLAYBACK_TOKEN].includes(e)&&t!==i&&lO(this,ue,{...lM(this,ue),...u_}),lx(this,uo,ul).call(this,{[null!=(a=dE[e])?a:dt(e)]:i})}get preferCmcd(){var e;return null!=(e=this.getAttribute(oQ.PREFER_CMCD))?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?aJ.includes(e)?this.setAttribute(oQ.PREFER_CMCD,e):d_(`Invalid value for preferCmcd. Must be one of ${aJ.join()}`):this.removeAttribute(oQ.PREFER_CMCD))}get hasPlayed(){var e,t;return null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute("media-has-played"))&&t}get inLiveWindow(){var e;return null==(e=this.mediaController)?void 0:e.hasAttribute("media-time-is-live")}get _hls(){var e;return null==(e=this.media)?void 0:e._hls}get mux(){var e;return null==(e=this.media)?void 0:e.mux}get theme(){var e;return null!=(e=this.getAttribute(d5.THEME))?e:"classic"}set theme(e){this.setAttribute(d5.THEME,`${e}`)}get themeProps(){let e=this.mediaTheme;if(!e)return;let t={};for(let i of e.getAttributeNames()){if(d3.includes(i))continue;let a=e.getAttribute(i);t[dt(i)]=""===a||a}return t}set themeProps(e){var t,i;lx(this,ut,ui).call(this);let a={...this.themeProps,...e};for(let r in a){if(d3.includes(r))continue;let a=null==e?void 0:e[r];"boolean"==typeof a||null==a?null==(t=this.mediaTheme)||t.toggleAttribute(de(r),!!a):null==(i=this.mediaTheme)||i.setAttribute(de(r),a)}}get playbackId(){var e;return null!=(e=this.getAttribute(oQ.PLAYBACK_ID))?e:void 0}set playbackId(e){e?this.setAttribute(oQ.PLAYBACK_ID,e):this.removeAttribute(oQ.PLAYBACK_ID)}get src(){var e,t;return this.playbackId?null!=(e=uA(this,d2.SRC))?e:void 0:null!=(t=this.getAttribute(d2.SRC))?t:void 0}set src(e){e?this.setAttribute(d2.SRC,e):this.removeAttribute(d2.SRC)}get poster(){var e;let t=this.getAttribute(d2.POSTER);return null!=t?t:this.playbackId&&!this.audio?dp(this.playbackId,{domain:this.customDomain,thumbnailTime:null!=(e=this.thumbnailTime)?e:this.startTime,token:this.tokens.thumbnail}):void 0}set poster(e){e||""===e?this.setAttribute(d2.POSTER,e):this.removeAttribute(d2.POSTER)}get storyboardSrc(){var e;return null!=(e=this.getAttribute(d5.STORYBOARD_SRC))?e:void 0}set storyboardSrc(e){e?this.setAttribute(d5.STORYBOARD_SRC,e):this.removeAttribute(d5.STORYBOARD_SRC)}get storyboard(){return this.storyboardSrc&&!this.tokens.storyboard?this.storyboardSrc:this.audio||!this.playbackId||!this.streamType||[aZ.LIVE,aZ.UNKNOWN].includes(this.streamType)?void 0:dv(this.playbackId,{domain:this.customDomain,token:this.tokens.storyboard})}get audio(){return this.hasAttribute(d5.AUDIO)}set audio(e){if(!e){this.removeAttribute(d5.AUDIO);return}this.setAttribute(d5.AUDIO,"")}get hotkeys(){return lM(this,d9)}get nohotkeys(){return this.hasAttribute(d5.NOHOTKEYS)}set nohotkeys(e){if(!e){this.removeAttribute(d5.NOHOTKEYS);return}this.setAttribute(d5.NOHOTKEYS,"")}get thumbnailTime(){return di(this.getAttribute(d5.THUMBNAIL_TIME))}set thumbnailTime(e){this.setAttribute(d5.THUMBNAIL_TIME,`${e}`)}get title(){var e;return null!=(e=this.getAttribute(d5.TITLE))?e:""}set title(e){e!==this.title&&(e?this.setAttribute(d5.TITLE,e):this.removeAttribute("title"),super.title=e)}get placeholder(){var e;return null!=(e=uA(this,d5.PLACEHOLDER))?e:""}set placeholder(e){this.setAttribute(d5.PLACEHOLDER,`${e}`)}get primaryColor(){var e,t;let i=this.getAttribute(d5.PRIMARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=l4.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_primary-color"))?void 0:t.trim()))return i}set primaryColor(e){this.setAttribute(d5.PRIMARY_COLOR,`${e}`)}get secondaryColor(){var e,t;let i=this.getAttribute(d5.SECONDARY_COLOR);if(null!=i||this.mediaTheme&&(i=null==(t=null==(e=l4.getComputedStyle(this.mediaTheme))?void 0:e.getPropertyValue("--_secondary-color"))?void 0:t.trim()))return i}set secondaryColor(e){this.setAttribute(d5.SECONDARY_COLOR,`${e}`)}get defaultShowRemainingTime(){return this.hasAttribute(d5.DEFAULT_SHOW_REMAINING_TIME)}set defaultShowRemainingTime(e){e?this.setAttribute(d5.DEFAULT_SHOW_REMAINING_TIME,""):this.removeAttribute(d5.DEFAULT_SHOW_REMAINING_TIME)}get playbackRates(){if(this.hasAttribute(d5.PLAYBACK_RATES))return this.getAttribute(d5.PLAYBACK_RATES).trim().split(/\s*,?\s+/).map(e=>Number(e)).filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t)}set playbackRates(e){if(!e){this.removeAttribute(d5.PLAYBACK_RATES);return}this.setAttribute(d5.PLAYBACK_RATES,e.join(" "))}get forwardSeekOffset(){var e;return null!=(e=di(this.getAttribute(d5.FORWARD_SEEK_OFFSET)))?e:10}set forwardSeekOffset(e){this.setAttribute(d5.FORWARD_SEEK_OFFSET,`${e}`)}get backwardSeekOffset(){var e;return null!=(e=di(this.getAttribute(d5.BACKWARD_SEEK_OFFSET)))?e:10}set backwardSeekOffset(e){this.setAttribute(d5.BACKWARD_SEEK_OFFSET,`${e}`)}get defaultHiddenCaptions(){return this.hasAttribute(d5.DEFAULT_HIDDEN_CAPTIONS)}set defaultHiddenCaptions(e){e?this.setAttribute(d5.DEFAULT_HIDDEN_CAPTIONS,""):this.removeAttribute(d5.DEFAULT_HIDDEN_CAPTIONS)}get playerSoftwareName(){var e;return null!=(e=this.getAttribute(oQ.PLAYER_SOFTWARE_NAME))?e:"mux-player"}get playerSoftwareVersion(){var e;return null!=(e=this.getAttribute(oQ.PLAYER_SOFTWARE_VERSION))?e:dh}get beaconCollectionDomain(){var e;return null!=(e=this.getAttribute(oQ.BEACON_COLLECTION_DOMAIN))?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(oQ.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(oQ.BEACON_COLLECTION_DOMAIN))}get maxResolution(){var e;return null!=(e=this.getAttribute(oQ.MAX_RESOLUTION))?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(oQ.MAX_RESOLUTION,e):this.removeAttribute(oQ.MAX_RESOLUTION))}get customDomain(){var e;return null!=(e=this.getAttribute(oQ.CUSTOM_DOMAIN))?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(oQ.CUSTOM_DOMAIN,e):this.removeAttribute(oQ.CUSTOM_DOMAIN))}get envKey(){var e;return null!=(e=uA(this,oQ.ENV_KEY))?e:void 0}set envKey(e){this.setAttribute(oQ.ENV_KEY,`${e}`)}get noVolumePref(){return this.hasAttribute(d5.NO_VOLUME_PREF)}set noVolumePref(e){e?this.setAttribute(d5.NO_VOLUME_PREF,""):this.removeAttribute(d5.NO_VOLUME_PREF)}get debug(){return null!=uA(this,oQ.DEBUG)}set debug(e){e?this.setAttribute(oQ.DEBUG,""):this.removeAttribute(oQ.DEBUG)}get disableCookies(){return null!=uA(this,oQ.DISABLE_COOKIES)}set disableCookies(e){e?this.setAttribute(oQ.DISABLE_COOKIES,""):this.removeAttribute(oQ.DISABLE_COOKIES)}get streamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(oQ.STREAM_TYPE))?t:null==(e=this.media)?void 0:e.streamType)?i:aZ.UNKNOWN}set streamType(e){this.setAttribute(oQ.STREAM_TYPE,`${e}`)}get defaultStreamType(){var e,t,i;return null!=(i=null!=(t=this.getAttribute(d5.DEFAULT_STREAM_TYPE))?t:null==(e=this.mediaController)?void 0:e.getAttribute(d5.DEFAULT_STREAM_TYPE))?i:aZ.ON_DEMAND}set defaultStreamType(e){e?this.setAttribute(d5.DEFAULT_STREAM_TYPE,e):this.removeAttribute(d5.DEFAULT_STREAM_TYPE)}get targetLiveWindow(){var e,t;return this.hasAttribute(d5.TARGET_LIVE_WINDOW)?+this.getAttribute(d5.TARGET_LIVE_WINDOW):null!=(t=null==(e=this.media)?void 0:e.targetLiveWindow)?t:Number.NaN}set targetLiveWindow(e){e!=this.targetLiveWindow&&(null==e?this.removeAttribute(d5.TARGET_LIVE_WINDOW):this.setAttribute(d5.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e;return null==(e=this.media)?void 0:e.liveEdgeStart}get startTime(){return di(uA(this,oQ.START_TIME))}set startTime(e){this.setAttribute(oQ.START_TIME,`${e}`)}get preferPlayback(){let e=this.getAttribute(oQ.PREFER_PLAYBACK);if(e===az.MSE||e===az.NATIVE)return e}set preferPlayback(e){e!==this.preferPlayback&&(e===az.MSE||e===az.NATIVE?this.setAttribute(oQ.PREFER_PLAYBACK,e):this.removeAttribute(oQ.PREFER_PLAYBACK))}get metadata(){var e;return null==(e=this.media)?void 0:e.metadata}set metadata(e){if(lx(this,ut,ui).call(this),!this.media){dy("underlying media element missing when trying to set metadata. metadata will not be set.");return}this.media.metadata={...d4(this),...e}}async addCuePoints(e){var t;if(lx(this,ut,ui).call(this),!this.media){dy("underlying media element missing when trying to addCuePoints. cuePoints will not be added.");return}return null==(t=this.media)?void 0:t.addCuePoints(e)}get activeCuePoint(){var e;return null==(e=this.media)?void 0:e.activeCuePoint}get cuePoints(){var e,t;return null!=(t=null==(e=this.media)?void 0:e.cuePoints)?t:[]}getStartDate(){var e;return null==(e=this.media)?void 0:e.getStartDate()}get currentPdt(){var e;return null==(e=this.media)?void 0:e.currentPdt}get tokens(){let e=this.getAttribute(d5.PLAYBACK_TOKEN),t=this.getAttribute(d5.THUMBNAIL_TOKEN),i=this.getAttribute(d5.STORYBOARD_TOKEN);return{...lM(this,d8),...null!=e?{playback:e}:{},...null!=t?{thumbnail:t}:{},...null!=i?{storyboard:i}:{}}}set tokens(e){lO(this,d8,null!=e?e:{})}get playbackToken(){var e;return null!=(e=this.getAttribute(d5.PLAYBACK_TOKEN))?e:void 0}set playbackToken(e){this.setAttribute(d5.PLAYBACK_TOKEN,`${e}`)}get thumbnailToken(){var e;return null!=(e=this.getAttribute(d5.THUMBNAIL_TOKEN))?e:void 0}set thumbnailToken(e){this.setAttribute(d5.THUMBNAIL_TOKEN,`${e}`)}get storyboardToken(){var e;return null!=(e=this.getAttribute(d5.STORYBOARD_TOKEN))?e:void 0}set storyboardToken(e){this.setAttribute(d5.STORYBOARD_TOKEN,`${e}`)}addTextTrack(e,t,i,a){var r;let n=null==(r=this.media)?void 0:r.nativeEl;if(n)return ra(n,e,t,i,a)}removeTextTrack(e){var t;let i=null==(t=this.media)?void 0:t.nativeEl;if(i){let t;return void(null==(t=Array.prototype.find.call(i.querySelectorAll("track"),t=>t.track===e))||t.remove())}}get textTracks(){var e;return null==(e=this.media)?void 0:e.textTracks}};function uA(e,t){return e.media?e.media.getAttribute(t):e.getAttribute(t)}d7=new WeakMap,d8=new WeakMap,d6=new WeakMap,d9=new WeakMap,ue=new WeakMap,ut=new WeakSet,ui=function(){var e,t,i,a;if(!lM(this,d7)){lO(this,d7,!0),lx(this,uo,ul).call(this);try{if(customElements.upgrade(this.mediaTheme),!(this.mediaTheme instanceof l4.HTMLElement))throw""}catch{dy("<media-theme> failed to upgrade!")}try{if(customElements.upgrade(this.media),!(this.media instanceof oz))throw""}catch{dy("<mux-video> failed to upgrade!")}try{if(customElements.upgrade(this.mediaController),!(this.mediaController instanceof e3))throw""}catch{dy("<media-controller> failed to upgrade!")}a=this,a.querySelectorAll(":scope > track").forEach(e=>{var t;null==(t=a.media)||t.append(e.cloneNode())}),dI.forEach(e=>{var t;null==(t=a.media)||t.addEventListener(e,e=>{a.dispatchEvent(new Event(e.type))})}),lx(this,ud,uu).call(this),lx(this,uc,uh).call(this),lx(this,um,up).call(this),lO(this,d6,null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute("userinactive"))||t),lx(this,uv,ub).call(this),null==(i=this.media)||i.addEventListener("streamtypechange",()=>{lx(this,uo,ul).call(this)})}},ua=new WeakSet,ur=function(){var e,t;try{null==(e=null==window?void 0:window.CSS)||e.registerProperty({name:"--media-primary-color",syntax:"<color>",inherits:!0}),null==(t=null==window?void 0:window.CSS)||t.registerProperty({name:"--media-secondary-color",syntax:"<color>",inherits:!0})}catch{}},un=new WeakSet,us=function(e){Object.assign(lM(this,ue),e),lx(this,uo,ul).call(this)},uo=new WeakSet,ul=function(e={}){var t,i,a;let r;(function(e,t){e.renderInto(t)})(dY((t={...lM(this,ue),...e},{src:!this.playbackId&&this.src,playbackId:this.playbackId,hasSrc:!!this.playbackId||!!this.src,poster:this.poster,storyboard:this.storyboard,storyboardSrc:this.getAttribute(d5.STORYBOARD_SRC),placeholder:this.getAttribute("placeholder"),themeTemplate:function(e){var t,i;let a=e.theme;if(a){let r=null==(i=null==(t=e.getRootNode())?void 0:t.getElementById)?void 0:i.call(t,a);if(r&&r instanceof HTMLTemplateElement)return r;a.startsWith("media-theme-")||(a=`media-theme-${a}`);let n=l4.customElements.get(a);if(null!=n&&n.template)return n.template}}(this),thumbnailTime:!this.tokens.thumbnail&&this.thumbnailTime,autoplay:this.autoplay,crossOrigin:this.crossOrigin,loop:this.loop,noHotKeys:this.hasAttribute(d5.NOHOTKEYS),hotKeys:this.getAttribute(d5.HOTKEYS),muted:this.muted,paused:this.paused,preload:this.preload,envKey:this.envKey,preferCmcd:this.preferCmcd,debug:this.debug,disableCookies:this.disableCookies,tokens:this.tokens,beaconCollectionDomain:this.beaconCollectionDomain,maxResolution:this.maxResolution,metadata:this.metadata,playerSoftwareName:this.playerSoftwareName,playerSoftwareVersion:this.playerSoftwareVersion,startTime:this.startTime,preferPlayback:this.preferPlayback,audio:this.audio,defaultStreamType:this.defaultStreamType,targetLiveWindow:this.getAttribute(oQ.TARGET_LIVE_WINDOW),streamType:db(this.getAttribute(oQ.STREAM_TYPE)),primaryColor:this.primaryColor,secondaryColor:this.secondaryColor,forwardSeekOffset:this.forwardSeekOffset,backwardSeekOffset:this.backwardSeekOffset,defaultHiddenCaptions:this.defaultHiddenCaptions,defaultShowRemainingTime:this.defaultShowRemainingTime,hideDuration:(r=null==(a=this.mediaController)?void 0:a.querySelector("media-time-display"))&&"none"===getComputedStyle(r).getPropertyValue("--media-duration-display-display").trim(),playbackRates:this.getAttribute(d5.PLAYBACK_RATES),customDomain:null!=(i=this.getAttribute(oQ.CUSTOM_DOMAIN))?i:void 0,title:this.getAttribute(d5.TITLE),novolumepref:this.hasAttribute(d5.NO_VOLUME_PREF),...t})),this.shadowRoot)},ud=new WeakSet,uu=function(){let e=e=>{var t,i;if(!(null!=e&&e.startsWith("theme-")))return;let a=e.replace(/^theme-/,"");if(d3.includes(a))return;let r=this.getAttribute(e);null!=r?null==(t=this.mediaTheme)||t.setAttribute(a,r):null==(i=this.mediaTheme)||i.removeAttribute(a)};new MutationObserver(t=>{for(let{attributeName:i}of t)e(i)}).observe(this,{attributes:!0}),this.getAttributeNames().forEach(e)},uc=new WeakSet,uh=function(){var e;this.addEventListener("error",e=>{let{detail:t}=e;if(t instanceof aK||(t=new aK(t.message,t.code,t.fatal)),!(null!=t&&t.fatal)){d_(t),t.data&&d_(`${t.name} data:`,t.data);return}let{dialog:i,devlog:a}=dZ(t,!window.navigator.onLine,this.playbackId,this.playbackToken);a.message&&dA(a),dy(t),t.data&&dy(`${t.name} data:`,t.data),lx(this,un,us).call(this,{isDialogOpen:!0,dialog:i})}),this.media&&(this.media.errorTranslator=(e={})=>{var t,i,a;if(!((null==(t=this.media)?void 0:t.error)instanceof aK))return e;let{devlog:r}=dZ(null==(i=this.media)?void 0:i.error,!window.navigator.onLine,this.playbackId,this.playbackToken,!1);return{player_error_code:null==(a=this.media)?void 0:a.error.code,player_error_message:r.message?String(r.message):e.player_error_message,player_error_context:r.context?String(r.context):e.player_error_context}}),null==(e=this.media)||e.addEventListener("error",e=>{var t,i;let{detail:a}=e;if(!a){let{message:e,code:r}=null!=(i=null==(t=this.media)?void 0:t.error)?i:{};a=new aK(e,r)}null!=a&&a.fatal&&this.dispatchEvent(new CustomEvent("error",{detail:a}))})},um=new WeakSet,up=function(){var e,t,i,a;let r=()=>lx(this,uo,ul).call(this);null==(t=null==(e=this.media)?void 0:e.textTracks)||t.addEventListener("addtrack",r),null==(a=null==(i=this.media)?void 0:i.textTracks)||a.addEventListener("removetrack",r)},uv=new WeakSet,ub=function(){var e,t;let i=/.*Version\/.*Safari\/.*/.test(navigator.userAgent);if(!/Firefox/i.test(navigator.userAgent))return;let a,r=new WeakMap,n=()=>this.streamType===aZ.LIVE&&!this.secondaryColor&&this.offsetWidth>=800,s=(e,t,a=!1)=>{n()||Array.from(e&&e.activeCues||[]).forEach(e=>{if(!(!e.snapToLines||e.line<-5||e.line>=0&&e.line<10)){if(!t||this.paused){let t=e.text.split(`
`).length,n=i?-2:-3;this.streamType===aZ.LIVE&&(n=i?-1:-2);let s=n-t;(e.line!==s||a)&&(r.has(e)||r.set(e,e.line),e.line=s-1,e.line=s)}else setTimeout(()=>{e.line=r.get(e)||"auto"},500)}})},o=()=>{var e,t;s(a,null!=(t=null==(e=this.mediaController)?void 0:e.hasAttribute("userinactive"))&&t)},l=()=>{var e,t;let i=Array.from((null==(t=null==(e=this.mediaController)?void 0:e.media)?void 0:t.textTracks)||[]).filter(e=>["subtitles","captions"].includes(e.kind)&&"showing"===e.mode)[0];i!==a&&(null==a||a.removeEventListener("cuechange",o)),null==(a=i)||a.addEventListener("cuechange",o),s(a,lM(this,d6))};if(l(),null==(e=this.textTracks)||e.addEventListener("change",l),null==(t=this.textTracks)||t.addEventListener("addtrack",l),navigator.userAgent.includes("Chrome/")){let e=()=>{s(a,lM(this,d6),!0),this.paused||window.requestAnimationFrame(e)};this.addEventListener("playing",()=>{e()})}this.addEventListener("userinactivechange",()=>{var e,t;let i=null==(t=null==(e=this.mediaController)?void 0:e.hasAttribute("userinactive"))||t;lM(this,d6)!==i&&(lO(this,d6,i),s(a,lM(this,d6)))})},l4.customElements.get("mux-player")||(l4.customElements.define("mux-player",uy),l4.MuxPlayerElement=uy)}}]);