import React from "react";
import Image from "next/image";
import logo from "/public/img/logo.png";

type Props = {};

export default function Logo({}: Props) {
  return (
    <div className=" flex items-baseline w-60">
      <Image src={logo} alt="logo" className=" -translate-y-2" />
      <div className="ms-2 font-semibold text-2xl text-[#8D354E] -translate-y-2">Club</div>
    </div>
  );
}

