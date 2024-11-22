// Tailwind Skeleton Component for loading state

import Card from "@/components/ui/mtui";

type SkeletonProps = {
   className?: string;
   type?: 'card' | 'table' | 'chart';
}

const Skeleton: React.FC<SkeletonProps> = ({ className, type = 'card' }) => {
   // Helper function to get random width percentage between min and max
   const getRandomWidth = (min: number, max: number) => {
      return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
   };

   // Helper function to get random number of elements
   const getRandomCount = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
   };

   if (type === 'card') {
      const topLines = getRandomCount(2, 4);
      const leftLines = getRandomCount(2, 4);
      const rightLines = getRandomCount(2, 4);

      return (
         <Card className={`flex flex-col p-8 gap-10 ${className}`}>
            <div className="animate-pulse space-y-4">
               {[...Array(topLines)].map((_, i) => (
                  <div 
                     key={i} 
                     className="h-6 bg-gray-300 rounded" 
                     style={{ width: getRandomWidth(60, 100) }}
                  ></div>
               ))}
            </div>
            <div className="flex gap-4">
               <div className="animate-pulse space-y-4 w-1/2">
                  {[...Array(leftLines)].map((_, i) => (
                     <div 
                        key={i} 
                        className="h-6 bg-gray-300 rounded" 
                        style={{ width: getRandomWidth(70, 95) }}
                     ></div>
                  ))}
               </div>
               <div className="animate-pulse space-y-4 w-1/2">
                  {[...Array(rightLines)].map((_, i) => (
                     <div 
                        key={i} 
                        className="h-6 bg-gray-300 rounded" 
                        style={{ width: getRandomWidth(70, 95) }}
                     ></div>
                  ))}
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