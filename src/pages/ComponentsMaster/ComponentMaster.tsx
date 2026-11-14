import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography, Alert, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import api from '../../api services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import type { component_master_type, rowsData, severityType, responseDataType } from '../../types/component_master_types';

function ComponentMaster() {

    const [columns, setColumns] = React.useState<rowsData[]>([]);
    const [rows, setRows] = React.useState<Record<string, any>[]>([]);
    const [showAddComponent, setShowAddComponents] = React.useState<boolean>(false);
    const [parentComponents, setParentComponents] = React.useState<string[]>([]);
    const [userRoles, setUserRoles] = useState<string[]>(["Developer", "Admin"]);
    const [createdBy, setCreatedBy] = useState<string[]>([])
    const [loading, setLoading] = React.useState<boolean>(false);
    const [componentData, setComponentData] = React.useState<component_master_type>({
        component_name: "",
        created_by: "",
        parent_component: "",
        user_role: ""
    });
    const [editingId, setEditingId] = React.useState<string | null>(null);

    //  for showing the success and fialure of creating the component
    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [responseType, setResponseType] = useState<severityType>("success");
    const [responseMessage, setResponseMessage] = useState<string>("");

    const handleEdit = (row: Record<string, any>) => {
        setEditingId(row.id);
        setComponentData({
            component_name: row.component_name ?? "",
            created_by: row.created_by ?? "",
            parent_component: row.parent_component ?? "",
            user_role: ""
        });
        setShowAddComponents(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const responseData: responseDataType = await api.delete(`/delete_component/${id}`);
            setRows((currentRows) => currentRows.filter((row) => row.id !== id));
            setResponseMessage(responseData.message);
            setResponseType(responseData.type);
            setShowResponse(true);
        } catch (error: any) {
            setResponseMessage(error.message);
            setResponseType("error");
            setShowResponse(true);
        }
    };

    const columnsActions = [
        {
            field: "actions",
            headerName: "Actions",
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <>
                    <IconButton aria-label="Edit component" onClick={() => handleEdit(params.row)} size="small">
                        <EditSquareIcon />
                    </IconButton>
                    <IconButton aria-label="Delete component" onClick={() => handleDelete(params.row.id)} size="small">
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];

    //  for opening the add component dialog
    const handleAddComponent = () => {
        setShowAddComponents(true);
    }

    // for getting the components data
    React.useEffect(() => {
        const fetchComponentsData = async () => {
            try {
                const responseData: responseDataType = await api.get("/component_master_data");
                const data = responseData.componentData.data;
                const ColumnsData = Object.keys(data[0]).map((item: string) => ({
                    headerName: item,
                    width: 200,
                    field: item === "_id" ? item.replace("_id", "id") : item
                }));
                setParentComponents(data.map((item: any) => item.parent_component));
                setCreatedBy(data.map((item: any) => item.created_by));
                // setUserRoles(data.map((item: any) => item.user_roles));
                setColumns([...ColumnsData])
                setRows(data.map(({ _id, ...row }: Record<string, any>) => ({
                    ...row,
                    id: _id
                })));
            } catch (error: any) {
                console.log(error.message);
            }
        }
        fetchComponentsData();

        return () => { };
    }, []);

    //  function to createa component
    const createComponentFunction = async (): Promise<void> => {
        try {
            setLoading(true)
            const responseData: responseDataType = await api.post("/create_component", componentData);
            setLoading(false);
            setShowResponse(true);
            setResponseMessage(responseData.message);
            const type = responseData.type.toLowerCase();
            if (["success", "error", "warning", "info"].includes(type)) {
                setResponseType(type as severityType);
            };
            setTimeout(() => {
                setShowResponse(false)
                setResponseMessage("");
                setResponseType("success");
            }, 3000);
            if (responseData.type === "success") {
                setShowAddComponents(false);
                setEditingId(null);
            }
        } catch (error: any) {
            console.log("error : ", error.message)
        }
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
                    }} onClick={handleAddComponent}>Add component</Button>
                </Box>

                <Box sx={{
                    mt: 2
                }}>
                    <DataGrid
                        showToolbar
                        rows={rows}
                        columns={[...columns, ...columnsActions]}
                    />
                </Box>
            </Box>

            <Dialog
                open={showAddComponent}
                onClose={() => setShowAddComponents(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{editingId ? "Edit component" : "Add component"}</DialogTitle>
                <DialogContent>
                    {showResponse && <Alert severity={responseType}>
                        {responseMessage}
                    </Alert>}
                    <TextField
                        label="Component name"
                        fullWidth
                        value={componentData.component_name}
                        onChange={(event) => { setComponentData({ ...componentData, component_name: event.target.value }) }}
                    />

                    <Autocomplete
                        disablePortal
                        options={[...new Set(parentComponents)]}
                        sx={{ mt: 2 }}
                        value={componentData.parent_component}
                        onInputChange={(_: any, newValue: string) => {
                            console.log("newValue", newValue)
                            setComponentData({ ...componentData, parent_component: newValue || "" });
                        }}
                        renderInput={(params: any) =>
                            <TextField
                                {...params}
                                label="Parent component"
                                fullWidth
                            />}
                    />

                    <Autocomplete
                        disablePortal
                        options={[...new Set(createdBy)]}
                        sx={{ mt: 2 }}
                        value={componentData.created_by}
                        onInputChange={(_: any, newValue: string) => {
                            setComponentData({ ...componentData, created_by: newValue || "" });
                        }}
                        renderInput={(params: any) => <TextField {...params} label="Created by" fullWidth />}
                    />

                    <Autocomplete
                        disablePortal
                        options={[...new Set(userRoles)]}
                        sx={{ mt: 2 }}
                        value={componentData.user_role}
                        onInputChange={(_: any, newValue: string) => {
                            setComponentData({ ...componentData, user_role: newValue || "" });
                        }}
                        renderInput={(params: any) => <TextField {...params} label="User role" fullWidth />}
                    />
                </DialogContent>
                <DialogActions >
                    <Button variant="contained" sx={{
                        textTransform: "capitalize"
                    }} onClick={() => { setShowAddComponents(false); setEditingId(null); }}>Cancel</Button>
                    <Button loading={loading} variant="contained" sx={{
                        textTransform: "capitalize"
                    }} onClick={createComponentFunction}>{editingId ? "Save" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ComponentMaster
