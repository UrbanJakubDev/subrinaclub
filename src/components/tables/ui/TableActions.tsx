'use client'
import { DialogFooter } from '@material-tailwind/react'
import { DialogBody } from '@material-tailwind/react'
import { DialogHeader } from '@material-tailwind/react'
import { Dialog } from '@material-tailwind/react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@material-tailwind/react'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

type TableActionsProps = {
    record: any
    onEdit?: (record: any) => void
    onDelete?: (recordId: number) => void
    canEdit?: boolean
    canDelete?: boolean
}

const TableActions = ({ 
    record, 
    onEdit, 
    onDelete, 
    canEdit = true, 
    canDelete = true 
}: TableActionsProps) => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(!open)

    const handleDelete = () => {
        if (record?.id && onDelete) {
            onDelete(record.id)
            setOpen(false)
        }
    }

    const message = 'Opravdu chcete smazat tento záznam?'

    if (!record) return null

    return (
        <>
            <div className="flex justify-center gap-2">
                {canEdit && onEdit && (
                    <Button size="sm" onClick={() => onEdit(record)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                )}
                {canDelete && onDelete && (
                    <Button size="sm" onClick={handleOpen}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                )}
            </div>

            {canDelete && onDelete && (
                <Dialog open={open} handler={handleOpen} size="xs">
                    <DialogHeader>Potvrzení smazání</DialogHeader>
                    <DialogBody divider className="text-center">
                        {message}
                    </DialogBody>
                    <DialogFooter className="flex justify-center gap-2">
                        <Button size="sm" onClick={handleOpen}>
                            Zrušit
                        </Button>
                        <Button size="sm" color="red" onClick={handleDelete}>
                            Smazat
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </>
    )
}

export default TableActions
