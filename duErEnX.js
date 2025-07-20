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

function preload() {
  const musikPath = typeof __dirname !== 'undefined' ? __dirname + '/assets/musik.mp3' : 'assets/musik.mp3';
  const lydPath = typeof __dirname !== 'undefined' ? __dirname + '/assets/lyd.mp3' : 'assets/lyd.mp3';
  
  musik = loadSound(musikPath, soundLoaded, soundLoadError);
  lyd = loadSound(lydPath, soundLoaded, soundLoadError);
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
  canvas = createCanvas(min(windowWidth - 40, 800), min(windowHeight - 250, 600));
  background(225);
  createElements();
  textSize(14);
  textFont('Arial');
  positionElements();
  elementsInitialized = true;
  
  if (soundsLoaded) {
    musik.setVolume(musikSlider.value());
    musik.loop();
  }
}

function createElements() {
  input = createInput('');
  input.input(() => navn = input.value());
  input.changed(() => {
    if (navn !== "") {
      currentCharacter = generateCharacterData(navn);
      redraw();
    }
  });

  musikSlider = createSlider(0, 1, 0.5, 0.01);
  effektSlider = createSlider(0, 1, 0.5, 0.01);

  musikMuteBtn = createButton("Mute Musik");
  musikMuteBtn.mousePressed(toggleMusikMute);
  effektMuteBtn = createButton("Mute Effekt");
  effektMuteBtn.mousePressed(toggleEffektMute);
}

function draw() {
  background(225);
  
  if (currentCharacter) {
    displayCharacter(currentCharacter);
  } else {
    fill(0);
    text("Indtast et navn for at få sandheden", 10, 30);
  }

  updateVolumes();
}

function updateVolumes() {
  if (!soundsLoaded || !elementsInitialized) return;
  
  try {
    if (!musikMuted) musik.setVolume(musikSlider.value());
    if (!effektMuted) lyd.setVolume(effektSlider.value());
  } catch (err) {
    console.error("Fejl ved opdatering af lydstyrke:", err);
  }
}

function positionElements() {
  if (!canvas || !input || !musikSlider || !effektSlider || !musikMuteBtn || !effektMuteBtn) return;

  const cx = (windowWidth - width) / 2;
  canvas.position(cx, 50);
  input.position(cx + (width - input.width) / 2, canvas.y + height + 10);

  musikSlider.position(cx + 20, input.y + 40);
  musikMuteBtn.position(musikSlider.x + musikSlider.width + 10, musikSlider.y);

  effektSlider.position(cx + 20, musikSlider.y + 30);
  effektMuteBtn.position(effektSlider.x + effektSlider.width + 10, effektSlider.y);
}

function windowResized() {
  resizeCanvas(min(windowWidth - 40, 800), min(windowHeight - 250, 600));
  positionElements();
  redraw();
}

function toggleMusikMute() {
  if (!soundsLoaded) return;
  musikMuted = !musikMuted;
  musikMuteBtn.html(musikMuted ? "Unmute Musik" : "Mute Musik");
  updateVolumes();
}

function toggleEffektMute() {
  if (!soundsLoaded) return;
  effektMuted = !effektMuted;
  effektMuteBtn.html(effektMuted ? "Unmute Effekt" : "Mute Effekt");
  updateVolumes();
}

function resetTextPos() {
  currentY = startY;
}

function printLine(txt, clr = color(0)) {
  fill(clr);
  text(txt, startX, currentY);
  currentY += lineHeight;
}

