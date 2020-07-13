import React, { Fragment } from 'react'

import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'

import CssBaseline from '@material-ui/core/CssBaseline'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import EnhancedTable from './components/Table/EnhancedTable'


const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <Checkbox
          ref={resolvedRef}
          {...rest}
        />
      </>
    )
  }
)

const Tablee = (props) => {

  //use initial true to set columns show deaful in table
  const [columns] = React.useState([
    {
      id: 'selection',
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox.  Pagination is a problem since this will select all
      // rows even though not all rows are on the current page.  The solution should
      // be server side pagination.  For one, the clients should not download all
      // rows in most cases.  The client should only download data for the current page.
      // In that case, getToggleAllRowsSelectedProps works fine.
      Header: ({ getToggleAllRowsSelectedProps, ...rest }) => (
        <div
         onClick = {() => {
            alert(JSON.stringify(rest.data, null, 1))
          }
          }
         >
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => {
        return (
          <div
          onClick = {() => {
            alert(JSON.stringify(row.original, null, 1))
          } 
            }
          >
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        )
      },
      toggle: false
    },
    {
      Header: 'Name',
      accessor: 'name',
      initial: true
    },
    {
      Header: 'Species',
      accessor: 'species',
      initial: true
    },
    {
      Header: 'status',
      accessor: 'status',
      initial: true
    },
    {
      Header: 'Gender',
      accessor: 'gender',
    },
    {
      Header: 'image',
      accessor: 'image',
      initial: true,
      Cell: (cell) => {
        return (
          <Avatar
            src={cell.value}
          />
        )
      },
    },
    {
      Header: 'created',
      accessor: 'created',
    },
  ]);

  return (
    <Query query={POST_QUERY}
    >
      {({ data, loading, error }) => {
        if (loading) {
          return (
            <CircularProgress />
          )
        }

        if (error) {
          return (
            <div className="flex w-100 h-100 items-center justify-center pt7">
              <div>An unexpected error occured.</div>
            </div>
          )
        }
        const { characters: { results = [] } } = data;
        return (
          <Fragment>
            <CssBaseline />
            <EnhancedTable
              columns={columns}
              data={results}
              pagination={false}
            />
          </Fragment>
        )
      }}

    </Query>
  )
}



const POST_QUERY = gql`
query {
  characters(page: 1) {
    info {
      count
    }
    results {
      name
      status
      created
      species
     image
      gender
    }
  }
  character(id: 1) {
    id
  }
}
`

export default Tablee
