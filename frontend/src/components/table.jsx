import React from "react";
import {
    useReactTable,
    makeStateUpdater,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getCoreRowModel,
    flexRender,
    functionalUpdate,
} from "@tanstack/react-table";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export const DensityFeature = {
    // define the new feature's initial state
    getInitialState: (state) => {
        return {
            density: "md",
            ...state,
        };
    },

    // define the new feature's default options
    getDefaultOptions(table) {
        return {
            enableDensity: true,
            onDensityChange: makeStateUpdater("density", table),
        };
    },
    createTable(table) {
        table.setDensity = (updater) => {
            const safeUpdater = (old) => {
                let newState = functionalUpdate(updater, old);
                return newState;
            };
            return table.options.onDensityChange?.(safeUpdater);
        };
    },
};

function Table({
    children,
    tableData,
    columns,
    bottomView = true,
    emptyMessage = "No data to display",
}) {
    const [data, setData] = React.useState(tableData);
    const [density, setDensity] = React.useState("md");

    React.useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const table = useReactTable({
        _features: [DensityFeature], //pass our custom feature to the table to be instantiated upon creation
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: bottomView ? getPaginationRowModel() : undefined,
        state: {
            density, //passing the density state to the table, TS is still happy :)
        },
        onDensityChange: setDensity, //using the new onDensityChange option, TS is still happy :)
    });

    return (
        <div className="p-4 w-full rounded-lg overflow-x-auto">
            {children}
            <table className="w-full border border-gray-200 rounded-lg text-sm">
                <thead className="bg-blue-600 text-white text-left">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className="px-4 py-3 font-semibold border-b border-blue-500"
                                >
                                    <div
                                        className={`flex items-center justify-between gap-2 cursor-pointer select-none`}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: <FaArrowUp className="text-xs" />,
                                            desc: <FaArrowDown className="text-xs" />,
                                        }[header.column.getIsSorted()] ?? null}
                                    </div>
                                    {header.column.getCanFilter() && (
                                        <div className="mt-2">
                                            <Filter column={header.column} />
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row, index) => (
                            <tr
                                key={row.id}
                                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } border-b border-gray-200 hover:bg-blue-50 transition`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        style={{
                                            padding:
                                                density === "sm"
                                                    ? "6px"
                                                    : density === "md"
                                                        ? "12px"
                                                        : "18px",
                                            transition: "padding 0.2s",
                                        }}
                                        className="text-gray-800"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="py-6 text-center text-gray-400 font-medium"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {bottomView && (
                <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
                        >
                            {">>"}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Page</span>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount().toLocaleString()}
                        </strong>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Go to page:</span>
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>

                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>

    );
}

function Filter({ column }) {
    const columnFilterValue = column.getFilterValue();
    return (
        <input
            type="text"
            value={columnFilterValue ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Search..."
            className="w-full border border-gray-300 px-2 py-1 rounded text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
    );
}

export default Table;