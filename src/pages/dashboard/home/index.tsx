/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import Investments from "../components/investments";
import Layout from "../components/layout";
import Transactions from "../components/transaction-table";
// import CurrentInvestment from "./components/current-investment";
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
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../navigation/constant";
import {
  Investment,
  // Plan,
  Transaction,
  User,
} from "../../../types";
import InvestmentTable from "../investment/components/investment-table";
import CurrentEarnings from "./components/current-earnings";

const Home = () => {
  const [user, setUser] = useState<User>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  // const [plans, setPlans] = useState<Plan[]>([]);

  const navigate = useNavigate();

  const getInvestment = async () => {
    let q: Query<DocumentData, DocumentData>;
    try {
      if (user && user.isAdmin) {
        q = query(collection(db, "investments"));
      } else {
        q = query(
          collection(db, "investments"),
          where("user.id", "==", user?.id)
        );
      }
      const _docRefs = await getDocs(q);
      const _investments = _docRefs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Investment[];
      setInvestments(_investments);
    } catch (error) {
      alert("error getting investments");
    }
  };

  const set_up = async (id: string) => {
    try {
      const docRef = await getDoc(doc(db, "users", id));
      if (docRef.exists()) {
        const _user = { id: docRef.id, ...docRef.data() } as User;
        setUser(_user);
        let q: Query<DocumentData, DocumentData>;
        let q2: Query<DocumentData, DocumentData>;

        if (_user.isAdmin) {
          q = query(collection(db, "transactions"));
          q2 = query(collection(db, "investments"));
        } else {
          q = query(collection(db, "transactions"), where("user.id", "==", id));
          q2 = query(collection(db, "investments"), where("user.id", "==", id));
        }
        const docRefs = await getDocs(q);
        const _transactions = docRefs.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Transaction)
        );
        setTransactions(_transactions);

        const _docRefs = await getDocs(q2);
        const _investments = _docRefs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Investment[];
        setInvestments(_investments);
      }
    } catch (error) {
      alert("error fetching user");
      console.log(error);
      navigate(SCREENS.PROFILE);
    }
  };

  useEffect(() => {
    set_up(localStorage.getItem("user_id")!);
  }, [navigate]);

  return (
    <Layout>
      <section className="bg-gray-100 p-6">
        <CurrentEarnings investments={investments} />
      </section>
      <section className="px-6 my-4 mb-8 py-2">
        <h3 className="text-2xl my-6">Your Investments</h3>
        {/* {investments && <CurrentInvestment plans={investments} />} */}
        {investments && (
          <InvestmentTable
            investments={investments}
            getInvestments={getInvestment}
          />
        )}
      </section>
      <section className="bg-gray-100">
        {transactions && <Transactions transactions={transactions} />}
      </section>
    </Layout>
  );
};

export default Home;
