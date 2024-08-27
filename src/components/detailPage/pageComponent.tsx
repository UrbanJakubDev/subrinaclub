import CustomerProvider from '@/contexts/CustomerContext'
import ModalProvider from '@/contexts/ModalContext'
import React from 'react'

type Props = {
   children: React.ReactNode
}

// PageComponent contains the main content of the page and context of the page
const PageComponent = ({ children }: Props) => {

   // Context of the page who stores the state of the page for show modal, on click events etc.



   return (
      <CustomerProvider>
         <ModalProvider>
            <div className="content-container p-6 my-2 flex flex-col h-11/12" >
               {children}
            </div>
         </ModalProvider>
      </CustomerProvider>
   )
}

export default PageComponent