"use client";
import { useWallet } from "@/contexts/WalletProvider";
import { Button } from "./ui/button";
import { Copy, Menu, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { formatEther } from "viem";
import { Dialog, Text, TextField } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { DialogFooter } from "./ui/dialog";
import { toast } from "sonner";
import useFundingContract from "@/hooks/useFundingContract";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathName = usePathname();
  const mapping = {
    "/": "landing",
    "/rounds": "rounds",
    "/dashboard": "dashboard",
    "/transactions": "transactions",
    "/admin": "admin",
  };
  const currentPage = mapping[pathName as keyof typeof mapping] || "landing";
  const [isOpenDialogWallet, setIsOpenDialogWallet] = useState(false);
  const {
    connectWallet,
    disconnectWallet,
    isConnected,
    currentAddress,
    usdtBalance,
    isOwnerFundingContract,
  } = useWallet();
  const displayWallet = currentAddress
    ? `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`
    : "";
  const displayLong = currentAddress
    ? `${currentAddress.slice(0, 12)}...${currentAddress.slice(-12)}`
    : "";
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <span className="text-xl text-white">🐄</span>
                </div>
                <span className="text-xl text-primary">D&Z Consultants</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
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
                    currentPage === "dashboard"
                      ? "text-primary"
                      : "text-gray-600"
                  }`}
                >
                  Dashboard
                </button>
              </Link>
              <Link href="/transactions">
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
              {isOwnerFundingContract && (
                <Link href="/admin">
                  <button
                    // onClick={() => onNavigate("transactions")}
                    className={`transition-colors hover:text-primary ${
                      currentPage === "admin" ? "text-primary" : "text-gray-600"
                    }`}
                  >
                    Admin
                  </button>
                </Link>
              )}
            </nav>

            {/* Desktop CTA */}
            {isConnected ? (
              <div className="hidden lg:flex items-center gap-4">
                <p>USDT:</p>
                <p className="font-bold">
                  {usdtBalance &&
                    `$ ${Number(formatEther(usdtBalance)).toLocaleString()}`}
                </p>
                <Button
                  onClick={() => setIsOpenDialogWallet(true)}
                  className="bg-gray-200 text-black hover:bg-gray-400"
                >
                  <Wallet />
                  <p>{displayWallet}</p>
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Button
                  onClick={() => connectWallet()}
                  className="bg-primary hover:bg-primary/90"
                >
                  Connect Wallet
                </Button>
              </div>
            )}
            <button
              className="lg:hidden p-2"
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
            <div className="lg:hidden py-4 space-y-3 border-t">
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
              <Link href="/rounds">
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
              </Link>
              <Link href="/dashboard">
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
              </Link>
              <Link href="/transactions">
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
              </Link>
              {isOwnerFundingContract && (
                <Link href="/admin">
                  <button
                    // onClick={() => onNavigate("transactions")}
                    className={`block w-full text-left px-4 py-2 transition-colors ${
                      currentPage === "admin"
                        ? "text-primary bg-primary/10"
                        : "text-gray-600"
                    }`}
                  >
                    Admin
                  </button>
                </Link>
              )}
              <Button
                onClick={() => setIsOpenDialogWallet(true)}
                className="bg-gray-200 w-full text-black hover:bg-gray-400"
              >
                <Wallet />
                <p>{displayWallet}</p>
              </Button>
            </div>
          )}
        </div>
        <Dialog.Root
          open={isOpenDialogWallet}
          onOpenChange={setIsOpenDialogWallet}
        >
          <Dialog.Content className="max-w-xs">
            <Dialog.Title>Wallet</Dialog.Title>
            <Dialog.Description size="2" mb="4"></Dialog.Description>
            <Flex direction="column" gap="3">
              <div className="flex items-center justify-between">
                <div>
                  <Text weight="medium">Wallet Address: </Text>
                  <p>
                    <Text className="text-xs sm:hidden">{displayLong}</Text>
                  </p>
                  <Text className="hidden sm:block text-xs">
                    {currentAddress}
                  </Text>
                </div>
                <Copy
                  onClick={() => {
                    navigator.clipboard.writeText(currentAddress || "");
                    toast.success("Wallet address copied to clipboard");
                  }}
                  className="inline-block ml-2 cursor-pointer"
                />
              </div>
              <div className="">
                <p>My Wallet</p>
                <p className="text-xl font-bold">
                  ${" "}
                  {Number(
                    formatEther(usdtBalance || BigInt(0))
                  ).toLocaleString()}
                </p>
              </div>
            </Flex>
            <DialogFooter>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button onClick={disconnectWallet} color="gray">
                    Logout Wallet
                  </Button>
                </Dialog.Close>

                <Dialog.Close>
                  <Button color="gray">Close</Button>
                </Dialog.Close>
              </Flex>
            </DialogFooter>
          </Dialog.Content>
        </Dialog.Root>
      </header>
    </>
  );
}
