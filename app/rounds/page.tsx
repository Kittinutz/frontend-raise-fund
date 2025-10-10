"use client";
import FundingRounds from "@/components/FundingRounds";
import useWallet from "@/hooks/useWallet";

export default function RoundsPage() {
  const { walletClient, currentAddress, setCurrentAddress } = useWallet();

  const handleConnectWallet = async () => {
    try {
      const address = await walletClient?.requestAddresses();
      setCurrentAddress(address ? address[0] : undefined);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      setCurrentAddress(undefined);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                D&Z Abattoir Capital Reserve Protocol
              </h1>
              <p className="text-gray-600 mt-1">Investment Rounds Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              {currentAddress ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Connected: {currentAddress.slice(0, 6)}...
                    {currentAddress.slice(-4)}
                  </div>
                  <button
                    onClick={handleDisconnectWallet}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main>
        <FundingRounds />
      </main>
    </div>
  );
}
