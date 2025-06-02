/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Investment, Plan, User } from "../../../../types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase-setting";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../../navigation/constant";
import { LoaderContext } from "../../../../App";

type WithdrawalMethod = {
  label: string;
  value: string;
};

const WithdrawalForm = () => {
  const user_id = localStorage.getItem("user_id");
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [user, setUser] = useState<User | null>(null);

  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);


  const [selectedWithdrawalMethod, updateSelectedWithdawalMethod] = useState("")
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [withdrawalMethods, setWithdrawalMethods] = useState<
    WithdrawalMethod[]
  >([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const set_up = async (user_id: string) => {
      const docRef = await getDoc(doc(db, "users", user_id));

      if (docRef.exists()) {
        const _user = { ...docRef.data(), id: docRef.id } as User;

        setUser(_user);
        const bank: WithdrawalMethod = {
          label: "BANK",
          value: "BANK",
        };
        const btc: WithdrawalMethod = {
          label: "BTC",
          value: "BANK",
        };
        setWithdrawalMethods([bank, btc]);
        const q = query(
          collection(db, "investments"),
          where("user.id", "==", docRef.id)
        );
        const docRefs = await getDocs(q);
        const _investments = docRefs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Investment[];
        if (!_investments) {
          alert(
            "You have to investment before you can withdraw, contact admin"
          );
          navigate(SCREENS.DASHBOARD);
        }
        setInvestments(_investments);
      }
    };

    set_up(user_id!);
  }, [navigate, user_id]);

  const requestWithdrawal = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading!(true);
    const {
      amount: { value: amount },
    } = formRef.current!;
    const planRef = await getDoc(
      doc(db, "plans", selectedInvestment?.plan.id!)
    );
    const plan = { id: planRef.id, ...planRef.data() } as Plan;
    const planTotal = parseFloat(plan.price) * (100 / parseFloat(plan.ROI));
    try {
      if (amount > planTotal) {
        alert("Withdrawal amount exceeds total ROI");
        return;
      }
      await addDoc(collection(db, "transactions"), {
        type: "WITHDRAWAL",
        createdAt: new Date().getTime().toString(),
        amount: amount,
        status: "PENDING",
        user: { id: user?.id, name: user?.name, email: user?.email },
        method: {},
      });
      alert("withdrawal Request Logged, awaiting approval");
      navigate(SCREENS.DASHBOARD);
    } catch (error) {
      alert("Error requesting withdrawal, try again later");
      console.log(error);
    } finally {
      setIsLoading!(false);
    }
  };

  return (
    <form
      ref={formRef}
      className="form bg-white p-6 my-10 relative"
      onSubmit={requestWithdrawal}
    >
      <h3 className="text-2xl text-gray-900 font-semibold">
        Request Withdrawal
      </h3>
      <p className="text-gray-600">Request a new withdrawal</p>
      <div className="flex space-x-5 mt-3">
        <div className="w-1/2">
          <Select
            options={investments.map((investment) => ({
              value: investment.id,
              label: investment.plan.title,
            }))}
            onChange={(v) =>
              setSelectedInvestment(
                investments.find((_investment) => _investment.id === v?.value)!
              )
            }
            placeholder="Select the plan you'd like to withdraw from"
          />
        </div>
        <div className="w-1/2">
          <Select
            options={withdrawalMethods}
            onChange={(v) => updateSelectedWithdawalMethod(v?.value!)}
            placeholder="Select Your withdrawal method"
          />
        </div>
      </div>

      <div className="flex py-1 space-x-2">
        {selectedWithdrawalMethod === "BANK" && (
          <div className="w-1/2">
            <input
              type="text"
              name="bank"
              id=""
              placeholder="Enter Bank Account orBlockchain Protocol"
              className="border p-2 w-full mt-3"
            />
          </div>
        )}
        {selectedWithdrawalMethod === "BANK" && (
          <div className="w-1/2">
            <input
              type="text"
              name="account"
              id=""
              placeholder="Enter Account or BTC address"
              className="border p-2 w-full mt-3"
            />
          </div>
        )}
      </div>

     

      <input
        type="number"
        name="amount"
        id=""
        placeholder="Enter withdrawal amount in USD"
        className="border p-2 w-full mt-3"
      />

      <input
        type="submit"
        value={isLoading ? "...Loading" : "Request Withdrawal"}
        disabled={isLoading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3"
      />
    </form>
  );
};

export default WithdrawalForm;
