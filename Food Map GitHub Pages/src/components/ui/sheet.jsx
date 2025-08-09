import React, { useState, createContext, useContext } from 'react';
const Ctx = createContext();
export function Sheet({ children }){
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
}
export function SheetTrigger({ asChild, children }){
  const { setOpen } = useContext(Ctx);
  const child = React.Children.only(children);
  const props = { onClick: (...a)=>{ child.props.onClick?.(...a); setOpen(true); } };
  return asChild ? React.cloneElement(child, props) : <button {...props}>{children}</button>;
}
export function SheetContent({ children, side='right', className='' }){
  const { open, setOpen } = useContext(Ctx);
  if (!open) return null;
  return (<div className='fixed inset-0 z-[900]'>
    <div className='absolute inset-0 bg-black/40' onClick={()=>setOpen(false)}></div>
    <div className={['absolute top-0 h-full bg-white shadow-xl p-4', side==='right'?'right-0 w-[90vw] max-w-md':'left-0 w-[90vw] max-w-md', className].join(' ')}>
      {children}
    </div>
  </div>);
}
export function SheetHeader({ children }){ return <div className='mb-2'>{children}</div>; }
export function SheetTitle({ children }){ return <h3 className='text-lg font-semibold'>{children}</h3>; }
