import React from 'react'

function Input({
    label,
    type="text",
    className="",
    ...props
}, ref) {
  return (
    <div className='w-full '>
      {
        label ? <label className='text-[18px] font-medium  mr-2' >{label}</label> : null
      }

      <input type={type}  className={`${className} border-none outline-none`} {...props} ref={ref}/>
    </div>
  )
}

export default React.forwardRef(Input) 
