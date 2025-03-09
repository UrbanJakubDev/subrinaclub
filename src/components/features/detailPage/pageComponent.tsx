import PageTopBar from '@/components/ui/pageTopBar'
import React from 'react'

type Props = {
   children: React.ReactNode
   full?: boolean
}

/**
 * PageComponent - A container for page content with optional full-width styling
 * 
 * @component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The content to be rendered inside the component
 * @param {boolean} [props.full=false] - When true, removes the content-container class for full-width display
 * 
 * @returns A div container with PageTopBar and the provided children
 * 
 * @example
 * // Standard width with content container
 * <PageComponent>
 *   <YourContent />
 * </PageComponent>
 * 
 * @example
 * // Full width without content container
 * <PageComponent full>
 *   <YourContent />
 * </PageComponent>
 */
const PageComponent = ({ children, full = false }: Props) => {

   // Context of the page who stores the state of the page for show modal, on click events etc.
   return (
      <div className={`${!full ? 'content-container' : ''} p-6 my-2 flex flex-col h-11/12`} >
         <PageTopBar />
         {children}
      </div>
   )
}

export default PageComponent