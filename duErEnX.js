let input, canvas;
let navn = "";
let currentCharacter = null;
let startX = 10;
let startY = 30;
let lineHeight = 20;
let currentY = startY;

let musik, lyd;
let musikSlider, effektSlider;
let musikMuteBtn, effektMuteBtn;
let musikMuted = false;
let effektMuted = false;
let soundsLoaded = false;
let elementsInitialized = false;
let inputElement;

let faceParts = {
  øjne: [],
  næse: [],
  mund: [],
  rare: []
};

function preload() {
  // musik
  const musikPath = 'assets/sfx/musik.mp3';
  const lydPath = 'assets/sfx/lyd.mp3';
  musik = loadSound(musikPath, soundLoaded, soundLoadError);
  lyd = loadSound(lydPath, soundLoaded, soundLoadError);

  // ansigtsdele
  preloadAnsigtsdele();
}

function preloadAnsigtsdele() {
  ['øjne', 'næse', 'mund'].forEach(type => {
    for (let i = 0; i < 10; i++) {
      faceParts[type][i] = loadImage(`assets/ansigt/${type}/${i}.png`);
    }
  });
  
  // Indlæs rare billeder
  for (let i = 0; i < 4; i++) {
    faceParts.rare[i] = loadImage(`assets/ansigt/rare/${i}.png`);
  }
}

function soundLoaded() {
  if (musik.isLoaded() && lyd.isLoaded()) {
    soundsLoaded = true;
    if (elementsInitialized) {
      musik.setVolume(musikSlider.value());
      musik.loop();
    }
  }
}

function soundLoadError(err) {
  console.error("Fejl ved indlæsning af lydfil:", err);
}

function setup() {
  // Opret canvas i den dedikerede container
  let canvasContainer = select('#canvas-container');
  canvas = createCanvas(min(windowWidth - 40, 800), min(windowHeight - 250, 600));
  canvas.parent('canvas-container');
  
  background(225);
  createElements();
  textSize(14);
  textFont('Arial');
  elementsInitialized = true;
  
  if (soundsLoaded) {
    musik.setVolume(musikSlider.value());
    musik.loop();
  }
}

function createElements() {
  // Opret input element
  inputElement = createInput('');
  inputElement.attribute('placeholder', 'Indtast et navn...');
  inputElement.parent('ui-container');
  inputElement.addClass('name-input');
  
  // Tilføj event listener for Enter-tasten
  inputElement.elt.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      generateCharacter();
    }
  });
  
  // Opret knap container
  let btnContainer = createDiv();
  btnContainer.parent('ui-container');
  btnContainer.addClass('button-container');
  
  // Opret generer-knap
  let generateBtn = createButton('Generer');
  generateBtn.parent(btnContainer);
  generateBtn.mousePressed(generateCharacter);
  
  // Tilføj tilfældigt navn knap
  let randomNameBtn = createButton('Tilfældigt Navn');
  randomNameBtn.parent(btnContainer);
  randomNameBtn.id('random-name');
  randomNameBtn.mousePressed(function() {
    generateRandomName();
    generateCharacter();
  });
  
  // Lydkontroller container
  let audioContainer = createDiv();
  audioContainer.parent('ui-container');
  audioContainer.addClass('audio-controls');
  
  // Musik kontrol
  musikSlider = createSlider(0, 1, 0.5, 0.01);
  musikSlider.parent(audioContainer);
  musikSlider.addClass('audio-slider');
  
  musikMuteBtn = createButton("Mute Musik");
  musikMuteBtn.parent(audioContainer);
  musikMuteBtn.mousePressed(toggleMusikMute);
  
  // Effekt kontrol
  effektSlider = createSlider(0, 1, 0.5, 0.01);
  effektSlider.parent(audioContainer);
  effektSlider.addClass('audio-slider');
  
  effektMuteBtn = createButton("Mute Effekt");
  effektMuteBtn.parent(audioContainer);
  effektMuteBtn.mousePressed(toggleEffektMute);
}

