"use client"

import { Select, Option, Typography } from "@material-tailwind/react"
import { useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'

type SelectOption = {
  value: number
  label: string
}

type SelectFieldProps = {
  label: string
  name: string
  options: SelectOption[]
  defaultValue?: number
  disabled?: boolean
  customClass?: string
  helperText?: string
}

const SelectField = ({
  label,
  name,
  options,
  defaultValue,
  disabled,
  customClass,
  helperText
}: SelectFieldProps) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext()
  const value = watch(name)
  const [displayLabel, setDisplayLabel] = useState("")

  // Set default value and update display label
  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue)
      // Find and set the label for the default value
      const option = options.find(opt => opt.value === defaultValue)
      if (option) {
        setDisplayLabel(option.label)
      }
    }
  }, [defaultValue, name, setValue, options])

  // Update display label when value changes
  useEffect(() => {
    const option = options.find(opt => opt.value === value)
    if (option) {
      setDisplayLabel(option.label)
    } else {
      setDisplayLabel("")
    }
  }, [value, options])

  // Register field
  register(name)

  return (
    <div className={customClass}>
      <Select
        label={label}
        value={value?.toString() ?? ''}
        onChange={(newValue) => {
          setValue(name, newValue ? parseInt(newValue) : null)
          // Update display label
          const option = options.find(opt => opt.value === parseInt(newValue))
          if (option) {
            setDisplayLabel(option.label)
          }
        }}
        disabled={disabled}
        error={!!errors[name]}
        selected={() => (
          displayLabel ? (
            <span className="truncate">
              {displayLabel}
            </span>
          ) : null
        )}
      >
        <Option value="">Vyberte...</Option>
        {options.map((option) => (
          <Option 
            key={option.value} 
            value={option.value.toString()}
          >
            {option.label}
          </Option>
        ))}
      </Select>
      
      {helperText && (
        <Typography variant="small" className="mt-2 flex items-center gap-1 font-normal">
          {helperText}
        </Typography>
      )}
      {errors[name] && (
        <Typography variant="small" color="red" className="flex items-center gap-1 font-normal">
          {errors[name]?.message as string}
        </Typography>
      )}
    </div>
  )
}

export default SelectField