import type { ReportData, TableCell } from "../../types";

interface TableRendererProps {
  table: ReportData["tables"][0];
}

const TableRenderer = ({ table }: TableRendererProps) => {
  if (
    !table.data ||
    !table.data.table_cells ||
    table.data.table_cells.length === 0
  ) {
    return (
      <div className="p-2 text-center text-gray-500" aria-label="빈 테이블">
        테이블 데이터 없음
      </div>
    );
  }

  const { num_rows, num_cols } = table.data;

  const cellsMatrix: (TableCell | null)[][] = Array(num_rows)
    .fill(null)
    .map(() => Array(num_cols).fill(null));

  table.data.table_cells.forEach((cell: TableCell) => {
    if (!cell.text) return;

    const rowStart = cell.start_row_offset_idx || 0;
    const rowEnd = cell.end_row_offset_idx || rowStart + 1;
    const colStart = cell.start_col_offset_idx || 0;
    const colEnd = cell.end_col_offset_idx || colStart + 1;

    cellsMatrix[rowStart][colStart] = cell;

    for (let r = rowStart; r < rowEnd; r++) {
      for (let c = colStart; c < colEnd; c++) {
        if (r === rowStart && c === colStart) continue;
        if (r < cellsMatrix.length && c < cellsMatrix[0].length) {
          cellsMatrix[r][c] = null;
        }
      }
    }
  });

  // 테이블에 캡션이 있는지 확인
  const hasCaption = table.captions && table.captions.length > 0;

  return (
    <div className="my-4 border border-gray-300 rounded overflow-x-auto">
      <table className="w-full border-collapse">
        {hasCaption && (
          <caption className="p-2 text-sm text-center font-medium">
            {JSON.stringify(table.captions)}
          </caption>
        )}
        <tbody>
          {cellsMatrix.map((row, rowIndex) => (
            <tr key={`table-${table.self_ref}-row-${rowIndex}`}>
              {row.map((cell, colIndex) => {
                if (cell === null) return null;

                if (cell) {
                  const rowSpan = cell.row_span || 1;
                  const colSpan = cell.col_span || 1;

                  // 헤더 셀인지 확인
                  const isHeaderCell = cell.column_header || cell.row_header;
                  const CellTag = isHeaderCell ? "th" : "td";
                  const scope = isHeaderCell
                    ? cell.column_header
                      ? "col"
                      : "row"
                    : undefined;

                  return (
                    <CellTag
                      key={`table-${table.self_ref}-cell-${rowIndex}-${colIndex}`}
                      className={`border border-gray-300 p-2 text-sm ${
                        isHeaderCell ? "font-bold bg-gray-100" : ""
                      }`}
                      rowSpan={rowSpan}
                      colSpan={colSpan}
                      scope={scope}
                    >
                      {cell.text}
                    </CellTag>
                  );
                }

                return (
                  <td
                    key={`table-${table.self_ref}-cell-${rowIndex}-${colIndex}`}
                    className="border border-gray-300 p-2 text-sm"
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableRenderer;
