import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { nfts, investmentRounds } from "@/lib/mockData";
import {
  ExternalLink,
  Shield,
  Lock,
  Calendar,
  Coins,
  User,
  FileText,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ImageWithFallback from "@/components/figma/ImageWithFallback";

export default async function NFTDetailPage(
  props: PageProps<"/nft/[tokenId]">
) {
  const { tokenId } = await props.params;
  const nft = nfts.find((n) => n.tokenId === tokenId);
  const round = nft ? investmentRounds.find((r) => r.id === nft.roundId) : null;

  if (!nft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>NFT Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The NFT you&apos;re looking for doesn&apos;t exist or hasn&apos;t
              been minted yet.
            </p>
            <Button>Back to Transactions</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (nft.redeemed) {
      return <Badge className="bg-gray-500">Redeemed</Badge>;
    }
    if (nft.transferLocked) {
      return <Badge className="bg-red-500">Locked</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            // Navigate to transactions - you can implement navigation here
            console.log("Navigate to transactions");
          }}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* NFT Image and Status */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1560493676-04071c5f467b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBjYXR0bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjAzNTQwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt={`NFT ${nft.tokenId}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3>CowToken NFT</h3>
                      {getStatusBadge()}
                    </div>
                    <p className="text-2xl text-primary font-mono">
                      {nft.tokenId}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Reward Claimed
                      </span>
                      {nft.rewardClaimed ? (
                        <Badge className="bg-green-500">Yes</Badge>
                      ) : (
                        <Badge className="bg-gray-400">No</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Transfer Locked
                      </span>
                      {nft.transferLocked ? (
                        <Badge className="bg-red-500">Yes</Badge>
                      ) : (
                        <Badge className="bg-green-500">No</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Redeemed
                      </span>
                      {nft.redeemed ? (
                        <Badge className="bg-gray-500">Yes</Badge>
                      ) : (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      window.open(
                        `https://etherscan.io/token/${nft.tokenId}`,
                        "_blank"
                      );
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Blockchain Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-card-header to-card-header/95 text-card-header-foreground rounded-t-lg">
                <CardTitle className="text-2xl text-card-header-foreground">
                  NFT Details
                </CardTitle>
                <CardDescription className="text-card-header-foreground/80">
                  Blockchain-verified token ownership
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Investment Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <CardTitle>Investment Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Round</p>
                    <p className="text-lg">{round?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Price per Token
                    </p>
                    <p className="text-lg text-primary">
                      ${nft.tokePrice.toLocaleString()} USDT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Reward Percentage
                    </p>
                    <p className="text-lg text-primary">
                      {nft.rewardPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Total Tokens in Round
                    </p>
                    <p className="text-lg">{nft.totalTokenOpenInvestment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Purchase Date</p>
                      <p className="text-lg">
                        {new Date(nft.purchaseTimestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Fundraising Close Date
                      </p>
                      <p className="text-lg">
                        {new Date(nft.closeDateInvestment).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Investment End Date
                      </p>
                      <p className="text-lg">
                        {new Date(nft.endDateInvestment).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ownership Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Ownership</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Original Buyer Wallet
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 bg-gray-100 px-4 py-3 rounded text-sm font-mono">
                      {nft.originalBuyer}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(nft.originalBuyer);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    View address on{" "}
                    <a
                      href={`https://etherscan.io/address/${nft.originalBuyer}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Etherscan
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Metadata */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Blockchain Metadata</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    IPFS Metadata Hash
                  </p>
                  <code className="block bg-gray-100 px-4 py-3 rounded text-sm font-mono break-all">
                    {nft.metadata}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    This hash links to immutable metadata stored on IPFS,
                    ensuring transparency and authenticity.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1">Blockchain Verified</h3>
                    <p className="text-sm text-gray-600">
                      This NFT is secured on the blockchain and represents
                      verified ownership of 1 CowToken. All transaction data is
                      immutable and publicly auditable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
