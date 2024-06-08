import { useEffect } from "react";
import { useUser } from "../contexts/user-context";

const Profile = () => {
  const { userDetails, setUserDetails } = useUser();

  useEffect(() => {
    // Fetch user details from an API or other source and set them
    const fetchUserDetails = async () => {
      //   const user = await fetchUserFromApi();
      //   setUserDetails(user);
    };

    fetchUserDetails();
  }, [setUserDetails]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userDetails.name}</h1>
      <p>Email: {userDetails.email}</p>
      {/* Render other user details */}
    </div>
  );
};

export default Profile;
