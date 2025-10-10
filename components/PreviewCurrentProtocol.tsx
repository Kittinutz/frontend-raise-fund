const PreviewCurrentProtocol = ({
  currentCapitalReserve,
  apy,
  totalInvestor,
}: {
  currentCapitalReserve: number;
  apy: number;
  totalInvestor: number;
}) => {
  return (
    <div className="bg-primary p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Current Capital reserve</h2>
          <p className="text-sm">
            {currentCapitalReserve.toLocaleString()} THB
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">APY</h2>
          <p className="text-sm">{apy}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Investor</h2>
          <p className="text-sm">{totalInvestor.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewCurrentProtocol;
