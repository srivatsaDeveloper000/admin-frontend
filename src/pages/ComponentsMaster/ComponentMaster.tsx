import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography, IconButton, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import api from '../../api services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import type { component_master_type, rowsData, severityType, responseDataType } from '../../types/component_master_types';
import Sidebar from '../../componnets/Sidebar';

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
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [deleteComponentName, setShowDeleteComponentName] = useState<string>("");
    const [deleteComponentId, setDeleteComponentId] = useState<string>("");

    //  for showing the success and fialure of creating the component
    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [responseType, setResponseType] = useState<severityType>("success");
    const [responseMessage, setResponseMessage] = useState<string>("");

    const handleDelete = async () => {
        try {
            setLoading(true);
            const responseData: responseDataType = await api.delete(`/delete_component/${deleteComponentId}`);
            if (responseData) {
                setLoading(false);
                setResponseMessage(responseData.message);
                const type = responseData.type.toLowerCase();
                if (["success", "error", "warning", "info"].includes(type)) {
                    setResponseType(type as severityType);
                };
                setShowResponse(true);
                setTimeout(() => {
                    setShowResponse(false);
                    if (responseData.type !== "error") {
                        setShowDelete(false);
                        fetch_componentData();
                    }
                }, 3000);
            };
        } catch (error: any) {
            setLoading(false);
            setResponseMessage(error.message);
            setResponseType("error");
            setShowResponse(true);
        };
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
                    <IconButton aria-label="Delete component" onClick={() => {
                        setDeleteComponentId(params.row.id); setShowDeleteComponentName(params.row.component_name); setShowDelete(true)
                    }} size="small">
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];

    //  for opening the add component dialog
    const handleAddComponent = () => {
        setShowAddComponents(true);
    };

    // for getting the components data  
    const fetch_componentData = async () => {
        try {
            const responseData: responseDataType = await api.get("/component_master_data");
            const data = responseData.componentData.data;
            map_columns_rows(data);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    //  for mapping the rows and columns 
    const map_columns_rows = (data: {}[]) => {
        const ColumnsData = Object.keys(data[0]).map((item: string) => ({
            headerName: item,
            width: 200,
            field: item === "_id" ? item.replace("_id", "id") : item
        }));
        setParentComponents(data.map((item: any) => item.parent_component));
        setCreatedBy(data.map((item: any) => item.created_by));
        setColumns([...ColumnsData])
        setRows(data.map(({ _id, ...row }: Record<string, any>) => ({
            ...row,
            id: _id
        })));
    };

    React.useEffect(() => {
        fetch_componentData();
    }, [])

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
            }
        } catch (error: any) {
            console.log("error : ", error.message)
        }
    }

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
                <DialogTitle>Add component</DialogTitle>
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
                    }} onClick={() => { setShowAddComponents(false); }}>Cancel</Button>
                    <Button loading={loading} variant="contained" sx={{
                        textTransform: "capitalize"
                    }} onClick={createComponentFunction}>Add</Button>
                </DialogActions>
            </Dialog>

            {/*  dialog for deleteing the component */}
            <Dialog
                open={showDelete}
                onClose={() => { setShowDelete(false) }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Delete component?
                </DialogTitle>
                <DialogContent>
                    {showResponse && <Alert severity={responseType} sx={{ mb: 2 }}>
                        {responseMessage}
                    </Alert>}
                    Do you want to delete component {deleteComponentName}
                </DialogContent>
                <DialogActions>
                    <Button id="btn" variant="contained" onClick={() => { setShowDelete(false) }} sx={{
                        textTransform: "capitalize"
                    }}>Cancel </Button>
                    <Button id="btn" variant="contained" loading={loading} onClick={() => { handleDelete() }} sx={{
                        textTransform: "capitalize"
                    }}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ComponentMaster
