import { fetchTotalFundRaising } from "@/services/web3/FundRaisingContractService";
import { useEffect, useState } from "react";

const useAdmin = () => {
  const [totalFundRaising, setTotalFundRaising] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const total = await fetchTotalFundRaising();
        if (total !== undefined) {
          setTotalFundRaising(Number(total));
        }
      } catch (error) {
        console.error("Error fetching total fund raising:", error);
      }
    };
    fetchData();
  }, []);
  return {
    totalFundRaising,
  };
};

export default useAdmin;
