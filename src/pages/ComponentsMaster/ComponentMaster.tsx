import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import api from '../../api services/api';

type rowsData = {
    headerName: string,
    width: number,
    fieldName: string
}

type responseDataType = {
    type: string,
    message: string,
    componentData: {
        data: Record<string, any>[],
    }
}

function ComponentMaster() {

    const [columns, setColumns] = React.useState<rowsData[]>([]);
    const [rows, setRows] = React.useState<Record<string, any>[]>([]);
            const responseData: responseDataType = await api.get("/components_data");
            const ColumnsData = responseData?.componentData.data[0].map((item: any) => ({
                headerName: item.headerName,
                width: item.width,
                fieldName: item.fieldName
            })) || []
            setColumns(ColumnsData)
            setRows(responseData?.componentData.data || []);
        }
        fetchComponentsData();
    }, [])

    //  function to createa component
    const createComponentFunction = async () => {
        setLoading(!loading)
        const responseData: responseDataType = await api.post("/create_component")
        setLoading(!loading)
    }

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
                    }}
                        onClick={handleAddComponent}
                    >Add component</Button>
                </Box>

                <Box sx={{
                    mt: 2
                }}>
                    <DataGrid
                        showToolbar
                        rows={rows}
                        columns={columns}
                    />
                </Box>
            </Box>

            <Dialog
                open={showAddComponent}
                onClose={() => setSetShowComponents(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add component</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Component name"
                        fullWidth
                        value={componentData.componentName}
                        onChange={(event) => { setComponentData({ ...componentData, componentName: event.target.value }) }}
                    />

                    <Autocomplete
                        disablePortal
                        options={parentComponents}
                        sx={{ mt: 2 }}
                        value={componentData.parent_component}
                        onChange={(event: any, newValue: string | null) => {
                            setComponentData({ ...componentData, parent_component: newValue || "" });
                        }}
                        renderInput={(params: any) => <TextField {...params} label="Parent component" fullWidth />}
                    />

                    <Autocomplete
                        disablePortal
                        options={[]}
                        sx={{ mt: 2 }}
                        value={componentData.created_by}
                        onChange={(event: any, newValue: string | null) => {
                            setComponentData({ ...componentData, created_by: newValue || "" });
                        }}
                        renderInput={(params: any) => <TextField {...params} label="Created by" fullWidth />}
                    />
                </DialogContent>
                <DialogActions >
                    <Button variant="contained" sx={{
                        textTransform: "capitalize"
                    }}>Cancel</Button>
                    <Button loading={loading} variant="contained" sx={{
                        textTransform: "capitalize"
                    }} onClick={createComponentFunction}>Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ComponentMaster
