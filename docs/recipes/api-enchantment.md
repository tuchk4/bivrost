# Api enchantment

## <a id='api-for-services'></a>[#](#api-for-services) Create api for popular services

For example twitter api:

```js
// twitter-api.js
import api from 'bivrost/http/api';

export default (authToken, config = {}) => {
  const adapter = fetchAdapter();

  let twitterApi = api({
    protocol: 'https:',
    host: 'api.twitter.com'
    prefix: '1.1',
    ...config,
    adapter: fetchAdapter({
      headers: {
        ...config.headers,
        TwitterOAuth: authToken
      }
    });
  });

  // Returns the 20 most recent mentions (tweets containing a users’s @screen_name)
  // for the authenticating user.
  twitterApi.mentionsTimeline = apiInstance('GET /statuses/mentions_timeline');

  // Returns a single Tweet, specified by the id parameter.
  twitterApi.show = apiInstance('GET /statuses/show/:id');

  return twitterApi;
}
```

Usage:

```js
import createTwitterApi from 'twitter-api'

const twitterApi = createTwitterApi(AUTH_TOKEN);

// manual call
twitterApi('GET /statuses/mentions_timeline');

// shortcut call
twitterApi.mentionsTimeline();

twitterApi.show({
    id: TWEET_ID
});
```

Same could be implemented for

* Github - https://developer.github.com/v3/
* Open weather api - https://openweathermap.org/api
* Slack chat - https://api.slack.com/
* Reddit - https://www.reddit.com/dev/api/
* Twitter - https://dev.twitter.com/rest/public
* etc.

## <a id='group-api-backend'></a>[#](#group-api-backend) Group api by backend services

Especially it is very useful for microservice architecture.

* *src/data/api/auth.js* - api for auth service service
* *src/data/api/users.js* - api for application users service
* *src/data/api/notifications.js* - api for notification service

Also such api functions could be easily shared between other applications.
