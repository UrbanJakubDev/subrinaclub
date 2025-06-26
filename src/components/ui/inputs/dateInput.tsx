'use client'
import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Input, Typography } from '@material-tailwind/react'
import { format, parseISO, isValid, isDate } from 'date-fns'

type InputDateFieldProps = {
    label: string
    name: string
    defaultValue?: string | null | undefined | Date
    helperText?: string
    errors?: any
}

const InputDateField = ({ label, name, defaultValue, helperText, errors }: InputDateFieldProps) => {
    const {
        register,
        setValue,
        getValues,
        watch,
        formState: { errors: formErrors, touchedFields },
    } = useFormContext()
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // Watch for changes to the field value
    const fieldValue = watch(name)

    // Use form errors if no external errors provided, and only show if touched
    const currentErrors = errors || formErrors
    const showError = !!currentErrors[name] && !!touchedFields[name]

    useEffect(() => {
        // Initialize the date from defaultValue or current form value
        const initialValue = fieldValue || defaultValue
        if (initialValue) {
            if (typeof initialValue === 'string' && isValid(parseISO(initialValue))) {
                setSelectedDate(parseISO(initialValue))
            } else if (isDate(initialValue)) {
                setSelectedDate(initialValue as Date)
            }
        }
    }, [defaultValue, fieldValue])

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date)
        setValue(name, date ? format(date, 'yyyy-MM-dd') : null, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                showYearDropdown
                scrollableYearDropdown
                placeholderText="DD.MM.YYYY"
                customInput={
                    <Input
                        crossOrigin={undefined}
                        size="md"
                        label={label}
                        error={showError}
                        value={selectedDate ? format(selectedDate, 'dd.MM.yyyy') : ''}
                    />
                }
            />
            {helperText && <Typography variant="small">{helperText}</Typography>}
            {showError && <Typography color="red">{currentErrors[name]?.message}</Typography>}
        </div>
    )
}

export default InputDateField
