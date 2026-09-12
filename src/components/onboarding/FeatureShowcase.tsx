import { useEffect, useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPayRegionOrGuess, setPayRegion, type PayRegion } from "@/lib/payRegion";
import { setUserLang } from "@/lib/authI18n";
import "@/styles/welcome-showcase.css";

const WIDE_POSTER="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/5c3ec08f-2dbf-4c0a-8588-f6106a789443.webp";
const WIDE_VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4";
const NARROW_POSTER="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp";
const NARROW_VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4";

type Card={kind:"speed"|"context"|"connections";title:string;subtitle:string;value:string;unit:string;caption:string};
const CARDS:Card[]=[
 {kind:"speed",title:"Inference Speed",subtitle:"AI Response Latency",value:"118",unit:"ms",caption:"Average global\nresponse"},
 {kind:"context",title:"Context Window",subtitle:"Long-form Understanding",value:"2.4",unit:"M",caption:"Tokens processed\nsimultaneously"},
 {kind:"connections",title:"Intelligent Connections",subtitle:"Cross-Source Context",value:"16",unit:"K",caption:"Connected data\nsources"},
];

export default function FeatureShowcase({onFinish}:{onFinish?:(target?:"trial")=>void}){
 const [offer,setOffer]=useState(false);
 const [region]=useState<PayRegion>(()=>getPayRegionOrGuess());
 useEffect(()=>{setPayRegion(region);void setUserLang("en",{syncRemote:false});},[region]);
 useEffect(()=>{const b=document.body.style.overflow;document.body.style.overflow=offer?"hidden":"";return()=>{document.body.style.overflow=b}},[offer]);
 return <main className="perf-stage" dir="ltr">
  <StageVideo/><div className="perf-veil"/>
  <header className="perf-head reveal">
   <h1><span>Built for <Dots text="Intelligent"/></span><span>Performance</span></h1>
   <p>Every capability is engineered for speed, scale and contextual understanding, giving your AI the foundation to reason, adapt and perform in production.</p>
  </header>
  <section className="perf-cards" aria-label="Performance capabilities">
   {CARDS.map((card,i)=><MetricCard key={card.kind} card={card} delay={i}/>) }
  </section>
  <footer className="perf-actions"><div className="perf-dots"><i className={!offer?"on":""}/><i className={offer?"on":""}/></div><Button variant="ghost" data-plain onClick={()=>setOffer(true)} className="perf-next">Continue <ArrowRight/></Button></footer>
  {offer&&<section className="perf-offer">
   <StageVideo/><div className="perf-veil"/>
   <div className="offer-grid"><div className="offer-copy"><small>MEGSY PRO</small><h2>3 days for <Dots text="$1"/></h2><p>Get 3 premium images every day during your trial. Then continue for $7 in your first month with unlimited premium images, or cancel anytime.</p></div>
   <article className="offer-card"><small>INTRODUCTORY TRIAL</small><div><strong>$1</strong><span>/ 3 days</span></div><hr/><ul><li>3 premium images every day</li><li>$7 for your first month</li><li>Unlimited premium images</li><li>Cancel anytime</li></ul></article></div>
   <footer className="perf-actions offer-actions"><Button variant="ghost" data-plain onClick={()=>onFinish?.("trial")} className="perf-next">Start 3 days for $1 <ArrowRight/></Button><Button variant="ghost" data-plain onClick={()=>onFinish?.()} className="perf-later">Maybe later</Button></footer>
  </section>}
 </main>
}
function StageVideo(){return <><video className="stage-video wide" autoPlay muted loop playsInline poster={WIDE_POSTER} src={WIDE_VIDEO}/><video className="stage-video narrow" autoPlay muted loop playsInline preload="none" poster={NARROW_POSTER} src={NARROW_VIDEO}/></>}
function Dots({text}:{text:string}){const raw=useId(),id=`d${raw.replace(/\W/g,"")}`;return <span className="dot-word" aria-label={text}><svg viewBox={`0 0 ${text.length*58} 120`}><defs><pattern id={id} width="12.6" height="12.6" patternUnits="userSpaceOnUse"><circle cx="6.3" cy="6.3" r="4.9" fill="currentColor"/></pattern></defs><text x="0" y="94" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="100" letterSpacing="0" fill={`url(#${id})`}>{text}</text></svg></span>}
function MetricCard({card,delay}:{card:Card;delay:number}){return <article className={`metric-card ${card.kind}`} style={{animationDelay:`${.12+delay*.1}s`}}><div className="card-art">{card.kind==="speed"?<svg viewBox="0 0 326 326"><path d="M7 136A158.5 158.5 0 0 1 312 109"/></svg>:card.kind==="context"?<div className="tile-grid">{Array.from({length:7},(_,i)=><i key={i}/>)}</div>:<svg viewBox="0 0 429 238"><path d="M0 5H128c27 0 36 7 39 26 2 16 9 22 24 22h106c16 0 23-8 25-25 2-16 10-23 31-23h76M0 117h46c15 0 22 8 26 25 5 23 12 31 31 31h174c18 0 25-8 30-31 4-17 11-25 26-25h96M0 173h87c15 0 22 7 27 25 4 15 11 22 28 22h140c17 0 25-7 29-22 5-18 12-25 28-25h90"/></svg>}</div><h2>{card.title}<br/>{card.subtitle}</h2><div className="metric"><Dots text={card.value}/><span>{card.unit}</span></div><p>{card.caption.split("\n").map(x=><span key={x}>{x}</span>)}</p><Button variant="ghost" data-plain onClick={()=>document.querySelector(".perf-next")?.scrollIntoView({behavior:"smooth"})}>Learn More</Button></article>}
