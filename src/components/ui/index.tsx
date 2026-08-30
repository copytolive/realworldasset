"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import "./ui.css";

export function Button({variant="primary",size="md",loading=false,className,children,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"secondary"|"ghost"|"danger";size?:"sm"|"md"|"lg";loading?:boolean}){return <button className={cn("rwa-button",`rwa-button--${variant}`,`rwa-button--${size}`,className)} disabled={loading||props.disabled} {...props}>{loading&&<span className="rwa-button__spinner" aria-hidden="true"/>}{children}</button>}

export function Input({label,hint,error,valid,className,id,...props}:React.InputHTMLAttributes<HTMLInputElement>&{label?:string;hint?:string;error?:string;valid?:boolean}){const rid=React.useId();const fid=id??rid;const did=error||hint?`${fid}-description`:undefined;return <label className="rwa-field" htmlFor={fid}>{label&&<span className="rwa-field__label">{label}</span>}<input id={fid} className={cn("rwa-control",className)} data-invalid={error?"true":undefined} data-valid={!error&&valid?"true":undefined} aria-invalid={Boolean(error)||undefined} aria-describedby={did} {...props}/>{(error||hint)&&<span id={did} className={error?"rwa-field__error":"rwa-field__hint"}>{error??hint}</span>}</label>}

export function Select({label,hint,error,className,id,children,...props}:React.SelectHTMLAttributes<HTMLSelectElement>&{label?:string;hint?:string;error?:string}){const rid=React.useId();const fid=id??rid;const did=error||hint?`${fid}-description`:undefined;return <label className="rwa-field" htmlFor={fid}>{label&&<span className="rwa-field__label">{label}</span>}<select id={fid} className={cn("rwa-control",className)} data-invalid={error?"true":undefined} aria-invalid={Boolean(error)||undefined} aria-describedby={did} {...props}>{children}</select>{(error||hint)&&<span id={did} className={error?"rwa-field__error":"rwa-field__hint"}>{error??hint}</span>}</label>}

export function Checkbox({label,...props}:React.InputHTMLAttributes<HTMLInputElement>&{label:React.ReactNode}){return <label className="rwa-choice"><input type="checkbox" {...props}/><span>{label}</span></label>}
export function Radio({label,...props}:React.InputHTMLAttributes<HTMLInputElement>&{label:React.ReactNode}){return <label className="rwa-choice"><input type="radio" {...props}/><span>{label}</span></label>}

export function Card({className,elevated=false,...props}:React.HTMLAttributes<HTMLDivElement>&{elevated?:boolean}){return <div className={cn("rwa-card",elevated&&"rwa-card--elevated",className)} {...props}/>}
export const CardHeader=(p:React.HTMLAttributes<HTMLDivElement>)=><div className={cn("rwa-card__header",p.className)} {...p}/>;
export const CardBody=(p:React.HTMLAttributes<HTMLDivElement>)=><div className={cn("rwa-card__body",p.className)} {...p}/>;
export const CardFooter=(p:React.HTMLAttributes<HTMLDivElement>)=><div className={cn("rwa-card__footer",p.className)} {...p}/>;

export function Badge({tone="neutral",className,...props}:React.HTMLAttributes<HTMLSpanElement>&{tone?:"neutral"|"primary"|"success"|"warning"|"danger"|"purple"}){return <span className={cn("rwa-badge",`rwa-badge--${tone}`,className)} {...props}/>}

export function Tabs({items,value,defaultValue,onValueChange}: {items:{value:string;label:React.ReactNode;disabled?:boolean}[];value?:string;defaultValue?:string;onValueChange?:(v:string)=>void}){const [internal,setInternal]=React.useState(defaultValue??items[0]?.value??"");const current=value??internal;return <div className="rwa-tabs" role="tablist">{items.map(i=><button key={i.value} type="button" role="tab" aria-selected={current===i.value} disabled={i.disabled} data-active={current===i.value?"true":undefined} className="rwa-tab" onClick={()=>{if(value===undefined)setInternal(i.value);onValueChange?.(i.value)}}>{i.label}</button>)}</div>}

export function Table(p:React.TableHTMLAttributes<HTMLTableElement>){return <div className="rwa-table-wrap"><table className={cn("rwa-table",p.className)} {...p}/></div>}
export const THead=(p:React.HTMLAttributes<HTMLTableSectionElement>)=><thead {...p}/>;export const TBody=(p:React.HTMLAttributes<HTMLTableSectionElement>)=><tbody {...p}/>;export const TR=(p:React.HTMLAttributes<HTMLTableRowElement>)=><tr {...p}/>;export const TH=(p:React.ThHTMLAttributes<HTMLTableCellElement>)=><th {...p}/>;export const TD=(p:React.TdHTMLAttributes<HTMLTableCellElement>)=><td {...p}/>;

export function Alert({tone="info",className,...props}:React.HTMLAttributes<HTMLDivElement>&{tone?:"info"|"success"|"warning"|"danger"}){return <div role={tone==="danger"?"alert":"status"} className={cn("rwa-alert",`rwa-alert--${tone}`,className)} {...props}/>}
export function Toast({tone="primary",title,message,action}:{tone?:"primary"|"success"|"warning"|"danger";title:string;message?:string;action?:React.ReactNode}){return <div className="rwa-toast" role={tone==="danger"?"alert":"status"}><Badge tone={tone}>{tone}</Badge><div><strong>{title}</strong>{message&&<div className="rwa-toast__message">{message}</div>}</div>{action}</div>}
export function Skeleton({width,height=16,className}: {width?:number|string;height?:number|string;className?:string}){return <div aria-hidden="true" className={cn("rwa-skeleton",className)} style={{width,height}}/>}
export function Tooltip({content,children}:{content:React.ReactNode;children:React.ReactElement}){const [open,setOpen]=React.useState(false);return <span className="rwa-tooltip-wrap" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onFocusCapture={()=>setOpen(true)} onBlurCapture={()=>setOpen(false)}>{children}{open&&<span role="tooltip" className="rwa-tooltip">{content}</span>}</span>}
