import { Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";

export default function CustomTooltip() {
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);

    return (
        CustomTooltip
    )
}
