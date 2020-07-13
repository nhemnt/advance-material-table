import React from 'react';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const Checkboxes = ({ columns = [], columnsDisplayed, toggleColumn }) => {
  return (
    <Grid
      container
      spacing={3}
    >
      {columns.map(({ Header, accessor, toggle = true }, i) => (
        toggle ?
          <Grid
            item
            key={`${accessor}`}
            xs={4}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={columnsDisplayed.indexOf(accessor) !== -1}
                  color="primary" 
                  onChange={() => toggleColumn(accessor)}
                />
              }
              label={Header}
            />
          </Grid>
          : ''
      ))}

    </Grid>
  )
}

export default function Filter({ columns, columnsDisplayed, toggleColumn  }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const isDisplayableColumn = col => {
    const tableColumns = columns ? columns : [];
    if (tableColumns.length > 0) {
      const column = tableColumns.find(x => x.handle === col);
      if (column && typeof column.toggle === "boolean" && !column.toggle) {
        return false;
      }
    }
    return true;
  }
  const numberSelected = columnsDisplayed
    .filter(x =>  isDisplayableColumn(x))
    .length

  return (
    <div>
      <Button
        aria-describedby={id}
        color="primary"
        onClick={handleClick}
        variant="contained"
      >
        {numberSelected} Filter
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper>
          <h5 className="mb-3">Select the fields to be filtered</h5>
          <Checkboxes
            columns={columns}
            columnsDisplayed={columnsDisplayed}
            toggleColumn={toggleColumn} 
          />
        </Paper>
      </Popover>
    </div>
  );
}
