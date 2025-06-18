"use client"
import { Card } from "@material-tailwind/react";

interface NoDataProps {
   message?: string;
}

export default function NoData({ message = "Pro tento výběr nebyla nalezena žádná data." }: NoDataProps) {
   return (
      <Card className="w-full p-6 text-center">
         {message}
      </Card>
   );
}