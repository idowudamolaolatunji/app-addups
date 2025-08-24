import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/auth/login"
import Signup from "./pages/auth/signup"
// import ForgotPassword from "./pages/auth/forgot-password"
import Home from "./pages/main"
import MainApp from "./pages/app"


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* UNPROTECTED ROUTES */}
                {/* <Route path='/forgot' element={<ForgotPassword />}></Route> */}
                <Route path='/login' element={<Login />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
                <Route path="/" element={<Home />} />

                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/home' element={<MainApp />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
