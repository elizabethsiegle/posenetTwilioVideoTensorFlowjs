## Build a Video Web App with the Twilio CLI in Nine Minutes

To run this app, you will need 
- A Twilio account - [sign up for a free one here and receive an extra $10 if you upgrade through this link](http://www.twilio.com/referral/iHsJ5D)
- Account SID: [find it in your account console here](https://www.twilio.com/console)
- API Key SID and API Key Secret: [generate them here](https://www.twilio.com/console/runtime/api-keys)
- [The Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)

Add your Account SID, API Key, and API Key Secret to your `.env` and then install the Twilio Serverless Toolkit via the CLI if you haven't already by running
```bash
twilio plugins:install @twilio-labs/plugin-serverless
```

You can then see what commands the Serverless Toolkit offers by running
```bash
twilio serverless
```
Run `twilio serverless:deploy` and <em>tada</em> grab that HTML site, share it with some friends, and join the room.
![tilde, me, mica](https://lh5.googleusercontent.com/vBIw4x95wxdQTH8aYxFnkasXxyae_3KwZL0YsDa5LfePnakr4XAeY8RVQVzk0nzx6bwpjCNV-S3haPAYatHC--bXiIugW58EGYHq7mA1iXQC3i0CWePQgcTmIgz3vlzydVJcGHJo)