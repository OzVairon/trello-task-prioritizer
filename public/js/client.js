/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var GLITCH_ICON = './images/glitch.svg';
var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

//const BASE_URL = './'

const BASE_URL = '../'


var randomBadgeColor = function() {
  return ['green', 'yellow', 'red', 'none'][Math.floor(Math.random() * 4)];
};

var getBadges = function(t, isDetailed){

  return Promise.all([t.card('name').get('name'), t.get('card', 'shared', 'effort_hours')])
  .spread(function(cardName, hours){

    let result = [];

    if (isDetailed || hours) {
      if (hours == undefined) hours = 0;
      result.push(
        {
          title: 'Hours effort', // for detail badges only
          text: hours + ' h',
          icon: GRAY_ICON, // for card front badges only
          callback: function(context) { // function to run on click
            return context.popup({
              title: 'Hours effort settings',
              url: BASE_URL + 'views/effort_hours.html',
              height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
            });
          }
        }
        )

    }
    
    return result;
  })

};

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Popup List Example',
    items: [
      {
        text: 'Open Modal',
        callback: function(t){
          return t.modal({            
            url: BASE_URL + 'views/modal.html', // The URL to load for the iframe
            args: { text: 'Hello' }, // Optional args to access later with t.arg('text') on './modal.html'
            accentColor: '#ffffff', // Optional color for the modal header 
            height: 500, // Initial height for iframe; not used if fullscreen is true
            fullscreen: false, // Whether the modal should stretch to take up the whole screen
            //callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
            title: 'Настройте веса для критериев', // Optional title for modal header
            // You can add up to 3 action buttons on the modal header - max 1 on the right side.
            actions: []
          })
        }
      }
    ]
  });
};

