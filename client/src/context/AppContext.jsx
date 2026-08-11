import {createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;

const AppContext = createContext();

export const AppContextProvider = ({children}) =>{

    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [chats , setChats] = useState([]);
    const [selectedChat , setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [loadingUser , setLoadingUser] = useState(true);

    //FETCH THE USER ON APP STARTUP USING GET /api/me
    const fetchUser = async () =>{
        try {
           const {data} = await axios.get('/api/me');
           if(data.success){
            setUser(data.data || data.user);
           }
           else{
            setUser(null);
           }
        } catch (error) {
            setUser(null);
        } finally{
            setLoadingUser(false);
        }
    }

    //TO LOG OUT USER AND CLEAR SESSION
    const logout = async () => {
        try {
            await axios.post('/api/user/logout');
            setUser(null);
            setChats([]);
            setSelectedChat(null);
            toast.success('Logged Out Successfully');
        } catch (error) {
            setUser(null);
            setChats([]);
            setSelectedChat(null);
        }
    }

    //TO CREATE A NEW CHAT
    const createNewChat = async() => {
        try {
            if(!user) return toast('Login to create a new chat');
            navigate('/')
            const { data } = await axios.get('/api/chat/create');
            if(data.success){
                const getRes = await axios.get('/api/chat/get');
                if(getRes.data.success && getRes.data.chats.length > 0){
                    setChats(getRes.data.chats);
                    setSelectedChat(getRes.data.chats[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //FETCH THE USER CHAT FROM DB
    const fetchUsersChats = async () => {
        try {
            const {data} = await axios.get('/api/chat/get');
            if(data.success){
                const chatList = data.chats || [];
                setChats(chatList);
                if(chatList.length > 0){
                    setSelectedChat(prev => (prev && chatList.some(c => c._id === prev._id)) ? prev : chatList[0]);
                } else {
                    setSelectedChat(null);
                }
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect (() => {
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme' , theme)
    },[theme])

    useEffect (() => {
        if(user){
            const initUserChats = async () => {
                try {
                    const {data} = await axios.get('/api/chat/get');
                    if(data.success){
                        const chatList = data.chats || [];
                        if(chatList.length === 0){
                            await createNewChat();
                        } else {
                            setChats(chatList);
                            setSelectedChat(chatList[0]);
                        }
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            };
            initUserChats();
        }
        else {
            setChats([]);
            setSelectedChat(null);
        }
    },[user])

    // INITIAL APP LOAD: CHECK SESSION
    useEffect(()=>{
        fetchUser();
    },[])

    // GLOBAL AXIOS INTERCEPTOR FOR UNHANDLED 401 UNAUTHORIZED ERRORS
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    setUser(null);
                    setChats([]);
                    setSelectedChat(null);
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);


    const value = {
        navigate , user , setUser , chats , setChats ,
        fetchUser , selectedChat , setSelectedChat ,theme , setTheme ,
        createNewChat , loadingUser , fetchUsersChats , logout , axios
    }

    return (
        <AppContext.Provider value = {value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);