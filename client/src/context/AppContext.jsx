import { useState } from "react";
import { createContext } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [credit, setCredit] = useState(false);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false)


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()

  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk()

  //load credit data from the backend
  const loadCreditData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });

      if (data.success) {
        setCredit(data.credits);
        console.log(data.credits);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //remove bg function
  const removeBg = async (image) => {
    try {

      if (!isSignedIn) {
        return openSignIn()
      }

      setImage(image)
      setResultImage(false)

      navigate('/result')

      const token = await getToken()

      const formData = new FormData()

      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/image/remove-bg', formData, { headers: { token } })

      if (data.success) {
        setResultImage(data.resultImage)
        data.creditBalance && setCredit(data.creditBalance)
      } else {
        toast.error(data.message);
        data.creditBalance && setCredit(data.creditBalance)
        if(data.creditBalance === 0){
          navigate('/buy')
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <AppContext.Provider
      value={{
        credit,
        setCredit,
        backendUrl,
        loadCreditData,
        image,
        setImage,
        removeBg,
        resultImage,
        setResultImage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
