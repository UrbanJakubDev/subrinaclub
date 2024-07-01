'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { faPenToSquare, faChartSimple, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import type { ButtonStyleTypes } from "@material-tailwind/react";

type Props = {
  userName: string;
  userId: string;
  active: number | boolean;
  formUrl?: string;
  accountUrl?: string;
  statsUrl?: string;
};

export default function PageHeader({ userName, userId, active, formUrl, accountUrl, statsUrl }: Props) {

  // Get actual path for conditional rendering
  const pathname = usePathname()

  // Get first part of the path
  const path = pathname.split("/")[1]

  return (
    <div className="pb-4 border-b">

      <div className="flex justify-between">
        <div>
          <Link href={`/${path}`}>
            <Button>{"<<"}</Button>
          </Link>
        </div>
        <div className="flex gap-2">
          {formUrl && (
            <Link href={formUrl}>
              <Button color="lightBlue" ripple="light">
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            </Link>
          )}


          {accountUrl && (
            <Link href={accountUrl}>
              <Button color="lightBlue" ripple="light">
              <FontAwesomeIcon icon={faSackDollar} />
              </Button>
            </Link>
          )}

          {statsUrl && (
            <Link href={statsUrl}>
              <Button color="lightBlue" ripple="light">
                <FontAwesomeIcon icon={faChartSimple} />
              </Button>
            </Link>
          )}

        </div>
      </div>

    </div>
  );
}
