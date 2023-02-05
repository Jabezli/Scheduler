// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

const descriptionBox = $('.description');
const currentDay = $('#currentDay');

var now = dayjs().format('dddd, MMMM D, YYYY');
var currentHour = dayjs().hour();

// 9AM to 6PM: 9 total hours
var totalHours = 9;

// variable state
var currentState = '';

var timeTableEl = '';

currentDay.text(now);

function colorHours (){
  if (currentHour > "") {
    
  }
}

function generateTimeTable() {
  for (var hour = 0; hour < totalHours; hour++) {
    // 9AM. real hour is the hours on the left side of the scheduler, which will be used to compare with current hour from dayjs
    var realHour = hour + 9; 

    if (currentHour === realHour) {
      // present is a class in the css, background color is red.
      currentState = 'present';
    } else if (currentHour < realHour) {
      currentState = 'future';
    } else {
      currentState = 'past';
    }

    if (realHour < 12) {
      //it means for hours before 12 p.m.
      timeTableEl = `${realHour} AM`;
    } else if (realHour === 12) {
      timeTableEl = `${realHour} PM`;
    } else {
      //this will show the afternoon hours as p.m.
      realHour = realHour - 12;
      timeTableEl = `${realHour} PM`
    }

    
    // using the code below to dynamically create each hour block. Learned this, template literal, with tutor.
    //comparing to normal string using '', this is using `` and only the classes/ids inside ${ } will change based on the 
    //if conditions above
    var timeBlock = `
      <div id="hour-${timeTableEl}" class="row time-block ${currentState}">
        <div class="col-2 col-md-1 hour text-center py-3">${timeTableEl}</div>
        <textarea class="col-8 col-md-10 description" rows="3"></textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>
    `

    $('.container-fluid').append(timeBlock);
  }
}

generateTimeTable();

const saveBtn = $('.saveBtn');
saveBtn.on("click", function(){
  let retrievedList = getList();
  let eventLists = {};
  //saveBtn is the same element for all the time block, so to figure out which btn is clicked
  //we used "this"here. 
  //it is "this".parent() -- parent element of "this" btn.
  eventLists.key = $(this).parent().attr('id'); 
  //it targes the value of the 2nd children of parent of this, which is the <textarea>
  eventLists.value = $(this).parent().children().eq(1).val();
  //the for and if below are to delete old note for the same "id" or time. Even though the render list function will always render the latest note to 
  //the same time block, the retrievedList won't be updated. Meaning if I keep updating notes for 9 AM, I will have tons of notes for 9 AM in local storage 
  //and I will always see the latest note due to renderlist for-loop.
  //The for-loop below will check if the currentKey exisits in the list and if so, the object with the same key will be deleted from the array.
  //then after that, the new object will be pushed to the array and save (setItem) to local storage.
  for (let i = 0; i < retrievedList.length; i++){
    let currentKey = eventLists.key;
    if (currentKey === retrievedList[i].key){
      retrievedList.splice(i,1);
    }
  }
  retrievedList.push(eventLists)
  localStorage.setItem("eventLists", JSON.stringify(retrievedList))
});

function getList (){
  let listArray = JSON.parse(localStorage.getItem("eventLists")) || [];
  return listArray;
}

renderList();

function renderList(){
  let retrievedList = getList();
  for (var i = 0; i < retrievedList.length; i++){
    let time = retrievedList[i].key; 
    let note = retrievedList[i].value;
    document.getElementById(time).children[1].value = note;
  }
}

