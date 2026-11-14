import { Button, Box, Dialog, DialogActions, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, Autocomplete, DialogContent, Alert } from '@mui/material';
import { useEffect, useState } from 'react'
import type { userTypes } from '../../types/users.types';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import api from '../../api services/api';
import type { severityType } from '../../types/common.types';
import { DataGrid } from '@mui/x-data-grid';

function AddUser() {

    const [showAddUser, setShowAddUser] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [componentData, setComponentData] = useState<userTypes>({
        user_name: "",
        user_role: "",
        status: "",
        email: "",
        password: ""
    });
    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [responseType, setResponseType] = useState<severityType>("success");
    const [rowsData, setRowsData] = useState<Record<string, any>[]>([]);
    const [columnsData, setColumnsData] = useState<Record<string, any>[]>([]);

    //  function to create the user
    const createUser_fn = async () => {
        setLoading(true)
        try {
            const responseData = await api.post("/create_user", componentData)
            if (responseData) {
                setLoading(false);
                setShowResponse(true);
                setResponseMessage(responseData.message || "");
                const type: string = responseData.type.toLowerCase();
                if (["success", "error", "warning", "info"].includes(type)) {
                    setResponseType(type as severityType);
                };
                setTimeout(() => {
                    setShowResponse(false);
                    if (type === "success") {
                        setShowAddUser(false);
                    }
                }, 3000);
            }
        } catch (error: any) {
            setLoading(false)
        };
    };

    const cancel_fn = () => {
        setComponentData({
            user_name: "",
            user_role: "",
            status: "",
            email: "",
            password: ""
        });
        setShowAddUser(false);
    };

    //  for getting all the users data
    useEffect(() => {
        const fetc_users_data = async () => {
            try {
                const responseData = await api.get("/get_users_data");
                if (responseData) {
                    const allRowsData = responseData.componentData.data.map(({ _id, ...row }: Record<string, any>) => ({
                        ...row,
                        id: _id
                    }));
                    setRowsData(allRowsData);
                    const allData: string[] = Object.keys(responseData.componentData.data[0])
                    const ColumnsData = allData.map((item: any) => ({
                        field: item,
                        width: 200,
                        headerName: item.replace("_", " ").toLowerCase().replace(/(?:^|\s)\S/g, (char: string) => char.toUpperCase()),
                        align: "center",
                        headerAlign: "center"
                    }));
                    setColumnsData(ColumnsData);
                }
            } catch (error: any) {
                throw error.message;
            }
        }
        fetc_users_data();
        return () => { };
    }, []);

    console.log("rowsData", rowsData, columnsData)

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Typography >Add user</Typography>
                <Button id="btn" variant="contained" onClick={() => { setShowAddUser(true) }} startIcon={<PersonAddAltIcon />}>Add user</Button>
            </Box>

            <Box>
                <DataGrid
                    showToolbar
                    columns={columnsData}
                    rows={rowsData}
                    columnVisibilityModel={{
                        _id: false,
                        __v : false
                    }}
                />
            </Box>

            <Dialog
                open={showAddUser}
                onClose={() => { setShowAddUser(false) }}
            >
                <DialogTitle>Add user</DialogTitle>
                <DialogContent>
                    {
                        showResponse &&
                        <Alert severity={responseType} sx={{ mb: 2 }}>
                            {responseMessage}
                        </Alert>
                    }
                    <TextField
                        label="Name"
                        type="text"
                        required
                        value={componentData.user_name}
                        onChange={(event) => {
                            setComponentData({ ...componentData, user_name: event.target.value })
                        }}
                    />

                    <TextField
                        label="Email"
                        type="email"
                        required
                        value={componentData.email}
                        onChange={(event) => {
                            setComponentData({ ...componentData, email: event.target.value })
                        }}
                    />

                    <Autocomplete
                        disablePortal
                        options={[...new Set([])]}
                        sx={{ mt: 2 }}
                        value={componentData.user_role}
                        onInputChange={(_: any, newValue: string) => {
                            setComponentData({ ...componentData, user_role: newValue || "" });
                        }}
                        renderInput={(params: any) =>
                            <TextField
                                {...params}
                                label="Role"
                                fullWidth
                            />}
                    />

                    <TextField
                        label="password"
                        type="password"
                        required
                        value={componentData.password}
                        onChange={(event) => {
                            setComponentData({ ...componentData, password: event.target.value })
                        }}
                    />

                    <FormControl>
                        <FormLabel >Status</FormLabel>
                        <RadioGroup
                            defaultValue="active"
                            name="radio-buttons-group"
                            value={componentData.status}
                            onChange={event => setComponentData({ ...componentData, status: event.target.value })}
                        >
                            <FormControlLabel value="active" control={<Radio />} label="Active" />
                            <FormControlLabel value="Inactive" control={<Radio />} label="inactive" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button id="btn" variant="contained" onClick={cancel_fn}>Cancel</Button>
                    <Button id="btn" loading={loading} variant="contained" onClick={createUser_fn}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}

export default AddUser