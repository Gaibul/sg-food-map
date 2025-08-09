import React from 'react';
export function Select({ value, onValueChange, children }){
  let items = [];
  React.Children.forEach(children, child => {
    if (child && child.type && child.type.displayName==='SelectContent'){
      React.Children.forEach(child.props.children, c => {
        if (c && c.type && c.type.displayName==='SelectItem'){
          items.push({ value: c.props.value, label: c.props.children });
        }
      });
    }
  });
  return <select value={value||''} onChange={(e)=>onValueChange?.(e.target.value)} className='border rounded-xl h-8 px-2 w-full'>
    <option value='' disabled hidden>Select</option>
    {items.map(it => <option key={it.value} value={it.value}>{it.label}</option>)}
  </select>;
}
export function SelectTrigger({ children, className='' }){ return <div className={className}>{children}</div>; }
SelectTrigger.displayName='SelectTrigger';
export function SelectValue({ placeholder }){ return <span className='text-neutral-500'>{placeholder}</span>; }
SelectValue.displayName='SelectValue';
export function SelectContent({ children }){ return <>{children}</>; }
SelectContent.displayName='SelectContent';
export function SelectItem({ value, children }){ return <option value={value}>{children}</option>; }
SelectItem.displayName='SelectItem';
