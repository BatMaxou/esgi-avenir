"use client";

import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";

type Props = {
  beneficiaries: Beneficiary[];
  onClick?: (beneficiary: Beneficiary) => void;
};

export const BeneficiariesList = ({ beneficiaries, onClick }: Props) => {
  const handleClick = (beneficiary: Beneficiary) => {
    onClick?.(beneficiary);
    return;
  };

  return (
    <>
      {beneficiaries.length > 0 ? (
        <>
          {beneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center hover:cursor-pointer hover:bg-gray-100"
              onClick={() => handleClick(beneficiary)}
            >
              <div>
                {beneficiary.name ? (
                  <p className="font-semibold text-gray-800 mb-1">
                    {beneficiary.name}
                  </p>
                ) : (
                  <p className="font-semibold text-gray-800 mb-1">
                    {beneficiary.owner?.firstName} {beneficiary.owner?.lastName}
                  </p>
                )}
                <p className="font-semibold text-gray-800 mb-1">
                  {beneficiary.account?.iban.value}
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>Aucun bénéficiaire trouvé</p>
      )}
    </>
  );
};
