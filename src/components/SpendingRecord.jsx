import React from "react";

function SpendingRecord({ record }) {
  return (
    <li>
      {record.date} - {record.category} - ${record.amount.toFixed(2)} {record.note && `- ${record.note}`}
    </li>
  );
}

export default SpendingRecord;
