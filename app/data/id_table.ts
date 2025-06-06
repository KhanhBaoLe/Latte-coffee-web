// app/data/table.ts
export interface Table {
    id_table: string;
    status: string; // 'available' or 'reserved'
}

export const table: Table[] = [
    { id_table: "table1", status: "available" },
    { id_table: "table2", status: "available" },
    { id_table: "table3", status: "available" },
    { id_table: "table4", status: "available" },
    { id_table: "table5", status: "available" },
    { id_table: "table6", status: "available" },
    { id_table: "table7", status: "available" },
    { id_table: "table8", status: "available" },
];

export const mainFeaturedTable = table[0];
