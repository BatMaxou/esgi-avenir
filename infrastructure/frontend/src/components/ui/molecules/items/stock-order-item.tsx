"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Stock } from "../../../../../../../domain/entities/Stock";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../atoms/tooltip";
import { SearchIcon, TrashIcon } from "lucide-react";
import { StockOrderStatusEnum } from "../../../../../../../domain/enums/StockOrderStatusEnum";
import { useStockOrders } from "@/contexts/StockOrdersContext";
import { DeleteStockOrderAlert } from "../alerts/delete-stock-order-alert";
import { MatchStockOrdersDialog } from "../dialogs/match-stock-orders-dialog";

interface StockOrderItemProps {
  id: number;
  type: string;
  status: string;
  amount: number;
  purchasedPrice?: number;
  stock: Stock | undefined;
}

export function StockOrderItem({
  id,
  type,
  status,
  amount,
  purchasedPrice,
  stock,
}: StockOrderItemProps) {
  const t = useTranslations("components.items.stockOrder");
  const { deleteStockOrder, getAllMatch } = useStockOrders();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteStockOrder = async () => {
    setIsDeleting(true);
    await deleteStockOrder(id);
    setIsDeleting(false);
    setOpenDeleteDialog(false);
  };

  const handleViewMatches = async () => {
    setOpenMatchDialog(true);
    await getAllMatch(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sell":
        return "bg-red-100 text-red-600";
      case "buy":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 rounded-lg transition-colors border bg-white border-gray-100 hover:bg-gray-50">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">{stock?.name}</span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                type
              )}`}
            >
              {t(`type.${type}`)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                status
              )}`}
            >
              {t(`status.${status}`)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              {t("requestedPrice")} : {amount} €
            </span>
            {status === StockOrderStatusEnum.COMPLETED && purchasedPrice !== undefined && (
              <>
                {console.log("purchasedPrice", purchasedPrice)}
                {type === "buy" ? (
                  <span className="text-gray-600 ms-4">
                    {t("purchasedPrice")} : {purchasedPrice} €
                  </span>
                ) : (
                  <span className="text-gray-600 ms-4">
                    {t("soldPrice")} : {purchasedPrice} €
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        {status === StockOrderStatusEnum.PENDING && (
          <div className="flex-1 space-x-2 text-right">
            <Tooltip>
              <TooltipTrigger>
                <TrashIcon
                  className="h-5 w-5 text-red-600 hover:text-red-700 cursor-pointer"
                  onClick={() => setOpenDeleteDialog(true)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("deleteStockOrder")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <SearchIcon
                  className="h-5 w-5 text-red-600 hover:text-red-700 cursor-pointer"
                  onClick={handleViewMatches}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("viewOffers")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <MatchStockOrdersDialog
        open={openMatchDialog}
        onOpenChange={setOpenMatchDialog}
        stockName={stock?.name || ""}
        stockOrderId={id}
      />

      <DeleteStockOrderAlert
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDeleteStockOrder}
        stock={stock}
        amount={amount}
        isDeleting={isDeleting}
      />
    </div>
  );
}
