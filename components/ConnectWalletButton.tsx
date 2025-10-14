import React from 'react';
import { useWallet } from '@/contexts/WalletProvider';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';

const ConnectWalletButton: React.FC = () => {
  const { 
    isConnected, 
    isConnecting, 
    currentAddress, 
    error, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (error) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-red-600 text-sm">{error}</div>
        <Button onClick={connectWallet} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  if (isConnected && currentAddress) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-md">
          <Wallet className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {formatAddress(currentAddress)}
          </span>
        </div>
        <Button 
          onClick={disconnectWallet} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet} 
      disabled={isConnecting}
      className="flex items-center space-x-2"
    >
      <Wallet className="h-4 w-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </Button>
  );
};

export default ConnectWalletButton;