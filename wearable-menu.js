'use strict';

var connection, userData;
var clientId = /&clientId=([^&]+)/.exec(window.location.search)[1];

function userPoly(){
    return new Promise(function(resolve, reject){
        return resolve({userId: "521818417662001643", displayName: 'Steven', isModerator: true});
    })
}

function getNearestAncestor(el, selector){
    if(!el) return null;
    else if(el.matches(selector)) return el;
    else return getNearestAncestor(el.parentElement, selector);
}

function select(evt)
{
    var parentList = getNearestAncestor(evt.target, 'ol.wearable-selector');
    var listItem = getNearestAncestor(evt.target, 'ol.wearable-selector > li');
    var group = parentList.dataset.wearableGroup;
    var groupRef = connection.userRef.child('wearable').child(group);
    var wearable = listItem.dataset.wearable;
    wearable ? groupRef.set(wearable) : groupRef.remove();
}

Promise.all([
    altspace.utilities.sync.connect({
        authorId: 'AltspaceVR',
        appId: 'Wearables'
    }),
    (altspace.getUser || userPoly)()
])
.then(function(results)
{
    connection = results.shift();
    userData = results.shift();

    connection.userRef = connection.app.child('users').child(userData.userId);

    var selectablesList = document.querySelectorAll('ol.wearable-selector > li');
    selectablesList = Array.prototype.slice.call(selectablesList);
    selectablesList.forEach(function(el){
        el.addEventListener('click', select);
    });
})
.catch(function(err){ console.log(err); });