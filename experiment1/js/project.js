// project.js - purpose and description here
// Author: Leo Assimes
// Date: 4/7/2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const oldFillers = {
    adventurer: ["My dude", "Bro", "WesBot", "Adventurer", "Traveller", "Fellow", "Citizen", "Ashen One", "Dragonborn", "Cool person", "Tarnished", "勇者", "$adventurer and $adventurer", "$adventurer, $adventurer, and $adventurer", "Geoff"],
    pre: ["Fra", "Tro", "Gre", "Pan", "Ast", "Ara"],
    post: ["gria", "ston", "gott","-on-the-lee", "ora", "Ara", "uwu"],
    people: ["kindly", "meek", "brave", "wise", "sacred", "cherished", "honored", "forgotten", "apathetic", "mystic", "orca", "帥氣"],
    item: ["axe", "staff", "book", "cloak", "shield", "club", "sword", "magic gloves", "galvel", "fists", "mace", "potato"],
    num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
    looty: ["gleaming", "valuable", "esteemed", "rare", "exalted", "scintillating", "kinda gross but still usefull", "complete garbage"],
    loots: ["coins", "chalices", "ingots", "hides", "victory points", "gems","scrolls", "bananas", "noodles", "goblins", "CS Majors", "college credits"],
    baddies: ["orcs", "glubs", "fishmen", "cordungles", "mountain trolls", "college professors", "dragon", "evil $adventurer", "agents of chaos"],
    message: ["call", "txt", "post", "decree", "shoutz", "tweets", "choiche", "hearkens", "harkening", "harkenening", "harkenenening", "...wait, no! Come back", "Watermelon"],
    
  };
  
  const fillers = {
    possession: ["suitcase", "broadsword", "backpack", "creation", "handgun", "laptop", "microwaved mac n' cheese"],
    emotion1: ["anxiety", "guilt", "dread", "shame", "apprehension", "confusion"],
    emotion2: ["anticipation", "excitement", "triumph", "hope", "satisfaction", "confidence"],
    place: ["dorm room", "closet", "office", "campsite", "castle", "laboratory"],
    metaphor: ["blank slate", "prison cell", "safe haven", "special place", "bottomless pit"],
    character: ["Kay", "George", "Alex", "Dr. Sorenson", "???", "Sir C", "Gh0st"],
    relationship: ["roommate", "best friend", "stalker", "coach", "rival"],
  }
  
  const oldTemplate = `$adventurer, heed my $message!
  
  I have just come from $pre$post where the $people folk are in desperate need. Their town has been overrun by $baddies. You must venture forth at once, taking my $item, and help them.
  
  It is told that the one who can rescue them will be awarded with $num $looty $loots. Surely this must tempt one such as yourself!
  `;
  
  // This sequence is borrowed from my friend's game on itch.io. She made it for CMPM-80K and I got her permission to use it for fun here.
  const template = `You set your $possession down with a soft thud, a mix of $emotion1 and $emotion2 bubbling up inside you.
  The small $place feels like a $metaphor—bare, impersonal, with just enough room for two people to coexist without bumping into each other too often.
  $character, your $relationship, hasn't arrived yet.
  Their side is untouched, the bed bare with the standard mattress and an empty desk beside it.
  The aged ceiling lights flicker dully yellow.`
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();  
}

// let's get this party started - uncomment me
main();