// app/data/table.ts
export interface Table {
    id_table: string;
}

export const table: Table[] = [
    { id_table: "table1" },
    { id_table: "table2" },
    { id_table: "table3" },
    { id_table: "table4" },
    { id_table: "table5" },
    { id_table: "table6" },
    { id_table: "table7" },
    { id_table: "table8" },
];

export const mainFeaturedTable = table[0];
