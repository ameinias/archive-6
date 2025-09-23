import { useContext } from "react";
import AuthContext from "../main/context/AuthProvider";
const useAuth = () => useContext(AuthContext);

export default useAuth;
