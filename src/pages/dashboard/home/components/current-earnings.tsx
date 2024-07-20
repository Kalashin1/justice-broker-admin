import { FC } from "react";
import { Investment } from "../../../../types";

const CurrentEarnings: FC<{
  investments: Investment[];
}> = ({ investments }) => {
  const InvestmentComponent: FC<{ investment: Investment }> = ({
    investment,
  }) => {
    return (
      <div
        className={`bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 relative`}
      >
        <div className={`p-1 bg-blue-200`}></div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {investment.plan.title}
          </h2>
          <p className="text-gray-600 mb-6 font-bold">
            Capital:{" "}
            {new Intl.NumberFormat("en-US", {
              currency: "USD",
              style: "currency",
            }).format(investment.capital ?? 0)}
          </p>
          Profit:{" "}
          <p className="text-4xl font-bold text-gray-800 mb-6">
            {new Intl.NumberFormat("en-US", {
              currency: "USD",
              style: "currency",
            }).format(investment.earnings ?? 0)}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <!-- Pricing Card 1 --> */}
        {investments &&
          investments.map((investment, index) => (
            <InvestmentComponent key={index} investment={investment} />
          ))}
      </div>
    </div>
  );
};

export default CurrentEarnings;