function generateRandomName() {
  let fornavn = random(SandhedsDatabase.fornavnList);
  let efternavn = random(SandhedsDatabase.efternavnList);
  
  // 50% chance for at have mellemnavn
  if (random() < 0.5) {
    let mellemnavn1 = random(SandhedsDatabase.mellemnavnList);
    
    // 5% chance for at have 2 mellemnavne
    if (random() < 0.05) {
      let mellemnavn2;
      do {
        mellemnavn2 = random(SandhedsDatabase.mellemnavnList);
      } while (mellemnavn2 === mellemnavn1); // Sikre de er forskellige
      
      inputElement.value(`${fornavn} ${mellemnavn1} ${mellemnavn2} ${efternavn}`);
      return `${fornavn} ${mellemnavn1} ${mellemnavn2} ${efternavn}`;
    } else {
      inputElement.value(`${fornavn} ${mellemnavn1} ${efternavn}`);
      return `${fornavn} ${mellemnavn1} ${efternavn}`;
    }
  } else {
    inputElement.value(`${fornavn} ${efternavn}`);
    return `${fornavn} ${efternavn}`;
  }
}

function processDynamicValue(value, køn, race) {
  if (typeof value !== 'string') return value;
  
  if (value.includes('{køn}')) {
    value = value.replace(/{køn}/g, køn);
  }
  if (value.includes('{race}')) {
    value = value.replace(/{race}/g, race);
  }
  return value;
}

function draw() {
  background(225);
  if (currentCharacter) {
    drawFaceParts(currentCharacter);
    displayCharacter(currentCharacter);
  }
  
  if (currentCharacter) {
    displayCharacter(currentCharacter);
  } else {
    fill(0);
    text("Indtast et navn for at få sandheden", 10, 30);
  }

  updateVolumes();
}

function drawFaceParts(char) {
  const x = width - 288;  
  const y = height - 288; 

  image(faceParts.øjne[char.øjneIndex], x, y);
  image(faceParts.næse[char.næseIndex], x, y);
  image(faceParts.mund[char.mundIndex], x, y);
  
  // 1/200 chance for at vise et rare billede
  if (char.hasRareFace) {
    image(faceParts.rare[char.rareIndex], x, y);
  }
}

function updateVolumes() {
  if (!soundsLoaded || !elementsInitialized) return;
  
  try {
    // Opdater kun hvis ikke muted
    if (!musikMuted) {
      musik.setVolume(musikSlider.value());
    }
    if (!effektMuted) {
      lyd.setVolume(effektSlider.value());
    }
  } catch (err) {
    console.error("Fejl ved opdatering af lydstyrke:", err);
  }
}

function windowResized() {
  resizeCanvas(min(windowWidth - 40, 800), min(windowHeight - 250, 600));
  redraw();
}

function toggleMusikMute() {
  if (!soundsLoaded) return;
  
  musikMuted = !musikMuted;
  musikMuteBtn.html(musikMuted ? "Unmute Musik" : "Mute Musik");
  
  if (musikMuted) {
    musik.setVolume(0);
  } else {
    musik.setVolume(musikSlider.value());
  }
}

function toggleEffektMute() {
  if (!soundsLoaded) return;
  
  effektMuted = !effektMuted;
  effektMuteBtn.html(effektMuted ? "Unmute Effekt" : "Mute Effekt");
  
  if (effektMuted) {
    lyd.setVolume(0);
  } else {
    lyd.setVolume(effektSlider.value());
  }
}

function resetTextPos() {
  currentY = startY;
}

function printLine(txt, clr = color(0)) {
  fill(clr);
  text(txt, startX, currentY);
  currentY += lineHeight;
}

function generateCharacter() {
  navn = inputElement.value();
  if (navn !== "") {
    currentCharacter = generateCharacterData(navn);
    redraw();
  }
}

