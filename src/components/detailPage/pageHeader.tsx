'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { faPenToSquare, faChartSimple, faSackDollar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import type { ButtonStyleTypes } from "@material-tailwind/react";
import { useModal } from "@/contexts/ModalContext";

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

  const { handleOpenModal } = useModal();

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
          <Link href="#">
            <Button onClick={() => handleOpenModal('transactionForm')} color="lightBlue" ripple="light">
              <FontAwesomeIcon icon={faPlus} />
              <span> Přidat</span>
            </Button>
          </Link>

          {formUrl && (
            <Link href={formUrl}>
              <Button color="lightBlue" ripple="light">
                <FontAwesomeIcon icon={faPenToSquare} />
                <span> Zákaznice</span>
              </Button>
            </Link>
          )}


          {accountUrl && (
            <Link href={accountUrl}>
              <Button color="lightBlue" ripple="light">
                <FontAwesomeIcon icon={faSackDollar} />
                <span> Účet</span>
              </Button>
            </Link>
          )}

          {statsUrl && (
            <Link href={statsUrl}>
              <Button color="lightBlue" ripple="light">
                <FontAwesomeIcon icon={faChartSimple} />
                <span> Statistiky</span>
              </Button>
            </Link>
          )}

        </div>
      </div>

    </div>
  );
}
