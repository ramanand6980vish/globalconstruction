import Dashboard from "./Dashboard";
import NavbarAdmin from "./NavbarAdmin";
import '../cssFiles/admin.css';

export default function Admin(){
    return(
        <>
        
        <div id="admin_dashboard">
            <NavbarAdmin />
            <Dashboard />
        </div>
        
        </>
    )
}