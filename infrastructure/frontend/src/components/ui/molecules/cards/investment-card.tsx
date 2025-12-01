"use client";

export const InvestmentCard = () => {
  return (
    <div className="h-48 w-full bg-white border-2 border-red-700 rounded-lg shadow-lg">
      <div className="h-full bg-[url('/assets/images/trading-bars-icon.svg')] bg-no-repeat bg-[320px_40px] bg-[length:150px_150px] flex items-start">
        <h3 className="text-4xl uppercase font-bold text-red-600 drop-shadow-lg p-6">
          Consultez vos <br />
          investissements
        </h3>
      </div>
    </div>
  );
};

export default InvestmentCard;