var cardButtonCallback = function(t){
  // Trello Power-Up Popups are actually pretty powerful
  // Searching is a pretty common use case, so why reinvent the wheel
  var items = ['acad', 'arch', 'badl', 'crla', 'grca', 'yell', 'yose'].map(function(parkCode){
    var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
    var nameForCode = '🏞 ' + parkCode.toUpperCase();
    return {
      text: nameForCode,
      url: urlForCode,
      callback: function(t){
        // In this case we want to attach that park to the card as an attachment
        // but first let's ensure that the user can write on this model
        if (t.memberCanWriteToModel('card')){
          return t.attach({ url: urlForCode, name: nameForCode })
          .then(function(){
            // once that has completed we should tidy up and close the popup
            return t.closePopup();
          });
        } else {
          console.log("Oh no! You don't have permission to add attachments to this card.")
          return t.closePopup(); // We're just going to close the popup for now.
        };
      }
    };
  });

  // we could provide a standard iframe popup, but in this case we
  // will let Trello do the heavy lifting
  return t.popup({
    title: 'Popup Search Example',
    items: items, // Trello will search client-side based on the text property of the items
    search: {
      count: 5, // How many items to display at a time
      placeholder: 'Search National Parks',
      empty: 'No parks found'
    }
  });
  
  // in the above case we let Trello do the searching client side
  // but what if we don't have all the information up front?
  // no worries, instead of giving Trello an array of `items` you can give it a function instead
  /*
  return t.popup({
    title: 'Popup Async Search',
    items: function(t, options) {
      // use options.search which is the search text entered so far
      // and return a Promise that resolves to an array of items
      // similar to the items you provided in the client side version above
    },
    search: {
      placeholder: 'Start typing your search',
      empty: 'Huh, nothing there',
      searching: 'Scouring the internet...'
    }
  });
  */
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  // NOTE about asynchronous responses
  // If you need to make an asynchronous request or action before you can reply to Trello
  // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
  // The Promise should resolve to the object type that is expected to be returned
  'attachment-sections': function(t, options){
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment){
      return attachment.url.indexOf('http://ttp.data') === 0;
    });

    // you can have more than one attachment section on a card
    // you can group items together into one section, have a section
    // per attachment, or anything in between.
    console.log(claimed)
    if(claimed && claimed.length > 0){
      console.log(inside)
      // if the title for your section requires a network call or other
      // potentially length operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      return [{
        id: 'Yellowstone', // optional if you aren't using a function for the title
        claimed: claimed,
        icon: GLITCH_ICON,
        title: 'Example Attachment Section: Yellowstone',
        content: {
          type: 'iframe',
          url: t.signUrl(BASE_URL + 'views/section.html', { arg: 'you can pass your section args here' }),
          height: 230
        }
      }];
    } else {
      return [];
    }
  },
  'list-sorters': function (t) {
    return t.list('name', 'id')
    .then(function (list) {
      return [{
        text: "Card Name",
        callback: function (t, opts) {
          console.log(opts.cards)
          var sortedCards = opts.cards.sort(
            function(a,b) {
              if (a.name > b.name) {
                return 1;
              } else if (b.name > a.name) {
                return -1;
              }
              return 0;
            });
          
          return {
            sortedIds: sortedCards.map(function (c) { return c.id; })
          };
        }
      }, {
        text: "Randomize",
        callback: function (t, opts) {
          var sortedCards = opts.cards.sort(
            function(a,b) {
              return Math.floor(Math.random() * 4 - 1); 
            });
          
          return {
            sortedIds: sortedCards.map(function (c) { return c.id; })
          };
        }
      }];
    });
  },
  
  'board-buttons': function(t, options){
    return [{
      // we can either provide a button that has a callback function
      // that callback function should probably open a popup, overlay, or boardBar
      icon: WHITE_ICON,
      text: 'Popup OZV',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return getBadges(t, false);
  },
  'card-buttons': function(t, options) {
    return [{
      // usually you will provide a callback function to be run on button click
      // we recommend that you use a popup on click generally
      icon: GRAY_ICON, // don't use a colored icon here
      text: 'TP: Добавить параметры',
      callback: cardButtonCallback
    }];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t, true);
  },
  'card-from-url': function(t, options) {
    // options.url has the url in question
    // if we know cool things about that url we can give Trello a name and desc
    // to use when creating a card. Trello will also automatically add that url
    // as an attachment to the created card
    // As always you can return a Promise that resolves to the card details
    
    return new Promise(function(resolve) {
      resolve({
        name: '💻 ' + options.url + ' 🤔',
        desc: 'This Power-Up knows cool things about the attached url'
      });
    });
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
 
  'show-settings': function(t, options){
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: 'Settings',
      url: BASE_URL + 'views/settings.html',
      height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  },
  
  /*        
      
      🔑 Authorization Capabiltiies 🗝
      
      The following two capabilities should be used together to determine:
      1. whether a user is appropriately authorized
      2. what to do when a user isn't completely authorized
      
  */
  'authorization-status': function(t, options){
    // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
    // The boolean value determines whether your Power-Up considers the user to be authorized or not.
    
    // When the value is false, Trello will show the user an "Authorize Account" options when
    // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
    // below determines what should happen when the user clicks "Authorize Account"
    
    // For instance, if your Power-Up requires a token to be set for the member you could do the following:
    return t.get('member', 'private', 'token')
    .then(function(token){
      if(token){
        return { authorized: true };
      }
      return { authorized: false };
    });
    // You can also return the object synchronously if you know the answer synchronously.
  },
  'show-authorization': function(t, options){
    // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
    // which shows when 'authorization-status' returns { authorized: false }.
    
    // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
    // you'll need to add your API from trello.com/app-key below:
    let trelloAPIKey = '1bd6eb54b14babeeb34032a923075fbb';
    // This key will be used to generate a token that you can pass along with the API key to Trello's
    // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.
    
    // In this case we'll open a popup to kick off the authorization flow.
    if (trelloAPIKey) {
      return t.popup({
        title: 'My Auth Popup',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: BASE_URL + 'views/authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});

console.log('Loaded by: ' + document.referrer);