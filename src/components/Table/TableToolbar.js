import React from 'react'

import classNames from 'classnames'
import GlobalFilter from './GlobalFilter'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Filter from "./Filter"

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
}))

const TableToolbar = props => {
  const classes = useToolbarStyles()
  const {
    columns,
    columnsDisplayed,
    preGlobalFilteredRows,
    setGlobalFilter,
    toggleColumn,
    globalFilter,
  } = props
  return (
    <Toolbar
      className={
        classNames(`${classes.root}`, 
        )

      }
    >
      <Filter
        columns={columns}
        columnsDisplayed={columnsDisplayed}
        toggleColumn={toggleColumn}
      />
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </Toolbar>
  )
}

TableToolbar.propTypes = {
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
}

export default TableToolbar
