import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../src/components/ContentRouter";
import { GET } from "../../../src/composables/api";
import file from "../../../src/composables/urls.json";

const Welcome = () => {
  const [firstName, setFirstName] = useState("");
  const { login } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await GET(file.me, login);
        if (userData && userData.first_name) {
          setFirstName(userData.first_name);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [login]);

  return (
    <div className="">
      <p className="text-6xl font-bold">
        {firstName ? <p>Hi, {firstName}!</p> : <p>Hello!</p>}
      </p>
    </div>
  );
};

export default Welcome;
