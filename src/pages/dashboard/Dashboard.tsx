import { Container, Box, Dialog, DialogContentText, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react'
import ColumnBar from '../../charts/ColumnBar';
import api from '../../api services/api';
import Sidebar from '../../componnets/Sidebar';

function Dashboard() {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const [componentCounts, setComponentCounts] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [useRoleCounts, setUserRoleCounts] = useState<Record<string, unknown>[]>([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responseData = await api.get("/dashboard_details");
                if (responseData) {
                    setComponentCounts(responseData.componentData.components_data.components_counts || []);
                    setUserRoleCounts(responseData.componentData.users_data.user_roles_count_data || [])
                    setTimeout(() => {
                        setLoading(false)
                    }, 3000);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
                setTimeout(() => {
                    setLoading(false);
                    setShowErrors(true);
                }, 3000);
            }
        }
        fetchData()
        return () => { };
    }, []);

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
                flex: 1
            }}>
                {loading ? <CircularProgress /> :
                    <>
                        <ColumnBar data={componentCounts} title="Components count" />
                        <ColumnBar data={useRoleCounts} title="User roles" />
                    </>
                }
            </Box>

            {/*  for showing the errors if any api failed or anything */}
            <Dialog
                open={showErrors}
                onClose={() => { setShowErrors(false) }}
            >
                <DialogContentText>
                    {errorMessage}
                </DialogContentText>
            </Dialog>
        </Box>
    )
}

export default Dashboard