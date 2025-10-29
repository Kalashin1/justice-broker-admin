import { useEffect, useState } from "react";
import { Investment, User } from "../../../types";
import Layout from "../components/layout";
import InvestmentTable from "./components/investment-table";
import {
  DocumentData,
  Query,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-setting";

const Investments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const user_id = localStorage.getItem("user_id");

  const fetchInvestment = async () => {
    const userRef = await getDoc(doc(db, "users", user_id!));
    if (userRef.exists()) {
      const _user = { id: userRef.id, ...userRef.data() } as User;
      let q: Query<DocumentData, DocumentData>;
      if (_user.isAdmin) {
        q = query(collection(db, "investments"));
      } else {
        q = query(
          collection(db, "investments"),
          where("user.id", "==", user_id)
        );
      }
      const docRefs = await getDocs(q);
      const _investments = docRefs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Investment[];
      setInvestments(_investments);
    }
  };

  useEffect(() => {
    fetchInvestment();
  }, [user_id]);

  return (
    <Layout>
      <div className="lg:px-12 p-4 lg:py-8">
        <h3 className="text-2xl font-bold">Your Investments</h3>
      </div>
      <section className="px-12 py-6 h-screen">
        <div className="bg-white">
          {investments && (
            <InvestmentTable
              getInvestments={fetchInvestment}
              investments={investments}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Investments;
