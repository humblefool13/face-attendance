import Menu from "./menu";

const Home = () => {
  return (
    <div className="flex flex-col items-center p-7">
      <h1 className="text-4xl font-semibold text-center text-blue-700 mb-8">
        Face Recognition Attendance System - AWS Project
      </h1>
      <hr className="w-full mb-8 border-t-2 border-gray-300" />
      <Menu />
      <hr className="w-full my-8 border-t-2 border-gray-300" />
      <div className="text-center font-sans text-lg text-gray-700 p-4 bg-white rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-medium mb-2">AWS Services Used:</h2>
        <p>EC2</p>
        <p>Lambda</p>
        <p>API Gateway</p>
        <p>S3</p>
        <p>DynamoDB</p>
        <p>SNS</p>
        <p>Amplify</p>
      </div>
      <hr className="w-full my-8 border-t-2 border-gray-300" />
      2024 © humblefool13.dev
    </div>
  );
};

export default Home;
