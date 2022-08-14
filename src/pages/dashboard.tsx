import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";

import Space, { AddSpace } from "../components/Space";


const SpaceCard: React.FC<{ children: ReactNode }> = (props) => {
  return <div className="p-4 border rounded-lg bg-white">{props.children}</div>;
};

const Slider: React.FC = () => {
  return <></>;
};

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();

  const [balance, setBalance] = useState(20000)
  const [form, setForm] = useState({ name: "", amount: 0, goal: "" });

  const [sliderValue, setSliderValue] = useState(0);

  const spaces = trpc.useQuery(["spaces.getAll"]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <>
      <Head>
        <title>Spaces Dashboard</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <div>{session?.user?.email}</div>
        <div>
          <SpaceCard>General Balance: 20000</SpaceCard>
          <SpaceCard>
            
            <p>{Math.floor(balance * (sliderValue / 100))}</p>
          </SpaceCard>
          <div className="grid grid-cols-3">
            {spaces &&
              spaces.data?.map((space) => (
                <SpaceCard key={space.id}>
                  <Space space={space} />
                </SpaceCard>
              ))}
            <SpaceCard>
              <AddSpace />
            </SpaceCard>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
