"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"
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

export default function HomePage() {
  const [database, setDatabase] = useState<any>();
  const [collection, setCollection] = useState<any>();
  const [posts, setPosts] = useState<any[]>([]);
  const [ethereum, setEthereum] = useState<any>();
  const params = useParams()

 async function getData() {
    const queryStr = "/content and /signature and /[tag = " + params.slut + "] | limit 10";
    const resultSet = (await queryDoc<Post>(collection, queryStr)).docs.map(
      (element) => {
        return {
          id: element.id,
          content: (element.doc as any).content,
          author: getAuthor(
            (element.doc as any).content,
            (element.doc as any).signature
          ),
        };
      }
    );
    setPosts(resultSet);
  }

  function getAuthor(message: string, signature: string) {
    return recoverPersonalSignature({
      data: message,
      signature: signature,
    });
  }

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

      // get posts
      const queryStr = "/content and /signature and /[tag = " + params.slut + "] | limit 10";
      const resultSet = (await queryDoc<Post>(col, queryStr)).docs.map(
        (element) => {
          return {
            id: element.id,
            content: (element.doc as any).content,
            author: getAuthor(
              (element.doc as any).content,
              (element.doc as any).signature
            ),
          };
        }
      );
      setPosts(resultSet);
      console.log(resultSet);
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
          <div className="box-sh p-8 rounded-2xl">
            <p className="font-semibold">Tags</p>
            <ul>
              <li className="mt-2 underline">
                <a href="/tag/programming">/Programming</a>
              </li>
              <li className="my-2 underline">
                <a href="/tag/blockchain">/Blockchain</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="px-8 bg-[#fafafa] tbase">
         <div className="rounded-2xl box-sh overflow-none">
            {posts.map((item) => (
              <div
                key={item.id}
                className="px-1 pt-1 border-b hover:bg-gray-50"
              >
                <div className="p-6">
                  <article className="prose prose-slate">
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  </article>
                  <div className="pt-2">
                    <p className="text-sm font-extralight"><a href={"/u/"+item.author}>{item.author.substring(0, 5) + "..." + item.author.substring(item.author.length - 3, item.author.length)}</a></p>
                  </div>
                </div>
              </div>
            ))}
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