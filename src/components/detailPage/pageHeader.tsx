'use client'
import Link from "next/link";
import Button from "../ui/button";
import { usePathname } from "next/navigation";
import { faPenToSquare, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  userName: string;
  userId: string;
  active: number | boolean;
  url?: string;
};

export default function PageHeader({ userName, userId, active, url }: Props) {
  
  // Get actual path for conditional rendering
  const pathname = usePathname()

  // Get first part of the path
  const path = pathname.split("/")[1]


  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <div>
          <Link href={`/${path}`}>
            <Button variant="secondary">{"<<"}</Button>
          </Link>
        </div>
        <div>
          {pathname.includes("stats") ? (
            <Link href={`/${path}/${userId}`}>
              <Button variant="info"><FontAwesomeIcon icon={faPenToSquare} /></Button>
            </Link>
          ) : (
            <Link href={`/${path}/${userId}/stats`}>
              <Button variant="info"><FontAwesomeIcon icon={faChartSimple} /></Button>
            </Link>
          )}
        </div>
      </div>
      <div>
        {userName && userId ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
            <div className="flex flex-row gap-4 items-start">
              <span className="text-sm text-gray-500">ID: {userId}</span>
              <span className="text-sm text-gray-500">
                Active: {active ? "Yes" : "No"}
              </span>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-gray-900">User</h1>
        )}
      </div>
    </div>
  );
}