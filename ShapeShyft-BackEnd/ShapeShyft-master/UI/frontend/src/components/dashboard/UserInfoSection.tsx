import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../ContentRouter";
import urls from "../../composables/urls.json";
import { GET } from "../../composables/api";
import {
  EnvelopeIcon,
  FingerPrintIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Loading from "../common/Loading";
export function UserInfoSection() {
  const [user, setUser] = useState({} as any);
  const [loading, setLoading] = useState(true);

  const { login } = useContext(UserContext);
  useEffect(() => {
    const fetchData = async () => {
      const val = await GET(urls.me, login);
      setUser(val);
      setLoading(false);
    };
    fetchData();
  }, [login]);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap h-full sm:gap-y-1 gap-x-8 text-lg sm:text-3xl">
      <div className="flex items-center min-h-[50px] min-w-[200px]">
        <FingerPrintIcon className="aspect-square h-6 w-6 mr-3 flex-none text-violet-700" />
        {loading ? (
          <div className="mb-2">
            <Loading />
          </div>
        ) : (
          <p>
            {user.first_name} {user.last_name}
          </p>
        )}
      </div>
      <div className="flex items-center min-h-[50px] min-w-[200px]">
        <UserIcon className="aspect-square h-6 w-6 mr-3 flex-none text-violet-700" />
        {loading ? (
          <div className="mb-2">
            <Loading />
          </div>
        ) : (
          <p>{user.phone_number}</p>
        )}
      </div>
      <div className="flex items-center min-h-[50px] min-w-[200px]">
        <EnvelopeIcon className="aspect-square flex-none h-6 w-6 mr-3 mt-2 text-violet-700" />
        {loading ? (
          <div className="mb-2">
            <Loading />
          </div>
        ) : (
          <p>{user.email}</p>
        )}
      </div>
    </div>
  );
}

export default UserInfoSection;
