import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';

import { useSession } from "@/lib/session";

const sx = {
  toolbarText: {flexGrow: 1},
  logoutBtn: {color: '#fff'},
}

export default function AppBar() {
  const [session, setSession] = useSession();
  const logoutHandler = () => {
    setSession(null);
  };
  return (
    <div>
      <MuiAppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={sx.toolbarText}>
            Fintoda Bitahon
          </Typography>
          {session ? (
            <Box>
              <Button onClick={logoutHandler} sx={sx.logoutBtn}>
                Log Out
              </Button>
            </Box>
          ) : null}
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </div>
  );
}
