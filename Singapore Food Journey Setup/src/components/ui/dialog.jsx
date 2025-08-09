import React, { useState, createContext, useContext } from 'react';
const Ctx = createContext();
export function Dialog({ open, onOpenChange, children }){
  const [uOpen, setUOpen] = useState(false);
  const actualOpen = open!==undefined ? open : uOpen;
  const setOpen = onOpenChange || setUOpen;
  return <Ctx.Provider value={{ open: actualOpen, setOpen }}>{children}</Ctx.Provider>;
}
export function DialogTrigger({ asChild, children }){
  const { setOpen } = useContext(Ctx);
  const child = React.Children.only(children);
  const props = { onClick: (...a)=>{ child.props.onClick?.(...a); setOpen(true); } };
  return asChild ? React.cloneElement(child, props) : <button {...props}>{children}</button>;
}
export function DialogContent({ children, className='' }){
  const { open, setOpen } = useContext(Ctx);
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={()=>setOpen(false)}></div>
      <div className={['relative bg-white rounded-2xl p-4 w-[90vw] max-w-xl shadow-lg', className].join(' ')}>
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ children }){ return <div className='mb-2'>{children}</div>; }
export function DialogTitle({ children }){ return <h3 className='text-lg font-semibold'>{children}</h3>; }
