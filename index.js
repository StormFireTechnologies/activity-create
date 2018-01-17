/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
var stream = require('getstream');
exports.subscribe = function subscribe(event, callback) {
  // The Cloud Pub/Sub Message object.
  var slug = event.data.attributes.slug;
  var uuid = event.data.attributes.uuid;
  var pubsubMessage = event.data.attributes;
  
  console.log('SLUG ', slug);
  console.log('UUID ', uuid);

  const client = stream.connect('c865s8tsjqam', '5k3gz97jhc4mhsntpxvy7qgx74gb5a2hk27nmbcnhfztpxvjdmuyjzeddykudmt5', '22948', { location: 'us-east' });
  
  var currentGamerFeed = client.feed('profile', uuid);
  
  const verb = pubsubMessage.verb;
  
  var activity = {};
  
  if (pubsubMessage.mentions) {
  	if (pubsubMessage.object) {
      activity = {
        "actor": pubsubMessage.uuid,
        "verb": pubsubMessage.verb,
        "object": pubsubMessage.object,
        verb: pubsubMessage.content,
        "foreign_id": pubsubMessage.verb + ':' + pubsubMessage.uuid,
        "to": pubsubMessage.mentions
      };
  	} else {
      activity = {
        "actor": pubsubMessage.uuid,
        "verb": pubsubMessage.verb,
        verb: pubsubMessage.content,
        "to": pubsubMessage.mentions
      };
  	}
  } else {
  	if (pubsubMessage.object) {
      activity = {
        "actor": pubsubMessage.uuid,
        "verb": pubsubMessage.verb,
        "object": pubsubMessage.object,
        "foreign_id": pubsubMessage.verb + pubsubMessage.uuid,
        verb: pubsubMessage.content
      };
  	} else {
      activity = {
        "actor": pubsubMessage.uuid,
        "verb": pubsubMessage.verb,
        verb: pubsubMessage.content
      };
  	}
  }
  
  currentGamerFeed.addActivity(activity);

  // Don't forget to call the callback.
  callback();
};
