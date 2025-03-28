"use client"
import React from "react";
import {
   Typography,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faMedal, faUser } from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

const newMenuItems = [
   {
      title: "Zákazníci",
      items: [
         {
            title: "Přehled",
            description: "Základní informace o zákaznících.",
            link: "/customers",
            icon: faUser,
         },
         {
            title: "Šetřící období",
            description: "Přehled aktivních šetřících období. Hromadné akce.",
            link: "/customers/saving-periods",
            icon: faCoins,
         },
         // {
         //    title: "Stříbrná a zlatá pozice",
         //    description: "Vyhodnocení stříbrné a zlaté pozice.",
         //    link: "/customers",
         //    icon: faMedal,
         // },
         {
            title: "Seznam účtů",
            description: "Seznam aktivních účtů.",
            link: "/accounts",
            icon: faUser,
         }
      ],
   },
   {
      title: "Obchodní zástupci",
      items: [
         {
            title: "Přehled",
            description: "Základní informace o obchodních zástupcích.",
            link: "/sales-managers",
            icon: faUser,
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
            title: "Premium Bonusy",
            description: "Čísleník premium bonusů.",
            link: "/dictionaries/bonus",
         },
         {
            title: "Obchodníci",
            description: "Čísleník obchodníků.",
            link: "/dictionaries/dealers",
         },
      ],
   }
];

function ListItemWrapper({ children, selected }) {
   return (
      <ListItem selected className="flex items-center h-full gap-2 px-6 py-4 text-white bg-gray-900 hover:text-black hover:bg-white hover:rounded-md">
        {children}
      </ListItem>
   );
}


function NavListMenu({ title, items }) {
   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
   const renderItems = items.map(({ title, description, link, icon }, key) => (
      <Link href={link} key={key} className="bg-white rounded-md">
         <MenuItem className="flex items-center gap-3 rounded-lg">
            <FontAwesomeIcon icon={icon} />
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
               <ListItemWrapper selected={isMenuOpen}>{title}</ListItemWrapper>
            </Typography>
         </MenuHandler>
         <MenuList className="max-w-screen-xl rounded-xl">
            <ul className="outline-none outline-0">
               {renderItems}
            </ul>
         </MenuList>
      </Menu>
   );
}

function NavList() {
   return (
      <List className="items-baseline p-0 mt-4 mb-6 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
         <Link href={"/"}>
            <Typography
               as="span"
               variant="small"
               color="blue-gray"
               className="font-medium"
            >
               <ListItemWrapper>Home</ListItemWrapper>
            </Typography>
         </Link>
         {newMenuItems.map((menu, index) => (
            <NavListMenu key={index} title={menu.title} items={menu.items} />
         ))}

      </List>
   );
}

export function MegaMenuWithHover() {
   return (
      <div className="w-screen px-8 py-2 mx-auto bg-gray-100">
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
