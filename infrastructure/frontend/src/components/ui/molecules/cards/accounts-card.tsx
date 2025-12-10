"use client";

interface AccountsCardProps {
  count: number;
}

export const AccountsCard = ({ count }: AccountsCardProps) => {
  return (
    <div className="h-48 w-full bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-white text-sm font-semibold mb-2">
            Comptes Clients
          </p>
          <h3 className="text-6xl font-bold text-white drop-shadow-lg">
            {count}
          </h3>
        </div>
      </div>
    </div>
  );
};
