/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react'


import MaUTable from '@material-ui/core/Table'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TablePaginationActions from './TablePaginationActions'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableToolbar from './TableToolbar'
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'



const inputStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',
}

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input
      onBlur={onBlur}
      onChange={onChange}
      style={inputStyle}
      value={value}
    />
  )
}
const EnhancedTable = ({
  columns,
  data,
  pagination,
}) => {
  const [columnsDisplayed, setColumnsDisplayed] = useState(columns.filter(column => column.initial).map(column => column.accessor))
  const [tableColumns, setTableColumns] = useState(columns.filter(column => column.initial || column.toggle === false))

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns: tableColumns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  )


  const toggleColumn = (accessor) => {
    const newColumnsDisplayed = columns
      .filter(column => {
        const currentlyDisplayed = columnsDisplayed.indexOf(column.accessor) !== -1

        if (
          (currentlyDisplayed && column.accessor !== accessor) ||
          (!currentlyDisplayed && column.accessor === accessor)
        ) {
          return true
        }

        return false
      })
      .map(column => column.accessor)

    setColumnsDisplayed(newColumnsDisplayed)
    setTableColumns(columns.filter(column => {
      return (newColumnsDisplayed.indexOf(column.accessor) !== -1
        || column.toggle === false)
    }))
  }

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setPageSize(Number(event.target.value))
  }

  // Render the UI for your table
  return (
    <TableContainer>
      <TableToolbar
        columns={columns}
        columnsDisplayed={columnsDisplayed}
        globalFilter={globalFilter}
        numSelected={Object.keys(selectedRowIds).length}
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        toggleColumn={toggleColumn}
      />
      <MaUTable stickyHeader {...getTableProps()} >
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell
                  {...(column.id === 'selection'
                    ? column.getHeaderProps()
                    : column.getHeaderProps(column.getSortByToggleProps()))}
                >
                  {column.render('Header')}
                  {column.id !== 'selection' ? (
                    <TableSortLabel
                      active={column.isSorted}
                      // react-table has a unsorted state which is not treated here
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
        {pagination &&
          (<TableFooter>
            <TableRow>
              <TablePagination
                ActionsComponent={TablePaginationActions}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                colSpan={3}
                count={data.length}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                page={pageIndex}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: 'All', value: data.length },
                ]}
              />
            </TableRow>
          </TableFooter>)
        }

      </MaUTable>
    </TableContainer>
  )
}

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.bool
}

export default EnhancedTable
