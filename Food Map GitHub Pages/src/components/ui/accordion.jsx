import React, { useState, createContext, useContext } from 'react';
const Ctx = createContext();
export function Accordion({ type='single', collapsible=true, children }){
  const [value, setValue] = useState(null);
  return <Ctx.Provider value={{ value, setValue, collapsible }}>{children}</Ctx.Provider>;
}
export function AccordionItem({ value, children }){
  return <Item value={value}>{children}</Item>;
}
function Item({ value, children }){ return <ItemCtx.Provider value={{ my: value }}>{children}</ItemCtx.Provider> }
const ItemCtx = createContext();
export function AccordionTrigger({ children }){
  const { value, setValue, collapsible } = useContext(Ctx);
  const { my } = useContext(ItemCtx);
  const open = value===my;
  return <button onClick={()=> setValue(open && collapsible ? null : my)} className='w-full text-left px-3 py-2 font-medium'>{children}</button>;
}
export function AccordionContent({ children }){
  const { value } = useContext(Ctx);
  const { my } = useContext(ItemCtx);
  if (value!==my) return null;
  return <div className='px-3 pb-3'>{children}</div>;
}
