(() => {
const $=id=>document.getElementById(id);
const balanceRefs={18:[43.3,43.3],40:[40.3,40.3],50:[37.0,37.0],60:[26.9,26.9],70:[15.0,15.0],80:[6.2,6.2]};
const balanceBands=[['18–39',18],['40–49',40],['50–59',50],['60–69',60],['70–79',70],['80–99',80]];
const stsRefs={
female:{'18–29':[7.4,10.6],'30–39':[7.7,11.4],'40–49':[8.5,13.1],'50–54':[10,18],'55–59':[10,20],'60–64':[10,20],'65–69':[11,22],'70–74':[12,20],'75–79':[12,23],'80–84':[13,25],'85–89':[15,28],'90+':[15,28]},
male:{'18–29':[7.8,10.3],'30–39':[6.5,11.4],'40–49':[8.1,11.5],'50–54':[9,19],'55–59':[9,18],'60–64':[10,18],'65–69':[10,20],'70–74':[11,20],'75–79':[12,22],'80–84':[13,23],'85–89':[13,25],'90+':[15,26]}
};
const stsBands=[['18–29',18,29],['30–39',30,39],['40–49',40,49],['50–54',50,54],['55–59',55,59],['60–64',60,64],['65–69',65,69],['70–74',70,74],['75–79',75,79],['80–84',80,84],['85–89',85,89],['90+',90,99]];
function balanceBand(age){return balanceBands.find((b,i)=>age>=b[1]&&(i===balanceBands.length-1||age<balanceBands[i+1][1]))}
function stsBand(age){return stsBands.find(b=>age>=b[1]&&age<=b[2])||null}
function card(title,time,reference,status,detail){return '<div class="result-item"><h3>'+title+'</h3><div class="result-time">'+time+' <small>seconds</small></div><div class="result-reference">'+reference+'</div><span class="result-status '+status.cls+'">'+status.label+'</span><div class="mini-ref">'+detail+'</div></div>'}
function balanceResult(age,time){
const band=balanceBand(age), ref=balanceRefs[band[1]][0], diff=time-ref;
let s=diff>3?{label:'Above the reference mean',cls:'status-better'}:diff< -3?{label:'Below the reference mean',cls:'status-slower'}:{label:'Close to the reference mean',cls:'status-typical'};
const detail=s.cls==='status-better'?'You held the position longer than the published age-group mean.':s.cls==='status-slower'?'You held the position for less time than the published age-group mean.':'Your result is close to the published age-group mean.';
return card('Stand on one leg',time.toFixed(1),'Typical eyes-open mean for ages '+band[0]+': <strong>'+ref.toFixed(1)+' seconds</strong>.',s,'Springer et al. (2007), healthy adults. '+detail+' The study found age-related differences but no significant gender effect.');
}
function stsResult(age,sex,time){
const band=stsBand(age), r=stsRefs[sex][band[0]], median=r[0], p5=r[1];
let s=time<median?{label:'Faster than the median',cls:'status-better'}:time<=p5?{label:'Within the published reference range',cls:'status-typical'}:{label:'Slower than the published reference range',cls:'status-slower'};
const source=age<50?'Chilean adult reference study (463 healthy adults aged 18–80).':'2025 pooled reference study (45,470 adults aged 50+ across 14 European countries).';
return card('5 × sit-to-stand',time.toFixed(1),'Median reference for '+(sex==='female'?'females':'males')+' aged '+band[0]+': <strong>'+median+' seconds</strong>. Slower-end reference boundary: <strong>'+p5+' seconds</strong>.',s,source+' Lower time indicates better test performance.');
}
$('compare').addEventListener('click',()=>{
const age=Number($('age').value), sex=$('sex').value, b=Number($('balance').value), s=Number($('sitstand').value);
if(!age||age<18||age>99||!sex||!b||!s){alert('Please enter your age, sex, and both test results.');return}
$('results').hidden=false;
$('resultCards').innerHTML=balanceResult(age,b)+stsResult(age,sex,s);
$('overallNote').textContent='Your results are a simple comparison with research reference values. They do not diagnose a condition or predict your individual health. Reference values come from different healthy adult populations and are intended as a guide, not a pass/fail test.';
$('results').scrollIntoView({behavior:'smooth',block:'start'});
});
})();