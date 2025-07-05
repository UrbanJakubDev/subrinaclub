"use client"

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconDefinition
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    const variants = {
      primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 disabled:bg-gray-300",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-400 disabled:bg-gray-300",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-300",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-300 disabled:hover:bg-transparent"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
      md: "px-4 py-2 text-sm rounded-lg gap-2",
      lg: "px-5 py-3 text-base rounded-lg gap-2"
    }
    
    const iconSizes = {
      sm: "w-3 h-3",
      md: "w-4 h-4", 
      lg: "w-5 h-5"
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <FontAwesomeIcon icon={icon} className={iconSizes[size]} />
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <FontAwesomeIcon icon={icon} className={iconSizes[size]} />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
