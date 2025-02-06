"use client";

import { filterAtom } from "@/store";
import { SalesBadge } from "./SalesBadge";
import { Card } from "./ui/card";
import { useAtom, useAtomValue } from "jotai";

export default function SalesChanceCard({ cardTitle, equipments, badgeType }) {
  const [filter, setFilter] = useAtom(filterAtom);

  const filteredByArea = equipments?.filter(({ country }) =>
    filter.area === "Nacional" ? country === "Brazil" || country === undefined : country !== "Brazil" && country !== undefined
  );

  const filteredBySupervisor = filter.supervisor !== "Todos"
    ? filteredByArea.filter(({ supervisor }) => supervisor === filter.supervisor)
    : filteredByArea;

  const totalValue = filteredBySupervisor?.reduce((acc, { saleChance, value }) => {
    if (saleChance === cardTitle) {
      acc += value;
    }
    return acc;
  }, 0) || 0;

  const handleToggleFilter = async () => {
    if (filter.range === cardTitle) {
      return setFilter((prev) => ({ ...prev, range: '' }));
    }

    setFilter((prev) => ({ ...prev, range: cardTitle }));
  }

  return (
    <Card onClick={handleToggleFilter} className={`${filter.range === cardTitle && "border-gray-800 border-2 shadow-inner transform-gpu"} flex flex-col gap-2 w-[320px] p-2 hover:shadow-xl cursor-pointer`}>
      <div>
        <SalesBadge variant={badgeType}>
          <h6>{cardTitle}</h6>
        </SalesBadge>
      </div>
      <div>
        <span className="text-2xl font-semibold">{`R$ ${totalValue.toLocaleString('pt-BR')}`}</span>
      </div>
    </Card>
  )
}
