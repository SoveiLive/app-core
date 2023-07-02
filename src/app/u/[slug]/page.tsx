"use client";

import Image from "next/image";
import { useParams } from 'next/navigation'
import { useState, useEffect } from "react";
import {
  createClient,
  createRandomAccount,
  addDoc,
  syncAccountNonce,
  Index,
  getCollection,
  deleteDoc,
  getDatabase,
  IndexType,
  createCollection,
  createFromPrivateKey,
  queryDoc,
} from "db3.js";

import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import { MetaMaskInpageProvider } from "@metamask/providers";
import ReactMarkdown from "react-markdown";
import ReactDom from "react-dom";

const account = createRandomAccount();

const client = createClient(
  "https://rollup.cloud.db3.network",
  "https://index.cloud.db3.network",
  //  "http://127.0.0.1:26619",
  //  "http://127.0.0.1:26639",
  account
);

import Connect from "../../components/Connect";

interface Post {
  content: string;
  signaturee: string;
}

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function HomePage({
  params: { slug: string }
}) {
  const [database, setDatabase] = useState<any>();
  const [collection, setCollection] = useState<any>();
  const [ethereum, setEthereum] = useState<any>();
  const params = useParams()

  useEffect(() => {
    async function get_() {
      // get collection
      await syncAccountNonce(client);
      const col = await getCollection(
        "0x38801fd445898d1851dcf8ed5504840a98434800",
        "o",
        client
      );
      setCollection(col);
   }
    get_();
    if (typeof window !== "undefined") {
      setEthereum(window.ethereum);
    }
  }, []);

  return (
    <main className="text-black">
      <div className="main-c h-screen">
        <div className="bg-[#fafafa] px-8">
          <div className="flex-none tbase">
            <p className="font-bold">SoveiLive</p>
          </div>
        </div>

        <div className="px-8 bg-[#fafafa] tbase">
          <div className="box-sh rounded-2xl mb-4 overflow-hidden">
	    <div className="relative bg-teal-400 h-24">
              <div className="absolute bottom-0 left-4 h-24 w-24 overflow-hidden translate-y-2/4 rounded-full bg-green-400">
                <Image
                  src="/image/profile.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
              </div>
            </div>
	    <div className="p-4 pt-16">
              <p className="font-semibold text-xl">John Doe</p>
              <p className="font-light my-1">"When one wants to be famous, one has to dive gracefully into rivers of the blood of cannon-blasted bodies."</p>
              <p>{params.slug.substring(0, 5) + "..." + params.slug.substring(params.slug.length - 3, params.slug.length)} | View on <a className="text-blue-500" href={"https://etherscan.io/address/"+params.slug} target="blank_">EtherScan</a></p>
            </div>
          </div>
        </div>

        <div className="bg-[#fafafa] px-8">
          <div className="flex-none float-right tbase">
            <Connect />
          </div>
        </div>
      </div>
    </main>
  );
}
