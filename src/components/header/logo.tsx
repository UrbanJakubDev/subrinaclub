import React from "react";
import Image from "next/image";
import logo from "/public/img/logo.png";

type Props = {};

export default function Logo({}: Props) {
  return (
    <div className=" flex items-baseline ">
      <Image src={logo} alt="logo" className=" -translate-y-2" />
      <div className=" text-[#8D354E]">Club</div>
    </div>
  );
}

