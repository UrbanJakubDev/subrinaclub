'use client'
import { Input, Typography } from '@material-tailwind/react'
import { useFormContext } from 'react-hook-form'

type InputFieldProps = {
    label: string
    name: string
    type?: string
    defaultValue?: string | number | null | undefined
    disabled?: boolean
    customClass?: string
    helperText?: string
}

const InputField = ({
    label,
    name,
    type = 'text',
    defaultValue,
    disabled,
    customClass,
    helperText,
}: InputFieldProps) => {
    const {
        register,
        formState: { errors, touchedFields },
    } = useFormContext()

    // Show error only if field has been touched (user interacted with it)
    const showError = !!errors[name] && !!touchedFields[name]

    return (
        <div className={customClass}>
            <Input
                crossOrigin={undefined}
                size="md"
                error={showError} // Show error only if field is touched
                label={label}
                type={type}
                defaultValue={defaultValue} // Set default value
                {...register(name)} // Use register from useFormContext
                readOnly={disabled}
            />
            {helperText && (
                <span className="mt-2 flex items-center gap-1 font-normal">{helperText}</span>
            )}
            {showError && <span className="text-red-500">{errors[name]?.message}</span>}
        </div>
    )
}

export default InputField
