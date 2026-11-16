import { Box, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import { useNavigate } from 'react-router-dom';

function Sidebar() {

    const navigate = useNavigate();

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center"
        }}>
            <Box >
                <Tooltip title="Dashboard">
                    <DashboardIcon onClick={() =>{navigate("/")}} sx={{ color: "white", cursor: "pointer", height: "100px" }} />
                </Tooltip>
            </Box>
            <Box>
                <Tooltip title="Add user">
                    <PersonAddIcon onClick={() =>{navigate("/add_user")}} sx={{ color: "white", cursor: "pointer", height: "100px" }} />
                </Tooltip>
            </Box>
            <Box>
                <Tooltip title="Components master">
                    <SettingsInputComponentIcon onClick={() =>{navigate("/component_master")}} sx={{ color: "white", cursor: "pointer", height: "100px" }} />
                </Tooltip>
            </Box>
        </Box>
    )
}

export default Sidebar

