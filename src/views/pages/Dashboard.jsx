import { useNavigate } from 'react-router-dom';
import { mockQueryFlow } from "../../services/mock/mockQueryFlow";
import { auth } from "../../config/firebase";

export const Dashboard = ({ authViewModel }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authViewModel.logout();
    navigate('/login');
  };

  const goToChatbot = () => {
    navigate('/chatbot'); // make sure this route exists
  };
//Mocked test (testbutton) to see queries and results in firestore can be deleted later, Button for it is down below
//
const testFlow = async () => {
  console.log("🟡 TEST FLOW START");

  const uid = authViewModel.user?.uid || auth.currentUser?.uid;

  console.log("🧾 UID CHECK:", {
    fromViewModel: authViewModel.user?.uid,
    fromAuth: auth.currentUser?.uid,
    finalUid: uid
  });

  if (!uid) {
    console.error("❌ No UID available - user not authenticated yet");
    return;
  }

  try {
    console.log("🚀 Calling mockQueryFlow...");

    const result = await mockQueryFlow(uid, "Hello test question");

    console.log("✅ MOCK FLOW DONE");
    console.log("📦 RESULT ID:", result);

  } catch (error) {
    console.error("🔥 ERROR IN MOCK FLOW:", error);
  }
};
//

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>

          <div className="flex gap-3">
            <button
              onClick={goToChatbot}
              className="bg-white border-2 border-black hover:bg-gray-100 text-black font-semibold py-2 px-6 rounded-none transition-colors"
            >
              Open Chatbot
            </button>

            <button
              onClick={handleLogout}
              className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-none transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border-2 border-black p-8 md:p-10">
          <div className="text-center">

            <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-black rounded-full mb-6">
              <span className="text-3xl">✓</span>
            </div>

            <h2 className="text-3xl font-bold text-black mb-3">
              Welcome, {authViewModel.user?.username || 'User'}!
            </h2>

            <p className="text-gray-700 text-lg mb-2">
              You have successfully logged in
            </p>

            <p className="text-gray-600 mb-8">
              Email: <span className="font-semibold text-black">
                {authViewModel.user?.email}
              </span>
            </p>

            {/* User Info Card */}
            <div className="bg-white rounded-none p-6 mt-8 border-2 border-black">
              <h3 className="text-xl font-semibold text-black mb-4">
                Account Information
              </h3>

              <div className="space-y-3 text-left">
                <div className="flex justify-between py-2 border-b-2 border-black">
                  <span className="font-medium">Username:</span>
                  <span className="font-semibold">
                    {authViewModel.user?.username}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b-2 border-black">
                  <span className="font-medium">Email:</span>
                  <span className="font-semibold">
                    {authViewModel.user?.email}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="font-medium">Status:</span>
                  <span className="px-3 py-1 border-2 border-black text-sm font-semibold">
                    Active
                  </span>
                </div>
              </div>

              {/* DataFlow test button, can be deleted after replacing mock implementation */}
              <button
                onClick={testFlow}
                className="bg-black text-white px-4 py-2">
                  Test Firestore Flow</button>

            </div>
            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={goToChatbot}
                className="bg-white border-2 border-black hover:bg-gray-100 text-black font-semibold py-3 px-8 transition-colors"
              >
                Go to Chatbot
              </button>

              <button
                onClick={handleLogout}
                className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-8 transition-colors"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};