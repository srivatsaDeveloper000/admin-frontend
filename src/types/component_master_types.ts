export type component_master_type = {
    component_name: string,
    created_by: string,
    parent_component: string,
    user_role: string
}

export type rowsData = {
    headerName: string,
    width: number,
    field: string
}

export type severityType = "success" | "error" | "info" | "warning";

export type responseDataType = {
    type: severityType,
    message: string,
    componentData: {
        data: Record<string, any>[],
    }
}