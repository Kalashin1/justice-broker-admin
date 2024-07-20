/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { addDaysToDate, Investment, Plan, User } from "../../../../types";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase-setting";

const InvestmentTable: FC<{
  investments: Investment[];
  getInvestments: (...args: unknown[]) => void;
}> = ({ investments, getInvestments }) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const deleteInvestment = async (id: string) => {
    setIsLoading(true);
    if (confirm("are you sure you want to delete this investment?")) {
      await deleteDoc(doc(db, "investments", id));
      alert("investment deleted");
      getInvestments();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const set_up = async () => {
      const id = localStorage.getItem("user_id");
      if (id) {
        const userDoc = await getDoc(doc(db, "users", id));
        setUser({ id: userDoc.id, ...userDoc.data() } as User);
      }
    };

    set_up();
  }, []);

  const Row = ({
    investment,
    index,
  }: {
    investment: Investment;
    index: number;
  }) => {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [price, setPrice] = useState("");

    useEffect(() => {
      const set_up = async () => {
        const docRef = await getDoc(doc(db, "plans", investment.plan.id));
        const _plan = { id: docRef.id, ...docRef.data() } as Plan;
        setPlan(_plan);
        setPrice(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(investment.earnings ?? 0)
        );
      };
      set_up();
    }, [investment.earnings, investment.plan.id]);

    // console.log(
    //   "date",
    //   parseFloat(investment.createAt) + 60 * 60 * 24 * plan?.duration!
    // );

    const EditAmountModal = ({
      investmentId,
      currentAmount,
      _capital,
    }: {
      investmentId: string;
      currentAmount: number;
      _capital: number;
    }) => {
      const [newAmount, setNewAmount] = useState(currentAmount);
      const [capital, setCapital] = useState(_capital ?? 0);

      const updatePrice = async (id: string) => {
        setIsLoading(true);
        await updateDoc(doc(db, "investments", id), {
          earnings: newAmount.toString(),
          capital: capital,
        });
        setShowEditModal(false);
        alert("investment updated");
        getInvestments();
        setIsLoading(false);
      };
      return (
        <div
          className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full">
              <div className="m-8 my-20 max-w-[400px] mx-auto">
                <div className="mb-8">
                  <h1 className="mb-4 text-3xl font-extrabold">
                    Edit Profit Amount
                  </h1>
                  <div className="">
                    <label className="pl-1 my-2">Profit</label>
                    <input
                      type="number"
                      className="my-2 w-full border py-2 px-6 rounded-xl"
                      defaultValue={currentAmount}
                      onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="">
                    <label className="pl-1 my-2">Capital</label>
                    <input
                      type="number"
                      className="my-2 w-full border py-2 px-6 rounded-xl"
                      defaultValue={capital}
                      onChange={(e) => setCapital(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    className="p-3 bg-black rounded-full text-white w-full font-semibold"
                    onClick={() => updatePrice(investmentId)}
                  >
                    {isLoading ? "...Loading" : "Update Earning"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    console.log("earnings", investment.earnings);
    const [showEditModal, setShowEditModal] = useState(false);

    return (
      <TableRow className={`bg-gray-50`} key={index}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>{investment.status}</TableCell>
        <TableCell>{investment.user.name}</TableCell>
        <TableCell>{investment.plan.title}</TableCell>
        <TableCell>{price}</TableCell>

        <TableCell>
          {addDaysToDate(
            new Date(parseFloat(investment.createAt)),
            plan?.duration!
          ).toDateString()}
        </TableCell>
        {user?.isAdmin && (
          <TableCell className="grid grid-cols-2">
            <button
              className="cursor-pointer bg-green-600 rounded-full flex items-center justify-center h-8 w-8 shadow-md mr"
              onClick={() => {
                setShowEditModal(!showEditModal);
                localStorage.setItem("investment_id", investment.id);
              }}
            >
              <i className="fas fa-edit text-white" />
            </button>
            <button
              className="ml-2 cursor-pointer bg-red-800 rounded-full flex items-center justify-center h-8 w-8 shadow-md"
              onClick={() => deleteInvestment(investment.id)}
            >
              <i className="fas fa-trash text-white" />
            </button>
            {showEditModal && (
              <EditAmountModal
                currentAmount={investment.earnings}
                investmentId={investment.id}
                _capital={investment.capital}
              />
            )}
          </TableCell>
        )}
      </TableRow>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Table className="py-2">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>End Date</TableHead>
            {user?.isAdmin && <TableHead>&nbsp;</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments &&
            investments.map((investment, index) => {
              return <Row investment={investment} index={index} />;
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentTable;
