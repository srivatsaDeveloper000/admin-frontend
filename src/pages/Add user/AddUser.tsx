import { Button, Box, Dialog, DialogActions, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, Autocomplete, DialogContent, Alert, Grid, InputAdornment, IconButton } from '@mui/material';
import { useEffect, useState } from 'react'
import type { userTypes } from '../../types/users.types';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import api from '../../api services/api';
import type { severityType } from '../../types/common.types';
import { DataGrid } from '@mui/x-data-grid';
import Sidebar from '../../componnets/Sidebar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';

function AddUser() {

    const [showAddUser, setShowAddUser] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [componentData, setComponentData] = useState<userTypes>({
        user_name: "",
        user_role: "",
        status: "",
        email: "",
        password: "",
        contact_number: ""
    });
    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [responseType, setResponseType] = useState<severityType>("success");
    const [rowsData, setRowsData] = useState<Record<string, any>[]>([]);
    const [columnsData, setColumnsData] = useState<Record<string, any>[]>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordType, setPasswordType] = useState<string>("password");

    const columnsActions ={
        field: "actions",
        headerName: "Actions",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
            <>
                <IconButton aria-label="Edit" size="small">
                    <EditSquareIcon />
                </IconButton>
                <IconButton aria-label="Delete" size="small">
                    <DeleteIcon />
                </IconButton>
            </>
        )
    }

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
                        fetch_users_data();
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
            password: "",
            contact_number: ""
        });
        setShowAddUser(false);
    };

    //  for getting all the users data
    const fetch_users_data = async () => {
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
                    headerAlign: "center",
                    renderCell: (params: any) => (
                        <span
                            style={{
                                textDecoration: item === "email" ? "underline" : "none",
                                color:
                                    item === "status"
                                        ? params.value === "active"
                                            ? "green"
                                            : "red"
                                        : "inherit",
                                fontWeight: item === "status" ? 600 : 400

                            }}
                        >
                            {item === "password" ? "•".repeat(params.value?.length || 8) : params.value}
                        </span>
                    )
                }));
                setColumnsData([...ColumnsData, columnsActions]);
            }
        } catch (error: any) {
            throw error.message;
        }
    };

    useEffect(() => {
        fetch_users_data();
        return () => { };
    }, []);

    //  fior changing the password field type
    const handle_password_type = (value: boolean, type: string) => {
        setShowPassword(value)
        setPasswordType(type)
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
            }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5">Add user</Typography>
                    <Button id="btn" variant="contained" onClick={() => { setShowAddUser(true) }} startIcon={<PersonAddAltIcon />}>Add user</Button>
                </Box>

                <Box>
                    <DataGrid
                        showToolbar
                        columns={columnsData}
                        rows={rowsData}
                        columnVisibilityModel={{
                            _id: false,
                            __v: false
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
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    required
                                    value={componentData.user_name}
                                    onChange={(event) => {
                                        setComponentData({ ...componentData, user_name: event.target.value })
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    required
                                    value={componentData.email}
                                    onChange={(event) => {
                                        setComponentData({ ...componentData, email: event.target.value })
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Contact number"
                                    required
                                    value={componentData.contact_number}
                                    onChange={(event) => {
                                        setComponentData({ ...componentData, contact_number: event.target.value })
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    options={[...new Set([])]}
                                    value={componentData.user_role}
                                    onInputChange={(_: any, newValue: string) => {
                                        setComponentData({ ...componentData, user_role: newValue || "" });
                                    }}
                                    renderInput={(params: any) => (
                                        <TextField {...params} label="Role" />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={passwordType}
                                    required
                                    value={componentData.password}
                                    onChange={(event) => {
                                        setComponentData({ ...componentData, password: event.target.value })
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">{
                                                showPassword ? <VisibilityOffIcon sx={{ cursor: "pointer" }} onClick={() => { handle_password_type(false, "password") }} /> : <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => { handle_password_type(true, "text") }} />
                                            }</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <FormControl>
                            <FormLabel >Status</FormLabel>
                            <RadioGroup
                                defaultValue="active"
                                name="radio-buttons-group"
                                value={componentData.status}
                                onChange={event => setComponentData({ ...componentData, status: event.target.value })}
                                row
                            >
                                <FormControlLabel value="active" control={<Radio />} label="Active" />
                                <FormControlLabel value="Inactive" control={<Radio />} label="inactive" />
                            </RadioGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button id="btn" variant="contained" onClick={cancel_fn} sx={{ textTransform: "capitalize" }}>Cancel</Button>
                        <Button id="btn" loading={loading} variant="contained" onClick={createUser_fn} sx={{ textTransform: "capitalize" }}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Box >
        </Box>
    )
}

export default AddUser