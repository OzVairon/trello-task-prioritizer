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

const BASE_URL = './'

//const BASE_URL = '../'


var randomBadgeColor = function() {
  return ['green', 'yellow', 'red', 'none'][Math.floor(Math.random() * 4)];
};

function create_hours_badge(t, isDetailed) {
  return t.get('card', 'shared', 'effort_hours').then((hours) => {
    if (isDetailed || hours) {
      if (hours == undefined) hours = 'not defined';
      let badge = {
          title: 'Hours effort', 
          text: hours + ' h',
          icon: GRAY_ICON, 
          callback: function(context) { 
            return context.popup({
              title: 'Hours effort settings',
              url: BASE_URL + 'numeric' + '?description=' + 'Expected number of hours' + '&key=effort_hours',
              height: 184 
            });
          }
        }
      return badge;
    }
  })
}

function create_related_cards_badge(t, isDetailed) {
  return t.card('attachment').then((att) => {
    let related = find_related_cards;
    let badge
    if (isDetailed || related.size > 0) {
      badge = {
        title: 'Related cards', 
        text: related.size + 'related',
        icon: GRAY_ICON, 
      }
    }
    return badge
  })  
}




var getBadges = function(t, isDetailed){

  let result = [];
  
  create_hours_badge(t, isDetailed)
  .then((b) => {if (b) result.push(b)})
  .then(()=>{return result})
  .catch((err).console.log(err))
  // .create_related_cards_badge(t, isDetailed)
  // .then(badge => {
  //   if (badge) {
  //     badge.callback = function(context) { // function to run on click
  //       return context.popup({
  //         title: 'Cards relations',
  //         items: items,
  //           search: {
  //             count: 20, // How many items to display at a time
  //             placeholder: 'Search card',
  //             empty: 'No cards found',
  //             height: 184
  //           }
  //       });
  //     }
  //     result.push(badge)
  //   }
  // })
  



  // return Promise.all([t.card('name').get('name'), t.get('card', 'shared', 'effort_hours'), t.card('due'), t.cards('all')])
  // .spread(function(cardName, hours, due, cards){
  //   //console.log(moment.utc(due.due))
    
  //   if (isDetailed || hours) {
  //     if (hours == undefined) hours = 'not defined';
  //     result.push(
  //       {
  //         title: 'Hours effort', 
  //         text: hours + ' h',
  //         icon: GRAY_ICON, 
  //         callback: function(context) { // function to run on click
  //           return context.popup({
  //             title: 'Hours effort settings',
  //             url: BASE_URL + 'numeric' + '?description=' + 'Expected number of hours' + '&key=effort_hours',
  //             height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
  //           });
  //         }
  //       }
  //       )
  //   }

  //   let items = cards.map(
  //     function(card){
  //       var urlForCard = 'https://trello.com/c/' + card.id;
        
  //       return {
  //         text: card.name,
  //         url: urlForCard,
  //         callback: function(t){
  //           if (t.memberCanWriteToModel('card')){
  //             return t.attach({ url: urlForCard, name: card.id })
  //             .then(function(){
  //               return t.closePopup();
  //             });
  //           } else {
  //             console.log("Oh no! You don't have permission to add attachments to this card.")
  //             return t.closePopup(); // We're just going to close the popup for now.
  //           };
  //         }
  //       };
  //     });


  //   // result.push(
  //   //   {
  //   //     title: 'Related cards', 
  //   //     text: 'related',
  //   //     icon: GRAY_ICON, 
  //   //     callback: function(context) { // function to run on click
  //   //       return context.popup({
  //   //         title: 'Cards relations',
  //   //         items: items,
  //   //           search: {
  //   //             count: 20, // How many items to display at a time
  //   //             placeholder: 'Search card',
  //   //             empty: 'No cards found',
  //   //             height: 184
  //   //           }
  //   //       });
  //   //     }
     
  //   //   }
  //   // )

  //   create_related_cards_badge(t, isDetailed).then(badge => {
  //     if (badge) {
  //       badge.callback = function(context) { // function to run on click
  //         return context.popup({
  //           title: 'Cards relations',
  //           items: items,
  //             search: {
  //               count: 20, // How many items to display at a time
  //               placeholder: 'Search card',
  //               empty: 'No cards found',
  //               height: 184
  //             }
  //         });
  //       }
  //     }
  //   })

  //   return result;
  // })
};

function find_related_cards(attachments) {
  var related = attachments.filter(function(attachment){
    let base = 'https://trello.com/c/';
    return (attachment.url.indexOf(base) === 0 && attachment.url.substring(base.length).length === 24);
  });
  return related
}




var related_cards = function(t, opt) {

  var claimed = find_related_cards(opt.entries)

  if(claimed && claimed.length > 0){
    return [{
      id: 'RelatedCards', // optional if you aren't using a function for the title
      claimed: claimed,
      icon: GLITCH_ICON,
      title: 'Related cards',
      content: {
        type: 'iframe',
        url: t.signUrl(BASE_URL + 'section'),
        height: 230
      }
    }];
  } else {
    return [];
  }
}

function workingHoursBetweenDates(startDate, endDate, dayStart, dayEnd, includeWeekends) {  
    // Store minutes worked
    var minutesWorked = 0;

    // Validate input
    if (endDate < startDate) { return 0; }

    // Loop from your Start to End dates (by hour)
    var current = startDate;

    // Define work range
    var workHoursStart = dayStart;
    var workHoursEnd = dayEnd;

    // Loop while currentDate is less than end Date (by minutes)
    while(current <= endDate){      
        // Store the current time (with minutes adjusted)
        var currentTime = current.getHours() + (current.getMinutes() / 60);

        // Is the current time within a work day (and if it
        // occurs on a weekend or not)                   
        if(currentTime >= workHoursStart && currentTime < workHoursEnd && (includeWeekends ? current.getDay() !== 0 && current.getDay() !== 6 : true)){
              minutesWorked++;
        }

        // Increment current time
        current.setTime(current.getTime() + 1000 * 60);
    }

    // Return the number of hours
    return (minutesWorked / 60).toFixed(2);
}

var boardButtonCallback = function(t){  
  return t.modal({            
    url: BASE_URL + 'settings', // The URL to load for the iframe
    accentColor: '#ffffff', // Optional color for the modal header 
    height: 500, // Initial height for iframe; not used if fullscreen is true
    fullscreen: false, // Whether the modal should stretch to take up the whole screen
    title: 'Настройки плагина', // Optional title for modal header
    
  })        
};


// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  // NOTE about asynchronous responses
  // If you need to make an asynchronous request or action before you can reply to Trello
  // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
  // The Promise should resolve to the object type that is expected to be returned
  'attachment-sections': function(t, options){
    return related_cards(t, options)
  },
  'list-sorters': function (t) {
    return t.list('name', 'id')
    .then(function (list) {
      return [{
        text: "Card Name",
        callback: function (t, opts) {
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
      icon: WHITE_ICON,
      text: 'Task Prioritizer',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return getBadges(t, false);
  },
  
  'card-detail-badges': function(t, options) {
    return getBadges(t, true);
  },
 
  
});

console.log('Loaded by: ' + document.referrer);