"use client";
import { useWallet } from "@/contexts/WalletProvider";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { formatEther } from "viem";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathName = usePathname();
  const mapping = {
    "/": "landing",
    "/rounds": "rounds",
    "/dashboard": "dashboard",
    "/transactions": "transactions",
  };
  const currentPage = mapping[pathName as keyof typeof mapping] || "landing";
  const {
    connectWallet,
    disconnectWallet,
    isConnected,
    currentAddress,
    usdtBalance,
  } = useWallet();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            // onClick={() => onNavigate("landing")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-xl text-white">🐄</span>
            </div>
            <span className="text-xl text-primary">CowToken</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <button
                // onClick={() => onNavigate("landing")}
                className={`transition-colors hover:text-primary ${
                  currentPage === "landing" ? "text-primary" : "text-gray-600"
                }`}
              >
                Home
              </button>
            </Link>
            <Link href="/rounds">
              <button
                // onClick={() => onNavigate("rounds")}
                className={`transition-colors hover:text-primary ${
                  currentPage === "rounds" ? "text-primary" : "text-gray-600"
                }`}
              >
                All Rounds
              </button>
            </Link>
            <Link href="/dashboard">
              <button
                // onClick={() => onNavigate("dashboard")}
                className={`transition-colors hover:text-primary ${
                  currentPage === "dashboard" ? "text-primary" : "text-gray-600"
                }`}
              >
                Dashboard
              </button>
            </Link>
            <Link href="/dashboard">
              <button
                // onClick={() => onNavigate("transactions")}
                className={`transition-colors hover:text-primary ${
                  currentPage === "transactions"
                    ? "text-primary"
                    : "text-gray-600"
                }`}
              >
                Transactions
              </button>
            </Link>
          </nav>

          {/* Desktop CTA */}
          {isConnected ? (
            <div className="hidden md:flex items-center gap-4">
              <p>{currentAddress}</p>
              <p>USDT Balance: {usdtBalance && formatEther(usdtBalance)}</p>
              <Button
                onClick={() => disconnectWallet()}
                className="bg-primary hover:bg-primary/90"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={() => connectWallet()}
                className="bg-primary hover:bg-primary/90"
              >
                Connect Wallet
              </Button>
            </div>
          )}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <button
              onClick={() => {
                // onNavigate("landing");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition-colors ${
                currentPage === "landing"
                  ? "text-primary bg-primary/10"
                  : "text-gray-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                // onNavigate("rounds");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition-colors ${
                currentPage === "rounds"
                  ? "text-primary bg-primary/10"
                  : "text-gray-600"
              }`}
            >
              All Rounds
            </button>
            <button
              onClick={() => {
                // onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition-colors ${
                currentPage === "dashboard"
                  ? "text-primary bg-primary/10"
                  : "text-gray-600"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                // onNavigate("transactions");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition-colors ${
                currentPage === "transactions"
                  ? "text-primary bg-primary/10"
                  : "text-gray-600"
              }`}
            >
              Transactions
            </button>
            <div className="px-4 pt-2">
              <Button
                // onClick={() => {
                //   onNavigate("rounds");
                //   setMobileMenuOpen(false);
                // }}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Invest Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
