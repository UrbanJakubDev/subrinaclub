"use client"
import React from "react";
import {
   Navbar,
   Collapse,
   Typography,
   IconButton,
   List,
   ListItem,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
} from "@material-tailwind/react";
import Logo from "./logo";
import User from "./user";
import Link from "next/link";
import { it } from "node:test";

const newMenuItems = [
   {
      title: "Lidé",
      items: [
         {
            title: "Zákazníci",
            description: "Find the perfect solution for your needs.",
            link: "/users",
         },
         {
            title: "Obchondíci",
            description: "Find the perfect solution for your needs.",
            link: "/dealers",
         },
         {
            title: "Obchodní zástupci",
            description: "Find the perfect solution for your needs.",
            link: "/sales-managers",
         },
      ],
   },
   {
      title: "Reporty",
      items: [
         {
            title: "Reporty - premium bonus",
            description: "Find the perfect solution for your needs.",
            link: "/reports/bonus",
         },
         {
            title: "Reporty - seznam obratu",
            description: "Find the perfect solution for your needs.",
            link: "/reports/transactions",
         },
      ],
   },
   {
      title: "Čísleníky",
      items: [
         {
            title: "Číselník - bonusy",
            description: "Find the perfect solution for your needs.",
            link: "/dictionaries/bonuses",
         },
         {
            title: "Číselník - obchodníci",
            description: "Find the perfect solution for your needs.",
            link: "#",
         },
      ],
   }
];

function NavListMenu({ title, items }) {
   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
   const renderItems = items.map(({ title, description, link }, key) => (
      <Link href={link} key={key}>
         <MenuItem className="flex items-center gap-3 rounded-lg">
            <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2 ">
            </div>
            <div>
               <Typography
                  variant="h6"
                  color="blue-gray"
                  className="flex items-center text-sm font-bold"
               >
                  {title}
               </Typography>
               <Typography
                  variant="paragraph"
                  className="text-xs !font-medium text-blue-gray-500"
               >
                  {description}
               </Typography>
            </div>
         </MenuItem>
      </Link>
   ));

   return (
      <Menu
         open={isMenuOpen}
         handler={setIsMenuOpen}
         offset={{ mainAxis: 20 }}
         placement="bottom"
         allowHover={true}
      >
         <MenuHandler>
            <Typography as="div" variant="small" className="font-medium">
               <ListItem
                  className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
                  selected={isMenuOpen}
               >
                  {title}
               </ListItem>
            </Typography>
         </MenuHandler>
         <MenuList className="max-w-screen-xl rounded-xl">
            <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
               {renderItems}
            </ul>
         </MenuList>
      </Menu>
   );
}

function NavList() {
   return (
      <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
         <Link href={"/"}>
            <Typography
               as="span"
               variant="small"
               color="blue-gray"
               className="font-medium"
            >
               <ListItem className="flex items-center gap-2 py-2 pr-4">
                  Home
               </ListItem>
            </Typography>
         </Link>
         {newMenuItems.map((menu, index) => (
            <NavListMenu key={index} title={menu.title} items={menu.items} />
         ))}
         <Link href={"/contact"}>

            <Typography
               as="span"
               variant="small"
               color="blue-gray"
               className="font-medium"
            >
               <ListItem className="flex items-center gap-2 py-2 pr-4">
                  Contact Us
               </ListItem>
            </Typography>
         </Link>
      </List>
   );
}

export function MegaMenuWithHover() {
   return (
      <div className="mx-auto w-full px-4 py-2 ">
         <div className="flex items-center justify-between text-blue-gray-900">
            <Logo />
            <div>
               <NavList />
            </div>
            <User />
         </div>
      </div>
   );
}
