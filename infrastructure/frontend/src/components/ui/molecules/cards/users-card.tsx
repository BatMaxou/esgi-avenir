"use client";

interface UsersCardProps {
  count: number;
}

export const UsersCard = ({ count }: UsersCardProps) => {
  return (
    <div className="h-48 w-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg">
      <div className="h-full bg-[url('/assets/images/users-icon.svg')] bg-no-repeat bg-[95%_100%] bg-[length:150px_150px] flex items-start">
        <div className="flex flex-col items-center flex-1">
          <h3 className="text-4xl uppercase font-bold text-white drop-shadow-lg p-6">
            Utilisateurs
          </h3>
          <span className="text-4xl font-bold text-white drop-shadow-lg p-6">
            {count}
          </span>
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};