function generateCharacterData(seedInput) {
  randomSeed(hashCode(seedInput));
  
  if (soundsLoaded && !effektMuted) {
    lyd.stop();
    lyd.play();
  }

  let køn = random(SandhedsDatabase.kønList);
  let race = random(SandhedsDatabase.raceList);
  
  // Process job
  let job = random(SandhedsDatabase.jobList);
  job = processDynamicValue(job, køn, race);
  
  // Process personlighed
  let personlighed = random(SandhedsDatabase.personlighedList);
  personlighed = processDynamicValue(personlighed, køn, race);
  
  // Process sex orientation
  let sexOri = random(SandhedsDatabase.sexOriList);
  sexOri = processDynamicValue(sexOri, køn, race);
  
  // Process turn ons/offs
  let shuffledTurnOnOff = shuffle(SandhedsDatabase.turnOnOffList);
  let turnOns = shuffledTurnOnOff.slice(0, 3).map(item => processDynamicValue(item, køn, race));
  let turnOffs = shuffledTurnOnOff.slice(3, 6).map(item => processDynamicValue(item, køn, race));

  // Process musiksmag
  let musiksmag = random(SandhedsDatabase.musiksmagList);
  musiksmag = processDynamicValue(musiksmag, køn, race);

  // Process other attributes
  let humør = random(SandhedsDatabase.humørList);
  let karakter = random(SandhedsDatabase.karakterList);
  let øko = random(SandhedsDatabase.økoList);
  let dyreste = random(SandhedsDatabase.dyresteList);
  let fremtid = random(SandhedsDatabase.fremtidList);
  let hår = Math.random() < 0.9 ? random(SandhedsDatabase.hårTypeList) : "Skaldet";
  let stil = random(SandhedsDatabase.stilList);
  let højde = random(SandhedsDatabase.højdeList);
  if (højde === "158-211cm") højde = round(random(158, 211)) + "cm";
  let vægt = random(SandhedsDatabase.vægtList);
  let religion = random(SandhedsDatabase.religionList);
  let fornavn = random(SandhedsDatabase.fornavnList);
  let mellemnavn = random(SandhedsDatabase.mellemnavnList);
  let efternavn = random(SandhedsDatabase.efternavnList);

  // Process stats
  let styrke = random(SandhedsDatabase.strList);
  if (typeof styrke === "number") styrke = round(random(-1, 20));
  
  let dex = random(SandhedsDatabase.dexList);
  if (typeof dex === "number") dex = round(random(-1, 20));
  
  let con = random(SandhedsDatabase.conList);
  if (typeof con === "number") con = round(random(-1, 20));
  
  let intelligens = random(SandhedsDatabase.intList);
  if (typeof intelligens === "number") intelligens = round(random(-1, 20));
  
  let wis = random(SandhedsDatabase.wisList);
  if (typeof wis === "number") wis = round(random(-1, 20));
  
  let cha = random(SandhedsDatabase.chaList);
  if (typeof cha === "number") cha = round(random(-1, 20));

  // Process perks
  let shuffledPerks = shuffle(SandhedsDatabase.perkList);
  let selectedPerks = shuffledPerks.slice(0, 2).map(perk => {
    if (perk === "AIDS") return køn + " AIDS";
    return processDynamicValue(perk, køn, race);
  });

  let øjneIndex = floor(random(0, 10));
  let næseIndex = floor(random(0, 10));
  let mundIndex = floor(random(0, 10));
  
  // 1/200 chance for rare face
  let hasRareFace = random() < 0.005; // 0.005 = 1/200
  let rareIndex = hasRareFace ? floor(random(0, 4)) : null;

  return {
    navn: seedInput,
    køn: køn,
    job: job,
    race: race,
    personlighed: personlighed,
    sexOri: sexOri,
    turnOns: turnOns,
    turnOffs: turnOffs,
    humør: humør,
    karakter: karakter,
    øko: øko,
    dyreste: dyreste,
    fremtid: fremtid,
    hår: hår,
    stil: stil,
    højde: højde,
    vægt: vægt,
    religion: religion,
    musiksmag: musiksmag,
    styrke: styrke,
    dex: dex,
    con: con,
    intelligens: intelligens,
    wis: wis,
    cha: cha,
    perks: selectedPerks,
    øjneIndex: øjneIndex,
    næseIndex: næseIndex,
    mundIndex: mundIndex,
    hasRareFace: hasRareFace,
    rareIndex: rareIndex,
    fornavn: fornavn,
    mellemnavn: mellemnavn,
    efternavn: efternavn
  };
}


