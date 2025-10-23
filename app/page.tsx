import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Shield,
  DollarSign,
  Clock,
  ChevronRight,
} from "lucide-react";
import { investmentRounds } from "../lib/mockData";
import ImageWithFallback from "@/components/figma/ImageWithFallback";
import Link from "next/link";

export default function LandingPage() {
  const currentRound = investmentRounds.find((r) => r.status === "Open");
  const progressPercentage = currentRound
    ? (currentRound.tokensSold / currentRound.totalTokens) * 100
    : 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-banner-bg via-[#3d5a6b] to-[#2c3e50] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary text-white hover:bg-primary/90">
                🐄 1 Coin = 1 Cow
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
                Invest in Cattle,
                <br />
                Earn Real Returns
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                A transparent crowdfunding platform where each token represents
                one cow. Earn dividends twice a year with guaranteed principal
                return.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  // onClick={() => onNavigate("rounds")}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Invest Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/rounds">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-gray-500 hover:bg-white hover:text-foreground"
                  >
                    View All Rounds
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681507074841-0143323d7898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBmYXJtJTIwcmFuY2h8ZW58MXx8fHwxNzYwMzUwOTIwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Cattle farm"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              Why Invest in CowToken?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A secure, transparent way to invest in cattle farming with
              predictable returns
            </p>
          </div>

          <div
            data-test-id="cards-cowtoken"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="border-2 hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Regular Dividends</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose between 3% every 6 months or 6% annually. Predictable
                  income streams.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Guaranteed Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get your full investment back at the end of the year plus
                  dividends earned.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-700" />
                </div>
                <CardTitle>Low Minimum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Start investing with just 1 token ($2,000). Accessible to all
                  investors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Short Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  1-year investment cycles. Quick turnaround with 2 rounds per
                  year.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">How CowToken Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent cattle investment in 4 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                1
              </div>
              <h3 className="mb-2">Choose a Round</h3>
              <p className="text-sm text-gray-600">
                Browse active investment rounds and select one that fits your
                goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                2
              </div>
              <h3 className="mb-2">Buy Tokens</h3>
              <p className="text-sm text-gray-600">
                Purchase tokens (1 token = 1 cow). Each token costs $2,000 USDT
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                3
              </div>
              <h3 className="mb-2">Earn Dividends</h3>
              <p className="text-sm text-gray-600">
                Receive dividend payments based on your chosen option
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                4
              </div>
              <h3 className="mb-2">Get Principal Back</h3>
              <p className="text-sm text-gray-600">
                At year-end, receive your principal investment plus all
                dividends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Round Section */}
      {currentRound && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-card-header/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-card-header to-card-header/95 text-card-header-foreground rounded-t-lg">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-2 text-card-header-foreground">
                        {currentRound.name}
                      </CardTitle>
                      <CardDescription className="text-card-header-foreground/80">
                        Current Active Investment Round
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {currentRound.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Dividend Rate
                      </p>
                      <p
                        data-test-id="dividend-rate"
                        className="text-2xl text-primary"
                      >
                        {currentRound.dividendPercentage}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentRound.dividendOption}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Investment
                      </p>
                      <p className="text-2xl text-primary">
                        ${currentRound.totalInvestment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tokens Sold</p>
                      <p className="text-2xl text-primary">
                        {currentRound.tokensSold}/{currentRound.totalTokens}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Round Ends</p>
                      <p className="text-sm text-primary">
                        {new Date(
                          currentRound.roundEndDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tokens Sold</span>
                      <span className="text-gray-900">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-xs text-gray-500 mt-2">
                      {currentRound.tokensRemaining} tokens remaining
                    </p>
                  </div>

                  <div
                    data-test-id="invest-buttons"
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link href="/rounds">
                      <Button variant="outline" className="flex-1" size="lg">
                        View All Rounds
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
