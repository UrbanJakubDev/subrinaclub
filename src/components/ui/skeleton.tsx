// Tailwind Skeleton Component for loading state

import Card from "@/components/ui/mtui";

type SkeletonProps = {
   className?: string;
   type?: 'card' | 'table' | 'chart';
}

const Skeleton: React.FC<SkeletonProps> = ({ className, type = 'card' }) => {
   if (type === 'card') {
      return (
         <Card className={`flex flex-col p-8 gap-10 ${className}`}>
            <div className="animate-pulse space-y-4">
               <div className="h-6 bg-gray-300 rounded w-3/4"></div>
               <div className="h-6 bg-gray-300 rounded w-1/2"></div>
               <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="flex gap-4">
               <div className="animate-pulse space-y-4 w-1/2">
                  <div className="h-6 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-2/3"></div>
               </div>
               <div className="animate-pulse space-y-4 w-1/2">
                  <div className="h-6 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-2/3"></div>
               </div>
            </div>
         </Card>
      );
   }

   if (type === 'table') {
      return (
         <Card className={`p-8 w-full ${className}`}>
            <div className="animate-pulse space-y-4">
               <div className="h-10 bg-gray-300 rounded w-full"></div>
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                     <div className="h-8 bg-gray-300 rounded w-1/6"></div>
                     <div className="h-8 bg-gray-300 rounded w-2/6"></div>
                     <div className="h-8 bg-gray-300 rounded w-2/6"></div>
                     <div className="h-8 bg-gray-300 rounded w-1/6"></div>
                  </div>
               ))}
            </div>
         </Card>
      );
   }

   if (type === 'chart') {
      return (
         <Card className={`p-8 ${className}`}>
            <div className="animate-pulse space-y-4">
               <div className="h-8 bg-gray-300 rounded w-1/4"></div>
               <div className="h-64 bg-gray-300 rounded w-full"></div>
               <div className="flex justify-between">
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className="h-4 bg-gray-300 rounded w-16"></div>
                  ))}
               </div>
            </div>
         </Card>
      );
   }

   return null;
};

export default Skeleton;