exports.handler = function(context, event, callback) {
    const TWILIO_ACCOUNT_SID = context.MAIN_ACCOUNT_SID;
    const TWILIO_API_KEY = context.TWILIO_VIDEO_KEY;
    const TWILIO_API_SECRET = context.TWILIO_VIDEO_SECRET;
    const ACCESS_TOKEN_IDENTITY =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);  // random client name 

    const ROOM_NAME = 'tf';  // fixed room name

    const AccessToken = Twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // only tokens are available for participating rooms
    const videoGrant = new VideoGrant({
        room: ROOM_NAME
    });

    const accessToken = new AccessToken(
        TWILIO_ACCOUNT_SID,
        TWILIO_API_KEY,
        TWILIO_API_SECRET
    );
    accessToken.addGrant(videoGrant);
    accessToken.identity = ACCESS_TOKEN_IDENTITY;
    callback(null, {
        token: accessToken.toJwt()
    });
};