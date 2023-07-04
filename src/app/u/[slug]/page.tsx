"use client";

import Image from "next/image";
import { useParams } from 'next/navigation'
import { useState, useEffect } from "react";
import {
  createClient,
  createRandomAccount,
  syncAccountNonce,
  getCollection,
} from "db3.js";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Link from 'next/link'
import Connect from "../../components/Connect";

// get variables
const {publicRuntimeConfig} = require('../../../../next.config.js')
const {DATABASE, ROLLUP_NODE, INDEX_NODE} = publicRuntimeConfig

const account = createRandomAccount()

const client = createClient(
  ROLLUP_NODE,
  INDEX_NODE,
  account
)

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function HomePage() {
  const [collection, setCollection] = useState<any>();
  const [ethereum, setEthereum] = useState<any>();
  const params = useParams()

  useEffect(() => {
    async function get_() {
      // get collection
      await syncAccountNonce(client);
      const col = await getCollection(
        DATABASE,
        "o",
        client
      );
      setCollection(col);
   }
    get_();
    if (typeof window !== "undefined") {
      setEthereum(window.ethereum);
    }
  }, [params.slug]);

  return (
    <main className="text-black">
      <div className="main-c h-screen">
        <div className="bg-[#fafafa] px-8">
          <div className="flex-none tbase">
            <p className="font-bold"><Link href="/">SoveiLive</Link></p>
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
              <p className="font-light my-1">&#34;When one wants to be famous, one has to dive gracefully into rivers of the blood of cannon-blasted bodies.&#34;</p>
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