function generateCharacterData(seedInput) {
  randomSeed(hashCode(seedInput));
  
  if (soundsLoaded && !effektMuted) {
    lyd.stop();
    lyd.play();
  }

  let kønList = ["Dreng", "Pige", "Ludderen", "Minecraft Mesa Biome", "Virksomhed", "Markeplejer"];
  let køn = random(kønList);

  let jobList = ["Netto", "Ridder", "Luder", "Fransk " + køn, "Arbejdsløs", "Gamer", "Pædagog", "Svindler", "Regøringsdame", "Cykelrytter", "Pornostjerne", "Steffen Brandt"];
  let raceList = ["God", "Underlegen", "Formula1", "Luddder", "Shrek", "Fed", "Mexico", "Normal"];
  let personlighedList = ["Emo", "Terrorist", "Lurder-" + køn, "Sigma", "Racist", "Idiot", "Ryan Gosling", "Selvglad"];
  let sexOriList = ["Dyr", køn, "Alt", "Børn", "Gay", "Stegepander", "Fiktive Kvinder", "Pixels", "Sig selv"];

  let turnOnOffList = ["Børn", "Store patter", "Rødbedesaft", "Fedme", "Prostituerede-" + køn, "Kage", "Reb", "Pikke", "Lugt", "Furry", "Smerte", "Blonde", "Interacial", "Ost", "Rugbrødsmadder", "Afføring", "Urin", "Blod", "Sæd", "Havenisse", "Frøer", "Risengrød", "Kesha", "Zanzibar", "Øl"];
  let humørList = ["Luderisk", "Skattesvinder", "Glad", "Psykotisk", "Tissetrængende", "Loden", "Svært Deprimeret", "Liderlig"];
  let karakterList = ["-3", "00", "02", "4", "7", "10", "12", "Istedgade"];
  let økoList = ["Mange", "Fattig", "Middelklasse", "Luksusfælden", "Luderisk Økonomi", "Olie-Baron"];
  let dyresteList = ["Cykel", "Chihuahua", "Toms Guldbar", "Guldbar", "Atlantisk Koloni", "Femboy Maid", "Mælkekarton", "NASA Computer", "PlayStation 3", "Godset"];
  let fremtidList = ["Død", "Rig", "Luder", "Kedelig", "Politiker", "Hjemløs", "Narkovrag", "Hjemløs og Narkovrag", "Atomfysiker", "Influencer", "Svensker", "Præsident af den demokratiske republik Zimbabwe", "Stuepige", "Aalborg Universitet Medialogi"];
  let hårTypeList = ["Krøllet", "Glat", "Fedtet", "Langt", "Kort", "Grimt", "Afro", "Luder", "Henningen", "Tagrenden", "Boosie Fade"];
  let stilList = ["Dårlig", "Luder", "Emo", "Gammel", "Bøsset", "Nøgen", "Elegant", "Cowboy", "Lærer", "Fursuit", "Elgiganten"];
  let højdeList = [round(random(158, 211)) + "cm", "Dværg", "Gnom", "Rundetårn", "Havenisse", "Basketball", "40.000.000 m", "Giraf", "Christianit", "Langt Højere Bjærge"];
  let vægtList = ["Usund", "Overvægtig", "Femboy", "Skelet", "Fed", "Gamer", "Helt normal"];
  let religionList = ["Heden", "Luder", "Flyvende Spaghetti Monster", "Borbon", "Spronk", "Jøde", "Kristen", "Buddhist", "MAGA", "Mortisme"];

  let strList = [round(random(-1, 20)), "9000+", "Moskusokse", "Bodybuilder", "Luder"];
  let dexList = [round(random(-1, 20)), "Rumæner", "Polak", "Cyklende", "Meget Højt Hus"];
  let conList = [round(random(-1, 20)), "Elefant", "Stenmur", "Dinosaurus"];
  let intList = [round(random(-1, 20)), "Klog rotter", "Autostol", "OBH Nordica Stavblender", "Venstre håndet"];
  let wisList = [round(random(-1, 20)), "Troldmand", "Kinesisk", "Undervands gris"];
  let chaList = [round(random(-1, 20)), "-999", "Rizzler", "Sexy", "Ikke sej"];

  let perkList = ["Mega diller", "Farveblind", "Diarré", "Kannibal", "Alkoholiker", "Sexy", "Ludoman", "AIDS", køn + " AIDS", "æbel tært", "PERK50", "Autisme"];

  let job = random(jobList);
  let race = random(raceList);
  let personlighed = random(personlighedList);
  let sexOri = random(sexOriList);

  let shuffledTurnOnOff = shuffle(turnOnOffList);
  let turnOns = shuffledTurnOnOff.slice(0, 3);
  let turnOffs = shuffledTurnOnOff.slice(3, 6);

  let humør = random(humørList);
  let karakter = random(karakterList);
  let øko = random(økoList);
  let dyreste = random(dyresteList);
  let fremtid = random(fremtidList);
  let hår = Math.random() < 0.9 ? random(hårTypeList) : "Skaldet";
  let stil = random(stilList);
  let højde = random(højdeList);
  let vægt = random(vægtList);
  let religion = random(religionList);

  let styrke = random(strList);
  let dex = random(dexList);
  let con = random(conList);
  let intelligens = random(intList);
  let wis = random(wisList);
  let cha = random(chaList);

  let shuffledPerks = shuffle(perkList);
  let selectedPerks = shuffledPerks.slice(0, 2);

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
    styrke: styrke,
    dex: dex,
    con: con,
    intelligens: intelligens,
    wis: wis,
    cha: cha,
    perks: selectedPerks
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
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return abs(hash);
}