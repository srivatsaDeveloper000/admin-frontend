import { Container, Box, Dialog, DialogContentText, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react'
import ColumnBar from '../../charts/ColumnBar';
import api from '../../api services/api';

function Dashboard() {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const [componentCounts, setComponentCounts] = useState<Record<string, any>[]>([]);
    const [userRoleCounts , setUserRoleCounts] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responseData = await api.get("/dashboard_details");
                if (responseData) {
                    setComponentCounts(responseData.componentData.components_data.components_counts || []);
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
        <Container>
            <Box>
                {loading ? <CircularProgress /> : <ColumnBar data={componentCounts} title="Component count" />}
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
        </Container>
    )
}

export default Dashboard