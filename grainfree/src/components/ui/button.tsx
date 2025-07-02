'use client' // Tells Next.js this component runs in the browser (for interactivity)

import React from 'react'

// Define what props the Button can accept
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' // Optional prop: choose between 2 button styles
}

export default function Button(props: ButtonProps) {
  // Destructure props with default values
  const {
    variant = 'primary',  // If variant is not passed, default to 'primary'
    className = '',       // Allow additional custom styles if needed
    ...rest               // Collect all other props like onClick, disabled, etc.
  } = props

  // Set base Tailwind styles for all buttons
  const baseStyles = 'px-4 py-2 rounded font-semibold transition'

  // Set different styles based on the variant
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-300 text-black hover:bg-gray-400'
  }


  // Final styles applied to the button
  const finalClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

  // Return the actual button element with all props
  return <button className={finalClassName} {...rest} />
}
