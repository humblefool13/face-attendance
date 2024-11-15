import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
    >
      Back to Home
    </button>
  );
};

export default Back;
