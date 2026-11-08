import { Box, Button, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'

function ComponentMaster() {
    return (
        <Container >
            <Box sx={{
                flex: 1,
                height: "100vh",
                padding: "20px",
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Typography variant="h5" sx={{
                        fontWeight: "bold"
                    }}>Component master</Typography>
                    <Button id="btn" variant="contained" sx={{
                        textTransform: "capitalize"
                    }}>Add component</Button>
                </Box>

                <Box sx={{
                    mt: 2
                }}>
                    <DataGrid
                        showToolbar
                        rows={[]}
                        columns={[]}
                    />
                </Box>
            </Box>
        </Container>
    )
}

export default ComponentMaster