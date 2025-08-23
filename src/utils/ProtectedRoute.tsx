import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext';
import App from '../pages/app';


export default function ProtectedRoute() {
    let { user, token } = useAuthContext();

    if (!user && !token) {
        return <Navigate to={`/`} replace />;
    }
    
    return <App />;
};