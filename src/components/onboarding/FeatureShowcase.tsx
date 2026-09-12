import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPayRegionOrGuess, setPayRegion, type PayRegion } from "@/lib/payRegion";
import { setUserLang } from "@/lib/authI18n";
import "@/styles/welcome-showcase.css";

const WIDE_POSTER="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/5c3ec08f-2dbf-4c0a-8588-f6106a789443.webp";
const WIDE_VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4";
const NARROW_POSTER="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp";
const NARROW_VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4";

type Card={kind:"speed"|"context"|"connections";eyebrow:string;title:string;description:string;value:string;unit:string};
const CARDS:Card[]=[
 {kind:"speed",eyebrow:"Inference Speed",title:"Answers at the speed of thought.",description:"Megsy responds in milliseconds, so every conversation keeps moving.",value:"118",unit:"ms"},
 {kind:"context",eyebrow:"Context Window",title:"Understands the whole story.",description:"Work across long documents and complex ideas without losing context.",value:"2.4",unit:"M"},
 {kind:"connections",eyebrow:"Intelligent Connections",title:"Everything works together.",description:"Bring your sources into one intelligent workspace built around you.",value:"16",unit:"K"},
];

export default function FeatureShowcase({onFinish}:{onFinish?:(target?:"trial")=>void}){
 const [offer,setOffer]=useState(false);
 const [active,setActive]=useState(0);
 const [region]=useState<PayRegion>(()=>getPayRegionOrGuess());
 const trackRef=useRef<HTMLDivElement>(null);
 const finishRef=useRef(onFinish);
 finishRef.current=onFinish;
 useEffect(()=>{setPayRegion(region);void setUserLang("en",{syncRemote:false});},[region]);
 useEffect(()=>{const b=document.body.style.overflow;document.body.style.overflow=offer?"hidden":"";return()=>{document.body.style.overflow=b}},[offer]);
 useEffect(()=>{
  const media=window.matchMedia("(min-width: 768px)");
  const leaveDesktop=()=>{if(media.matches)window.setTimeout(()=>finishRef.current?.(),0)};
  leaveDesktop();media.addEventListener("change",leaveDesktop);
  return()=>media.removeEventListener("change",leaveDesktop);
 },[]);
 const goTo=(index:number)=>{const track=trackRef.current;const card=track?.children[index] as HTMLElement|undefined;if(track&&card)track.scrollTo({left:card.offsetLeft-track.offsetLeft,behavior:"smooth"});setActive(index)};
 const continueFlow=()=>{if(active<CARDS.length-1)goTo(active+1);else setOffer(true)};
 return <main className="perf-stage" dir="ltr">
  <StageVideo/><div className="perf-veil"/>
   <header className="perf-head">
    <p className="perf-kicker"><Sparkles/> Meet Megsy</p>
    <h1>Built for <Dots text="Intelligent"/> Performance</h1>
    <p className="perf-intro">Speed, scale and context—engineered to help you do your best work.</p>
  </header>
   <section className="perf-carousel" role="region" aria-roledescription="carousel" aria-label="Megsy capabilities">
    <div ref={trackRef} className="perf-cards" onScroll={(event)=>{const el=event.currentTarget;const first=el.firstElementChild as HTMLElement|null;if(!first)return;const step=first.offsetWidth+14;setActive(Math.max(0,Math.min(CARDS.length-1,Math.round(el.scrollLeft/step))))}}>
     {CARDS.map((card,i)=><MetricCard key={card.kind} card={card} index={i}/>) }
    </div>
  </section>
   <footer className="perf-actions">
    <div className="perf-progress" role="tablist" aria-label="Choose capability">{CARDS.map((card,index)=><button key={card.kind} type="button" role="tab" aria-selected={active===index} aria-label={`Capability ${index+1} of ${CARDS.length}: ${card.eyebrow}`} onClick={()=>goTo(index)} className={active===index?"on":""}/>)}</div>
    <Button variant="ghost" data-plain onClick={continueFlow} className="perf-next">{active===CARDS.length-1?"See your offer":"Continue"}<ArrowRight/></Button>
    <Button variant="ghost" data-plain onClick={()=>onFinish?.()} className="perf-skip">Skip for now</Button>
   </footer>
  {offer&&<section className="perf-offer">
   <StageVideo/><div className="perf-veil"/>
    <div className="offer-copy"><p className="perf-kicker"><Sparkles/> Megsy Pro</p><h2>Make more<br/>for <Dots text="$1"/></h2><p>Try every premium tool for three days. Continue for $7 in your first month, or cancel anytime.</p></div>
    <article className="offer-card"><div className="offer-price"><strong>$1</strong><span>3 days</span></div><ul><li><Check/>3 premium images every day</li><li><Check/>Unlimited premium images after trial</li><li><Check/>Cancel anytime</li></ul></article>
    <footer className="perf-actions offer-actions"><Button variant="ghost" data-plain onClick={()=>onFinish?.("trial")} className="perf-next">Start my trial <ArrowRight/></Button><Button variant="ghost" data-plain onClick={()=>onFinish?.()} className="perf-skip">Maybe later</Button></footer>
  </section>}
 </main>
}
function StageVideo(){return <><video className="stage-video wide" autoPlay muted loop playsInline poster={WIDE_POSTER} src={WIDE_VIDEO}/><video className="stage-video narrow" autoPlay muted loop playsInline preload="none" poster={NARROW_POSTER} src={NARROW_VIDEO}/></>}
function Dots({text}:{text:string}){const raw=useId(),id=`d${raw.replace(/\W/g,"")}`;return <span className="dot-word" aria-label={text}><svg viewBox={`0 0 ${text.length*58} 120`}><defs><pattern id={id} width="12.6" height="12.6" patternUnits="userSpaceOnUse"><circle cx="6.3" cy="6.3" r="4.9" fill="currentColor"/></pattern></defs><text x="0" y="94" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="100" letterSpacing="0" fill={`url(#${id})`}>{text}</text></svg></span>}
function MetricCard({card,index}:{card:Card;index:number}){return <article className={`metric-card ${card.kind}`} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${CARDS.length}`}><div className="card-art" aria-hidden="true">{card.kind==="speed"?<><span className="speed-orbit"/><span className="speed-core"/></>:card.kind==="context"?<div className="tile-grid">{Array.from({length:7},(_,i)=><i key={i}/>)}</div>:<svg viewBox="0 0 429 238"><path d="M-30 26H113c32 0 34 42 65 42h75c32 0 34-42 66-42h140M-30 120h83c32 0 34 56 66 56h160c32 0 34-56 66-56h114M-30 211h139c25 0 31-34 59-34h95c28 0 34 34 59 34h137"/></svg>}</div><p className="card-eyebrow">{card.eyebrow}</p><div className="metric"><strong>{card.value}</strong><span>{card.unit}</span></div><div className="card-copy"><h2>{card.title}</h2><p>{card.description}</p></div></article>}
