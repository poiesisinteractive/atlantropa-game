const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const fmt=(v,d=0)=>(isFinite(v)?v:0).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
function chaikin(poly,iter){
  let p=poly;
  for(let k=0;k<iter;k++){
    const q=[];
    for(let i=0;i<p.length;i++){
      const a=p[i], b=p[(i+1)%p.length];
      q.push([a[0]*0.75+b[0]*0.25, a[1]*0.75+b[1]*0.25]);
      q.push([a[0]*0.25+b[0]*0.75, a[1]*0.25+b[1]*0.75]);
    }
    p=q;
  }
  return p;
}
export { clamp, lerp, fmt, chaikin };
