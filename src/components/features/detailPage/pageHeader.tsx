'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { faPenToSquare, faChartSimple, faSackDollar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import type { ButtonStyleTypes } from "@material-tailwind/react";
import { useModal } from "@/contexts/ModalContext";
import { useModalStore } from "@/stores/ModalStore";

type Props = {
  userName: string;
  userId: string;
  active: number | boolean;
  formUrl?: string;
  accountUrl?: string;
  statsUrl?: string;
  openModal?: boolean;
  modalId?: string;
  addBtn?: boolean;
};

export default function PageHeader({ userName, userId, active, formUrl, accountUrl, statsUrl, openModal, modalId, addBtn }: Props) {

  // Get actual path for conditional rendering
  const pathname = usePathname()
  const router = useRouter()

  const { actions } = useModalStore();

  // Get first part of the path
  const path = pathname.split("/")[1]

  return (
    <div className="pb-4">

      <div className="flex justify-between">
        <div>
          <Button onClick={() => router.back()} color="blue" size="sm" > &lt;&lt; </Button>

        </div>


        <div className="flex gap-2">
          {userId !== "0" && addBtn && (
            <Link href="#">
              <Button onClick={() => actions.openModal('transactionForm')}>
                <FontAwesomeIcon icon={faPlus} />
                <span> Transakce</span>
              </Button>
            </Link>
          )}

          {openModal && (
            <>
              <Link href="#">
                <Button onClick={() => handleOpenModal(modalId)}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span> Přidat</span>
                </Button>
              </Link>
            </>
          )}

          {formUrl && (
            <Link href={formUrl}>
              <Button>
                <FontAwesomeIcon icon={faPenToSquare} />
                <span> Upravit</span>
              </Button>
            </Link>
          )}


          {accountUrl && (
            <Link href={accountUrl}>
              <Button>
                <FontAwesomeIcon icon={faSackDollar} />
                <span> Účet</span>
              </Button>
            </Link>
          )}

          {statsUrl && (
            <Link href={statsUrl}>
              <Button>
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