function displayCharacter(character) {
  resetTextPos();
  textSize(14);
  text("Navn: " + character.navn, 10, 10);
  
  printLine("Køn: " + character.køn);
  printLine("Job: " + character.job);
  printLine("Race: " + character.race);
  printLine("Personlighed: " + character.personlighed);
  printLine("Sexuel Orientering: " + character.sexOri);
  printLine("Turn-ons: " + character.turnOns.join(", "), color(0, 150, 0));
  printLine("Turn-offs: " + character.turnOffs.join(", "), color(150, 0, 0));
  printLine("Humør: " + character.humør);
  printLine("Karakter: " + character.karakter);
  printLine("Økonomi: " + character.øko);
  printLine("Dyreste eje: " + character.dyreste);
  printLine("Fremtid: " + character.fremtid);
  printLine("Hår: " + character.hår);
  printLine("Tøjstil: " + character.stil);
  printLine("Højde: " + character.højde);
  printLine("Vægt: " + character.vægt);
  printLine("Religion: " + character.religion);
  printLine("Musiksmag: " + character.musiksmag);

  let statsX = width - 240;
  let statsY = 30;
  fill(50);
  text("Stats", statsX, 10);
  fill(0);
  text("Styrke: " + character.styrke, statsX, statsY);
  text("Behændighed: " + character.dex, statsX, statsY + lineHeight);
  text("Helbred (HP): " + character.con, statsX, statsY + 2 * lineHeight);
  text("Intelligens: " + character.intelligens, statsX, statsY + 3 * lineHeight);
  text("Visdom: " + character.wis, statsX, statsY + 4 * lineHeight);
  text("Karisma: " + character.cha, statsX, statsY + 5 * lineHeight);
  text("Perks: " + character.perks.join(", "), statsX, statsY + 6 * lineHeight);
  
  // Vis en besked hvis de har en rare face
  if (character.hasRareFace) {
    let rareText = "✨ RARE FACE ✨";
    let rareY = statsY + 8 * lineHeight;
    let textW = textWidth(rareText);
    
    // Tegn outline (sort tekst 8 gange omkring)
    fill(0);
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        if (x !== 0 || y !== 0) {
          text(rareText, statsX + x, rareY + y);
        }
      }
    }
    
    // Tegn hovedteksten (guld) ovenpå
    fill(255, 215, 0);
    text(rareText, statsX, rareY);
    
    // Tegn stjerner med langsom, elegant animation
    noStroke();
    
    // Store faste stjerner i hjørnerne
    fill(255, 255, 200, 200);
    drawStar(statsX - 15, rareY - 8, 10, 5, 5);
    drawStar(statsX + textW + 15, rareY - 8, 10, 5, 5);
    
    // Animation af mindre stjerner
    let animFactor = sin(frameCount * 0.03) * 0.5 + 0.5; // 0-1 glat bølge
    
    // Midterstjerne (større animation)
    fill(255, 255, 200, 150 + animFactor * 100);
    drawStar(statsX + textW/2, rareY - 12 - animFactor * 4, 8 + animFactor * 2, 4 + animFactor, 5);
    
    // Side stjerner (mindre animation)
    fill(255, 255, 200, 120 + animFactor * 80);
    drawStar(statsX + textW * 0.25, rareY - 5 - animFactor * 2, 6 + animFactor, 3 + animFactor * 0.5, 5);
    drawStar(statsX + textW * 0.75, rareY - 5 - animFactor * 2, 6 + animFactor, 3 + animFactor * 0.5, 5);
  }
}

// Tegn en stjerne (skal være defineret i globalt scope)
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Hjælpefunktion til at tegne en stjerne
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

let starPositions = [];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return abs(hash);
}