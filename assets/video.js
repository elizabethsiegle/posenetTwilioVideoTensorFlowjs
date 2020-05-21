(() => {
    'use strict';
    const TWILIO_DOMAIN = location.host;
    const ROOM_NAME = 'tf';
    const Video = Twilio.Video;
    let videoRoom, localStream;
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const minConfidence = 0.2;
    const VIDEO_WIDTH = 320;
    const VIDEO_HEIGHT = 240;
    const frameRate = 20;
    
    // preview screen
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(vid => {
        video.srcObject = vid;
        localStream = vid;
        const intervalID = setInterval(async () => {
            try {
                // ctx.scale(-1, 1);
                // ctx.translate(-VIDEO_WIDTH, 0);
                // ctx.restore();
                estimateMultiplePoses();
            } catch (err) {
                clearInterval(intervalID)
                setErrorMessage(err.message)
            }
        }, Math.round(1000 / frameRate))
        return () => clearInterval(intervalID)
    });    
    function drawKeypoints(keypoints) {
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        const { y, x } = keypoint.position;
        //webcamKeypoints.push(keypoint);
        drawPoint2(y, x, 3);
      }
    }
    function drawPoint(y, x, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }
    // draw the skeletons
    function drawSkeleton2() {
        // Loop through all the skeletons detected
        for (let i = 0; i < poses.length; i++) {
            let skeleton = poses[i].skeleton;
            // For every skeleton, loop through all body connections
            for (let j = 0; j < skeleton.length; j++) {
                let partA = skeleton[j][0];
                let partB = skeleton[j][1];
                stroke(255, 0, 0);
                line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
            }
        }
    }
    const estimateMultiplePoses = () => {
        posenet
          .load()
          .then(function(net) {
            console.log("estimateMultiplePoses .... ");
            return net.estimatePoses(video, {
              decodingMethod: "single-person",
            });
          })
          .then(function(poses) {
            console.log(`got Poses ${JSON.stringify(poses)}`);
            canvas.width = VIDEO_WIDTH;
            canvas.height = VIDEO_HEIGHT;
            ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            ctx.save();
            ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            ctx.restore();
            poses.forEach(({ score, keypoints }) => {
              if (score >= minConfidence) {
                drawKeypoints(keypoints);
                drawSkeleton(keypoints);
              }
            });
        });
    };   
    
    // buttons
    const joinRoomButton = document.getElementById("button-join");
    const leaveRoomButton = document.getElementById("button-leave");
    var site = `https://${TWILIO_DOMAIN}/video-token`;
    console.log(`site ${site}`);
    joinRoomButton.onclick = () => {
      // get access token
      axios.get(`https://${TWILIO_DOMAIN}/video-token`).then(async (body) => {
        const token = body.data.token;
        console.log(token);

        Video.connect(token, { name: ROOM_NAME }).then((room) => {
          console.log(`Connected to Room ${room.name}`);
          videoRoom = room;

          room.participants.forEach(participantConnected);
          room.on("participantConnected", participantConnected);

          room.on("participantDisconnected", participantDisconnected);
          room.once("disconnected", (error) =>
            room.participants.forEach(participantDisconnected)
          );
          joinRoomButton.disabled = true;
          leaveRoomButton.disabled = false;
        });
      });
    };
    leaveRoomButton.onclick = () => {
      videoRoom.disconnect();
      console.log(`Disconnected from Room ${videoRoom.name}`);
      joinRoomButton.disabled = false;
      leaveRoomButton.disabled = true;
    };
})();

const participantConnected = (participant) => {
    console.log(`Participant ${participant.identity} connected'`);

    const div = document.createElement('div');
    div.id = participant.sid;

    participant.on('trackSubscribed', track => trackSubscribed(div, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);
  
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(div, publication.track);
      }
    });
    document.body.appendChild(div);
}

const participantDisconnected = (participant) => {
    console.log(`Participant ${participant.identity} disconnected.`);
    document.getElementById(participant.sid).remove();
}

const trackSubscribed = (div, track) => {
    div.appendChild(track.attach());
}

const trackUnsubscribed = (track) => {
    track.detach().forEach(element => element.remove());
}
function estimatePoses(capture) {
  // call posenet to estimate a pose
  net
    .estimateMultiplePoses(capture.elt, imageScaleFactor, flipHorizontal, 16, 1)
    .then(function(poses) {
      if (poses.length > 0) {
        const pose = poses[0];

        if (pose.score > 0.1) {
          const leftHand = pose.keypoints[posenet.partIds["leftWrist"]];
          if (leftHand.score > 0.1) {
            leftHandX = leftHand.position.x;
            leftHandY = leftHand.position.y;
          }

          const rightHand = pose.keypoints[posenet.partIds["rightWrist"]];
          if (rightHand.score > 0.1) {
            rightHandX = rightHand.position.x;
            rightHandY = rightHand.position.y;
          }
        }
      }
    //   // next animation loop, call posenet again to estimate poses
    //   requestAnimationFrame(function() {
    //     estimatePoses(capture);
    //   });
    });
}







