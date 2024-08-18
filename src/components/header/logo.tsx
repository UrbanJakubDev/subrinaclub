import React from "react";
import Image from "next/image";
import logo from "/public/img/logo.png";
import logonew from "/public/img/logo_new-removebg-preview.png";

type Props = {};

export default function Logo({}: Props) {
  return (
    <div className="flex items-baseline w-60">
      <Image src={logonew} alt="logo" className="-translate-y-2 " />
    </div>
  );
}

