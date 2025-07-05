import React from 'react'
import { IndeterminateCheckboxProps } from './types'

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef<HTMLInputElement>(null)
        const resolvedRef = (ref || defaultRef) as React.MutableRefObject<HTMLInputElement>

        React.useEffect(() => {
            if (resolvedRef.current) {
                resolvedRef.current.indeterminate = indeterminate ?? false
            }
        }, [resolvedRef, indeterminate])

        return (
            <input
                type="checkbox"
                ref={resolvedRef}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...rest}
            />
        )
    }
)

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

export default IndeterminateCheckbox 