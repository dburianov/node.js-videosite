var decodedFrames = 0;
var decodedPerSec = 0;
var audioBytesDecoded = 0;
var audioBytesDecodedPerSec = 0;
var videoBytesDecoded = 0;
var videoBytesDecodedPerSec = 0;
var droppedFrames = 0;
var droppedFramesPerSec = 0;

function Mean() {
  this.count = 0;
  this.sum = 0;
  
  this.record = function(val) {
    this.count++;
    this.sum += val;
  };
  
  this.mean = function() {
    return this.count ? (this.sum / this.count).toFixed(3) : 0;
  };
}


var decodedMean = new Mean();
var audioMean = new Mean();
var videoMean = new Mean();
var dropMean = new Mean();

function recalcRates() {
  var v = document.getElementById("video");

  if (v.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || v.paused) {
    return;
  }

  decodedPerSec = (v.webkitDecodedFrameCount - decodedFrames);
  decodedFrames = v.webkitDecodedFrameCount;

  audioBytesDecodedPerSec = v.webkitAudioDecodedByteCount - audioBytesDecoded;
  audioBytesDecoded = v.webkitAudioDecodedByteCount;

  videoBytesDecodedPerSec = v.webkitVideoDecodedByteCount - videoBytesDecoded;
  videoBytesDecoded = v.webkitVideoDecodedByteCount;

  droppedFramesPerSec = v.webkitDroppedFrameCount - droppedFrames;
  droppedFrames = v.webkitDroppedFrameCount;

console.log(droppedFrames);

  decodedMean.record(decodedPerSec);
  audioMean.record(audioBytesDecodedPerSec);
  videoMean.record(videoBytesDecodedPerSec);
  dropMean.record(droppedFramesPerSec);
  
  var d = document.getElementById("log");
//  d.innerHTML =
//        "Audio bytes decoded: " + v.webkitAudioDecodedByteCount + " average p/s: " + audioMean.mean() + "<br>" +
//        "Video bytes decoded: " + v.webkitVideoDecodedByteCount + " average p/s: " + videoMean.mean() + "<br>" +
//        "Decoded frames: " + v.webkitDecodedFrameCount + " average p/s: " + decodedMean.mean() + "<br>" +
//        "Dropped frames: " + v.webkitDroppedFrameCount + " average p/s: " + dropMean.mean() + "<br>";
}

var rR = setInterval(recalcRates, 1000);
