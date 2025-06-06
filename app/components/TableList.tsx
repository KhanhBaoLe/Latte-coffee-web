import { useState } from "react";
import { table as initialTable } from "../data/id_table";

export default function TableList() {
  const [tables, setTables] = useState(initialTable);

  const handleReserve = (id_table: string) => {
    setTables(tables =>
      tables.map(t =>
        t.id_table === id_table && t.status === "available"
          ? { ...t, status: "reserved" }
          : t
      )
    );
  };

  return (
    <div>
      <h2>Table List</h2>
      {tables.map(t => (
        <div key={t.id_table} style={{ marginBottom: 8 }}>
          <span>{t.id_table} - {t.status}</span>
          {t.status === "available" && (
            <button style={{ marginLeft: 8 }} onClick={() => handleReserve(t.id_table)}>
              Reserve
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 