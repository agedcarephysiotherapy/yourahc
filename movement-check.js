(() => {
const $=id=>document.getElementById(id);
const balanceRefs={18:[43.3,43.3],40:[40.3,40.3],50:[37.0,37.0],60:[26.9,26.9],70:[15.0,15.0],80:[6.2,6.2]};
const balanceBands=[['18–39',18],['40–49',40],['50–59',50],['60–69',60],['70–79',70],['80–99',80]];
const sts30Refs={
female:{'18–29':[19,17,24],'30–39':[20,18,23],'40–49':[17,15,20],'50–59':[16,14,20],'60–69':[15,12,19],'70–80':[13,11,18]},
male:{'18–29':[19,16,24],'30–39':[21,18,27],'40–49':[16,15,24],'50–59':[18,16,21],'60–69':[14,12,15],'70–80':[11,10,13]}
};
const sts30Bands=[['18–29',18,29],['30–39',30,39],['40–49',40,49],['50–59',50,59],['60–69',60,69],['70–80',70,80]];
function balanceBand(age){return balanceBands.find((b,i)=>age>=b[1]&&(i===balanceBands.length-1||age<balanceBands[i+1][1]))}
function sts30Band(age){return sts30Bands.find(b=>age>=b[1]&&age<=b[2])||null}
function card(title,time,unit,reference,status,detail){return '<div class="result-item"><h3>'+title+'</h3><div class="result-time">'+time+' <small>'+unit+'</small></div><div class="result-reference">'+reference+'</div><span class="result-status '+status.cls+'">'+status.label+'</span><div class="mini-ref">'+detail+'</div></div>'}
function balanceResult(age,time){
const band=balanceBand(age), ref=balanceRefs[band[1]][0], diff=time-ref;
let s=diff>3?{label:'Above the reference mean',cls:'status-better'}:diff< -3?{label:'Below the reference mean',cls:'status-slower'}:{label:'Close to the reference mean',cls:'status-typical'};
const detail=s.cls==='status-better'?'You held the position longer than the published age-group mean.':s.cls==='status-slower'?'You held the position for less time than the published age-group mean.':'Your result is close to the published age-group mean.';
return card('Stand on one leg',time.toFixed(1),'seconds','Typical eyes-open mean for ages '+band[0]+': <strong>'+ref.toFixed(1)+' seconds</strong>.',s,'Springer et al. (2007), healthy adults. '+detail+' The study found age-related differences but no significant gender effect.');
}
function sts30Result(age,sex,reps){
const band=sts30Band(age), r=sts30Refs[sex][band[0]], median=r[0], p25=r[1], p75=r[2];
let s=reps>p75?{label:'Above the reference range',cls:'status-better'}:reps<p25?{label:'Below the reference range',cls:'status-slower'}:{label:'Within the reference range',cls:'status-typical'};
const detail=s.cls==='status-better'?'You completed more stands than the middle 50% of the published reference group.':s.cls==='status-slower'?'You completed fewer stands than the middle 50% of the published reference group.':'Your result falls within the middle 50% of the published reference group.';
return card('30-second sit-to-stand',String(reps),'repetitions','Reference for '+(sex==='female'?'females':'males')+' aged '+band[0]+': <strong>'+median+' repetitions</strong> median; middle 50%: <strong>'+p25+'–'+p75+'</strong>.',s,'Barros-Poblete et al. (2025), 499 healthy adults aged 18–80. Higher repetition count indicates better test performance. '+detail);
}
$('compare').addEventListener('click',()=>{
const age=Number($('age').value), sex=$('sex').value, b=Number($('balance').value), s=Number($('sitstand').value);
if(!age||age<18||age>80||!sex||!b||s<0||!Number.isInteger(s)){alert('Please enter an age from 18 to 80, your sex, your one-leg stand time, and your 30-second sit-to-stand repetitions.');return}
$('results').hidden=false;
$('resultCards').innerHTML=balanceResult(age,b)+sts30Result(age,sex,s);
$('overallNote').textContent='Your results are a simple comparison with research reference values. They do not diagnose a condition or predict your individual health. The 30-second sit-to-stand reference values are from a healthy Chilean adult population aged 18–80 and are used here as a research guide, not a pass/fail test.';
$('results').scrollIntoView({behavior:'smooth',block:'start'});
});
})();