import PageTopBar from '@/components/ui/pageTopBar'
import React from 'react'

type Props = {
   children: React.ReactNode
}

// PageComponent contains the main content of the page and context of the page
const PageComponent = ({ children }: Props) => {

   // Context of the page who stores the state of the page for show modal, on click events etc.
   return (
      <div className="content-container p-6 my-2 flex flex-col h-11/12" >
         <PageTopBar />
         {children}
      </div>
   )
}

export default PageComponent