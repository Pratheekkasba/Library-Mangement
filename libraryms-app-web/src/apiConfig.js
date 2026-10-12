export const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  const storedUrl = typeof window !== "undefined" ? localStorage.getItem("REACT_APP_API_URL") : null;
  
  if (storedUrl && storedUrl.trim() !== "") {
    return storedUrl.trim().replace(/\/$/, "");
  }
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/$/, "");
  }
  return "http://localhost:8080";
};

export const setApiUrl = (url) => {
  if (url && url.trim() !== "") {
    localStorage.setItem("REACT_APP_API_URL", url.trim().replace(/\/$/, ""));
  } else {
    localStorage.removeItem("REACT_APP_API_URL");
  }
};

const API_BASE_URL = getApiUrl();
export default API_BASE_URL;
