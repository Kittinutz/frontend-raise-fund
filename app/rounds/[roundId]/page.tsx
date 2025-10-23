import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { fetchRoundByID } from "@/services/web3/fundingContractService";

import RoundDetailInvestment from "@/components/RoundDetail/RoundDetailInvestment";
import Link from "next/link";

export default async function RoundDetailPage(
  props: PageProps<"/rounds/[roundId]">
) {
  const { roundId } = await props.params;

  const initialRoundDetail = await fetchRoundByID(BigInt(roundId));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/rounds">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Rounds
          </Button>
        </Link>

        {/* Round Header */}

        {/* Tabs Section */}
        <RoundDetailInvestment initialRoundDetail={initialRoundDetail} />
      </div>
    </div>
  );
}
