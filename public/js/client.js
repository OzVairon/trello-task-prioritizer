/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

/*

t.board('id', 'name', 'url', 'shortLink', 'members')

t.list('id', 'name', 'cards')

t.lists('id', 'name', 'cards')

t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

t.member('id', 'fullName', 'username')

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

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
const FULL_SERVER_URL = 'https://trello-task-prioritizer.herokuapp.com/'
//const BASE_URL = '../'


function boardButtonCallback(t){  
    return utils.doIfAuth(t, function(t) {
      return t.modal({            
        url: './views/modal.html', 
        accentColor: '#ffffff', 
        height: 500, 
        fullscreen: false, 
        title: 'PLUGIN SETTINGS', 
      })
    })
};


function create_hours_badge(t, isDetailed) {
  return t.get('card', 'shared', 'effort_hours')
  .then((hours) => {
    let badge
    if (isDetailed || hours) {
      if (hours == undefined) hours = 'not defined';
      badge = {
          title: 'Hours effort', 
          text: hours + ' h',
          icon: GRAY_ICON, 
          callback: function(context) { 
            return context.popup({
              title: 'Hours effort settings',
              url: './views/effort_hours.html',
              height: 184 
            });
          }
        }
      return badge;
    }
  })
}

function create_related_cards_badge(t, isDetailed) {
  return t.card('attachments')
  .then((attachments) => {
    
    let related = find_related_cards(attachments.attachments);
    let badge

    if (isDetailed || related.length > 0) {
      badge = {
        title: 'Related cards', 
        text: related.length + ' related',
        icon: GRAY_ICON, 
      }
    }
    return badge
  })  
}


function getBadges(t, isDetailed){
  let result = [];
  return Promise.all(
    [
      create_hours_badge(t, isDetailed)
      .then((b) => {if (b) result.push(b)})
    ,
      Promise.all([
        create_related_cards_badge(t, isDetailed)
        ,
        Promise.all ([t.cards('all'), t.card('attachments')])
        .spread((cards, att) => {
          let related = find_related_cards(att.attachments)
          let unrelated = cards.filter(c => {return related.filter(rc => {return rc.name == c.id}).length == 0})
          let items = unrelated.map(
            function(card){
              let temp = related.filter((rc) => {return rc.name == card.id})
              let urlForCard = 'https://trello.com/c/' + card.id;
              return {
                text: card.name,
                url: urlForCard,
                callback: function(t){
                  if (t.memberCanWriteToModel('card')){
                    return t.attach({ url: urlForCard, name: card.id })
                    .then(function(){
                      return t.closePopup();
                    });
                  } else {
                    console.log("You don't have permission to add attachments to this card.")
                    return t.closePopup();
                  };
                }
              };
            });
          return items
        })

      ]).spread((badge, items) => {
        if (isDetailed && badge) {
          badge.callback = function(context) { 
            return context.popup({
              title: 'Cards relations',
              items: items,
              search: {
                count: 10, 
                placeholder: 'Search card',
                empty: 'No cards found'
              }
            });
          }
        }
        if (badge) result.push(badge)
      })
  ])
  .then(()=>{return result})
  .catch((err) => {
    console.log(err)
    return result
  })
};

function find_related_cards(attachments) {
  if (attachments) {
    let related = attachments.filter((attachment) => {
      // let base = 'https://trello.com/c/';
      // return (attachment.url.indexOf(base) === 0 && attachment.url.substring(base.length).length === 24);
      return isTrelloCardUrl(attachment.url)
    });
    return related
  } else return []
}

function related_cards(t, opt) {

  let claimed = find_related_cards(opt.entries)

  if(claimed && claimed.length > 0){
    return [{
      id: 'RelatedCards', // optional if you aren't using a function for the title
      claimed: claimed,
      icon: GLITCH_ICON,
      title: 'Related cards',
      content: {
        type: 'iframe',
        url: t.signUrl('./views/section.html'),
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


TrelloPowerUp.initialize({
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
    }]
  },
  'card-badges': function(t, options){
    return getBadges(t, false);
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t, true);
  },

  'authorization-status': function(t, options){
    return utils.isAuth(t);
  },
  'show-authorization': function(t, options){
    return utils.autorize(t)
  }
 
  
});

