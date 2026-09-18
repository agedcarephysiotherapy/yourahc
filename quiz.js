document.addEventListener('DOMContentLoaded',()=>{const PASS=/^YHC(?:[0-9]{3}|[1-9][0-9]{3})$/i;const questions=[
['Which city is the capital of Australia?',['Sydney','Canberra','Melbourne','Brisbane'],1,'Australia'],
['Which Australian animal is a marsupial?',['Koala','Emu','Crocodile','Kookaburra'],0,'Australia'],
['Which Australian state has Brisbane as its capital?',['Queensland','Victoria','Tasmania','South Australia'],0,'Australia'],
['Which Australian city is home to the Sydney Opera House?',['Perth','Adelaide','Sydney','Hobart'],2,'Australia'],
['Which Australian state has Melbourne as its capital?',['New South Wales','Victoria','Western Australia','Queensland'],1,'Australia'],
['What is the Great Barrier Reef?',['A desert','A coral reef system','A mountain range','A rainforest'],1,'Australia'],
['Which Australian state is separated from the mainland by Bass Strait?',['Tasmania','Victoria','Queensland','Western Australia'],0,'Australia'],
['Which Australian city is famous for the annual Australian Open tennis tournament?',['Melbourne','Darwin','Perth','Hobart'],0,'Australia'],
['Which animal appears alongside the emu on the Australian Coat of Arms?',['Kangaroo','Koala','Wombat','Platypus'],0,'Australia'],
['Uluru is located in which Australian territory?',['Australian Capital Territory','Northern Territory','Jervis Bay Territory','Norfolk Island'],1,'Australia'],
['Which Australian capital city is on the Swan River?',['Perth','Canberra','Hobart','Darwin'],0,'Australia'],
['Which Australian state is the largest by area?',['Queensland','Western Australia','New South Wales','South Australia'],1,'Australia'],
['Which city is the capital of South Australia?',['Adelaide','Perth','Melbourne','Darwin'],0,'Australia'],
['Which city is the capital of Tasmania?',['Hobart','Launceston','Devonport','Burnie'],0,'Australia'],
['Which Australian capital city is the northernmost?',['Darwin','Brisbane','Perth','Canberra'],0,'Australia'],
['What is the chemical symbol for oxygen?',['O','O2','Ox','Og'],0,'Science'],
['What is H2O commonly called?',['Hydrogen','Salt','Water','Oxygen'],2,'Science'],
['Which planet is known as the Red Planet?',['Venus','Mars','Jupiter','Mercury'],1,'Science'],
['What force attracts objects toward Earth?',['Magnetism','Gravity','Friction','Electricity'],1,'Science'],
['What gas do plants take in during photosynthesis?',['Oxygen','Nitrogen','Carbon dioxide','Helium'],2,'Science'],
['How many bones are in the typical adult human skeleton?',['106','206','306','406'],1,'Science'],
['Which organ pumps blood around the human body?',['Lungs','Liver','Heart','Kidneys'],2,'Science'],
['What is the closest star to Earth?',['Sirius','The Sun','Proxima Centauri','Betelgeuse'],1,'Science'],
['Which state of matter has a fixed volume but takes the shape of its container?',['Solid','Liquid','Gas','Plasma'],1,'Science'],
['What is the boiling point of pure water at standard atmospheric pressure?',['50°C','75°C','100°C','150°C'],2,'Science'],
['Which part of a plant usually absorbs water from the soil?',['Flowers','Roots','Fruit','Seeds'],1,'Science'],
['What is the largest planet in our Solar System?',['Earth','Saturn','Jupiter','Neptune'],2,'Science'],
['Which instrument has black and white keys?',['Trumpet','Violin','Piano','Drums'],2,'Music'],
['How many strings does a standard violin have?',['3','4','5','6'],1,'Music'],
['Which instrument commonly has six strings?',['Guitar','Flute','Trumpet','Clarinet'],0,'Music'],
['Which musical family does the trumpet belong to?',['Strings','Brass','Woodwind','Percussion'],1,'Music'],
['Which composer wrote the famous Fifth Symphony beginning with four short notes?',['Beethoven','Mozart','Bach','Chopin'],0,'Music'],
['How many notes are named in the basic Western musical scale from A to G?',['5','6','7','8'],2,'Music'],
['Which instrument is played with a bow and is larger than a violin?',['Flute','Cello','Trumpet','Piano'],1,'Music'],
['Which Australian sport is played with an oval-shaped ball and goals at both ends?',['Australian rules football','Tennis','Cricket','Golf'],0,'Sport'],
['Which sport is played at the Australian Open?',['Tennis','Cricket','Rugby','Golf'],0,'Sport'],
['How many players from one team are on court in basketball during normal play?',['4','5','6','7'],1,'Sport'],
['How many players are on the field for one soccer team during normal play?',['9','10','11','12'],2,'Sport'],
['In cricket, how many stumps make up one wicket?',['2','3','4','5'],1,'Sport'],
['Which sport uses a shuttlecock?',['Badminton','Hockey','Netball','Baseball'],0,'Sport'],
['In tennis, what word means a score of zero?',['Love','Nil','Blank','Duck'],0,'Sport'],
['Which sport includes the events 100 metres, long jump and javelin?',['Athletics','Swimming','Cycling','Rowing'],0,'Sport'],
['Which country hosted the 2016 Summer Olympics?',['Brazil','Japan','China','United Kingdom'],0,'Sport'],
['What is the largest ocean on Earth?',['Atlantic Ocean','Indian Ocean','Pacific Ocean','Arctic Ocean'],2,'Nature'],
['Which is the largest living species of sea turtle?',['Green sea turtle','Loggerhead turtle','Leatherback turtle','Hawksbill turtle'],2,'Nature'],
['Which Australian bird is flightless and is the tallest native bird species?',['Kookaburra','Emu','Magpie','Cockatoo'],1,'Nature'],
['Which Australian mammal is famous for laying eggs?',['Kangaroo','Platypus','Wombat','Dingo'],1,'Nature'],
['Which Australian animal is known for digging extensive burrows?',['Wombat','Koala','Emu','Kookaburra'],0,'Nature'],
['What is the name of the natural satellite that orbits Earth?',['Mars','The Moon','Venus','Titan'],1,'Nature'],
['Which layer of Earth is the outermost solid layer?',['Core','Mantle','Crust','Inner core'],2,'Nature'],
['Which gas makes up the largest proportion of Earth’s atmosphere?',['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'],1,'Nature'],
['Which continent is the Sahara Desert located on?',['Asia','Africa','South America','Australia'],1,'General'],
['How many sides does a hexagon have?',['5','6','7','8'],1,'General'],
['Which language has the most native speakers worldwide?',['English','Spanish','Mandarin Chinese','French'],2,'General'],
['Which is the smallest prime number?',['0','1','2','3'],2,'General'],
['How many days are in a leap year?',['364','365','366','367'],2,'General'],
['Which direction does the Sun appear to rise from?',['North','South','East','West'],2,'General'],
['What is the capital of New Zealand?',['Auckland','Wellington','Christchurch','Dunedin'],1,'General'],
['Which material is attracted to a magnet?',['Glass','Wood','Iron','Plastic'],2,'General']
];const $=id=>document.getElementById(id),gate=$('gate'),game=$('game'),finished=$('finished'),pass=$('passcode'),gateMessage=$('gateMessage'),qEl=$('question'),answers=$('answers'),feedback=$('questionFeedback'),next=$('nextButton'),num=$('questionNumber'),scoreEl=$('score'),bar=$('progressBar'),wheelArea=$('wheelArea'),wheel=$('wheel'),spin=$('spinButton'),wheelResult=$('wheelResult'),cont=$('continueButton'),finalScore=$('finalScore');let pool=[],index=0,score=0,answered=false,lastWheel=null,spinning=false;
function shuffle(a){return[...a].sort(()=>Math.random()-.5)}
function start(){pool=shuffle(questions).slice(0,20);index=0;score=0;lastWheel=null;wheel.dataset.rotation='0';wheel.style.transform='rotate(0deg)';game.hidden=false;gate.hidden=true;finished.hidden=true;showQuestion()}
function showQuestion(){answered=false;wheelArea.hidden=true;$('questionArea').hidden=false;next.hidden=true;feedback.textContent='';feedback.className='quiz-message';const q=pool[index];num.textContent=index+1;scoreEl.textContent=score+' correct';bar.style.width=(index/pool.length*100)+'%';qEl.textContent=q[0];answers.innerHTML='';shuffle(q[1].map((label,i)=>({label,i}))).forEach(o=>{const b=document.createElement('button');b.className='answer';b.type='button';b.textContent=o.label;b.dataset.i=o.i;b.addEventListener('click',()=>choose(b,Number(b.dataset.i)));answers.appendChild(b)})}
function choose(button,choice){if(answered)return;answered=true;const correct=pool[index][2];document.querySelectorAll('.answer').forEach(b=>b.disabled=true);if(choice===correct){score++;button.classList.add('correct');feedback.textContent='Correct! You have earned a spin of the wheel.';feedback.className='quiz-message good';bar.style.width=((index+1)/pool.length*100)+'%';setTimeout(showWheel,450)}else{button.classList.add('wrong');document.querySelectorAll('.answer').forEach(b=>{if(Number(b.dataset.i)===correct)b.classList.add('correct')});feedback.textContent='Not quite. The correct answer is '+pool[index][1][correct]+'.';next.hidden=false}}
function showWheel(){$('questionArea').hidden=true;wheelArea.hidden=false;wheelResult.textContent='';wheelResult.className='wheel-result';spin.disabled=false;spin.textContent='Spin the wheel';cont.hidden=true;$('wheelCentre').disabled=false;$('wheelTitle').textContent=lastWheel==='try'?'One more spin!':'Spin the wheel';$('wheelHint').textContent=lastWheel==='try'?'One final spin. This time you can WIN or get Better luck next time.':'Your correct answer has earned you a spin!'}
function celebrate(){const layer=document.createElement('div');layer.className='celebration';const burst=document.createElement('div');burst.className='win-burst';burst.innerHTML='🎉 YOU WIN!<small>Congratulations!</small>';layer.appendChild(burst);const flag=document.createElement('div');flag.className='aussie-flag';flag.textContent='🇦🇺';layer.appendChild(flag);const kangaroo=document.createElement('div');kangaroo.className='aussie-gif left';kangaroo.textContent='🦘';layer.appendChild(kangaroo);const koala=document.createElement('div');koala.className='aussie-gif right';koala.textContent='🐨';layer.appendChild(koala);for(let i=0;i<90;i++){const c=document.createElement('span');c.className='confetti';c.style.left=(Math.random()*100)+'%';c.style.setProperty('--x',(Math.random()*240-120)+'px');c.style.setProperty('--d',(1.8+Math.random()*2.2)+'s');c.style.setProperty('--r',(Math.random()*360)+'deg');c.style.background=['#e46d3f','#176b63','#f2b37f','#fff'][i%4];layer.appendChild(c)}document.body.appendChild(layer);setTimeout(()=>layer.remove(),4300)}
function spinWheel(){if(spinning)return;spinning=true;spin.disabled=true;$('wheelCentre').disabled=true;let outcomes=lastWheel==='try'?['win','luck']:['win','try','luck'];const outcome=outcomes[Math.floor(Math.random()*outcomes.length)];const target={win:0,try:240,luck:120}[outcome];const current=Number(wheel.dataset.rotation||0);const base=current+5*360;const normalized=((base%360)+360)%360;const final=base+((target-normalized+360)%360);wheel.dataset.rotation=final;wheel.style.transform='rotate('+final+'deg)';setTimeout(()=>{spinning=false;lastWheel=outcome;spin.disabled=false;if(outcome==='win'){wheelResult.innerHTML='You win! 🎉🇦🇺<small>Show it to the counter to claim your prize.</small>';wheelResult.className='wheel-result win';cont.hidden=false;cont.textContent='Re-enter quiz →';celebrate()}else if(outcome==='try'){wheelResult.textContent='Try again! You get ONE more spin.';wheelResult.className='wheel-result try';spin.textContent='One more spin';$('wheelCentre').disabled=false}else{wheelResult.textContent='Better luck next time.';wheelResult.className='wheel-result luck';cont.hidden=false;cont.textContent='Re-enter quiz →'}},4100)}
function returnToGate(){game.hidden=true;finished.hidden=true;gate.hidden=false;pass.value='';gateMessage.textContent='';pass.focus();window.scrollTo({top:0,behavior:'smooth'})}
$('gateForm').addEventListener('submit',e=>{e.preventDefault();const code=pass.value.trim().toUpperCase();if(PASS.test(code)){gateMessage.textContent='';start()}else{gateMessage.textContent='Use any passcode from YHC001 to YHC9999.';pass.select()}});
next.addEventListener('click',advance);cont.addEventListener('click',returnToGate);spin.addEventListener('click',spinWheel);$('wheelCentre').addEventListener('click',spinWheel);$('quitButton').addEventListener('click',returnToGate);pass.addEventListener('input',()=>{pass.value=pass.value.replace(/[^a-zA-Z0-9]/g,'').slice(0,6).toUpperCase()});
function advance(){if(index>=pool.length-1){game.hidden=true;finished.hidden=false;finalScore.textContent='You answered '+score+' of '+pool.length+' questions correctly.';return}index++;showQuestion()}});