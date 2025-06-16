import { CheckCircle, Clock, Mail, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
export interface CardInfoProps {
  cardNumber: string;
  fullName: string;
  how_much: number;
  requestDate: string;
  status: string;
  commend?: string;
}

export default function CardInfo({
  cardNumber,
  fullName,
  how_much,
  requestDate,
  status,
  commend,
}: CardInfoProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="text-green-500" size={16} />;
      case "PENDING":
        return <Clock className="text-orange-500" size={16} />;
      case "CANCELLED":
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          {getStatusIcon(status)}
          <div>
            <p className="font-medium flex items-center gap-1 text-gray-900 dark:text-white">
              <img
                src="/CoinLogo.png"
                className="w-4 h-4"
                alt={t("withdraw.coinAlt")}
              />
              {how_much}
            </p>
          </div>
          <div>
            <p className="font-medium flex flex-col gap-1 text-gray-900 dark:text-white">
              <span className="text-sm">{fullName}</span>
              <span className="text-xs">
                {t("withdraw.cardNumberMask", {
                  first: cardNumber.slice(0, 4),
                  last: cardNumber.slice(-4),
                })}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right flex items-end gap-3 flex-col">
          <div className="flex items-center gap-3 text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status === "SUCCESS" && t("withdraw.success")}
              {status === "PENDING" && t("withdraw.processing")}
              {status === "CANCELLED" && t("withdraw.rejected")}
            </span>
            {requestDate && (
              <p className="text-[10px] bg-gray-300 text-gray-900 inline-flex items-center px-2 py-0.5 rounded-full font-medium">
                {/* {t("withdraw.requestDateLabel")}:{" "} */}
                {new Date(requestDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            type="button"
            className="text-xs bg-blue-100 text-blue-800 inline-flex items-center px-3 py-0.5 rounded-full font-medium mt-2"
            onClick={() => setShowModal(true)}
            title={t("withdraw.showComment")}
            aria-label={t("withdraw.showComment")}
          >
            <Mail className="w-5" />
          </button>
        </div>
      </div>
      {/* Modal for comment */}
      {showModal && (
        <div className="fixed bg-gray-900/50 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-lg relative">
            <button
              className="absolute top-3 right-5 text-black hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Comment
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-200 break-words">
              {commend && commend.trim() !== "" ? (
                <p>{commend}</p>
              ) : (
                <p className="italic text-gray-400">No comment available</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Status va data commenti */}
      {/* <div className="mt-1 text-xs text-gray-400 dark:text-gray-500 px-2">
        status: {status} | data: {requestDate}
        status: {status} | date:{" "}
        {requestDate ? new Date(requestDate).toLocaleDateString() : "-"}
      </div> */}
    </>
  );
}
