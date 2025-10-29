import { useEffect, useState } from "react";
import Layout from "../../components/layout"
import { Investment } from "../../../../types";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase-setting";

const InvestmentDetail = () => {
  const [investment, setInvestment] = useState<Investment|null>(null)
  const {id} = useParams()
 
  useEffect(() => {
    const set_up = async () => {
      if (id) {
        const _doc = await getDoc(doc(db, "investments", id));
        setInvestment({
          id: _doc.id,
          ..._doc.data()
        } as Investment)

      }
    }
    set_up()
  }, [id])
  return (
    <Layout>
      <div className="lg:px-12 p-4 lg:py-8">
        <h3 className="text-2xl font-bold">Your Investment</h3>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <h3 className="font-bold my-4 text-xl">{investment?.user.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capital Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Capital
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">${investment?.capital}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
           
          </div>

          {/* Profit Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Profit
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">${investment?.earnings}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default InvestmentDetail;