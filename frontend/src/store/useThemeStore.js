import {create} from "zustand";

 export const useThemeStore=create((set)=>({theme:localStorage.getItem("ET-656-theme")||"night",
    setTheme:(theme)=>{
        localStorage.setItem("ET-656-theme",theme);
        set({theme})
    }
}))