import { Box, Typography } from '@mui/material';
import Sidebar from '../../componnets/Sidebar';
import { DataGrid } from '@mui/x-data-grid';

function LogMaster() {
    return (
        <Box sx={{
            display: "flex"
        }}>
            <Box sx={{
                width: "3%",
                backgroundColor: "green",
                height: "100vh"
            }}>
                <Sidebar />
            </Box>
            <Box sx={{
                flex: 1,
                height: "100vh",
                padding: "20px",
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: "bold"
                }}>Log master</Typography>

                <Box sx={{ mt: 2 }}>
                    <DataGrid
                        showToolbar
                        rows={[]}
                        columns={[]}
                        sx={{
                            minHeight: 500,
                            maxHeight: "100%"
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default LogMaster