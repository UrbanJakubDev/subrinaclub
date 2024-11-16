"use client"
import { Card } from "@material-tailwind/react";

export default function NoData() {
   return (
      <Card className="w-full p-6 text-center">
         Pro tento výběr nebyla nalezena žádná data.
      </Card>
   );
}