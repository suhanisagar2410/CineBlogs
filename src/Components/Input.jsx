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
        label ? <label className='text-2xl font-semibold'>{label}</label> : null
      }

      <input type={type} className={`${className}`} {...props} ref={ref}/>
    </div>
  )
}

export default React.forwardRef(Input) 
