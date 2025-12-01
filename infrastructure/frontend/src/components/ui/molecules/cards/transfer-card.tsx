"use client";

export const TransferCard = () => {
  return (
    <div className="h-48 w-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg">
      <div className="h-full bg-[url('/assets/images/transfer-icon.svg')] bg-no-repeat bg-[320px_40px] bg-[length:150px_150px] flex items-start">
        <h3 className="text-4xl uppercase font-bold text-white drop-shadow-lg p-6">
          Transférer de <br />
          l'argent
        </h3>
      </div>
    </div>
  );
};
