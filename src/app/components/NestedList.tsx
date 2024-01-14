import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Checkbox } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';

export default function NestedList() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: '100%', height: 'fit-content', border: '1px solid yellow', borderRadius: '1rem' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Completed tasks" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {TASKS.map(task => (
            <ListItemButton sx={{ pl: 4 }} key={task}>
              <Checkbox edge="start" checked={true} tabIndex={-1} disableRipple />
              <ListItemText primary={task} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
}

const TASKS = [
  'Connect to metamask',
  'Check is current ChainId is necessary chainId, if no - change network',
  'Chow current Chain Id and address',
  'Show symbol, decimals, balance of network and tokens',
  'Send all tokens',
  'update balance after transaction',
  //   send transaction using seed phrase
];
