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
import Link from 'next/link'

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

interface Like {
  id: string;
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
  const [countLike, setCountLike] = useState<any>({});
  const params = useParams()

 async function getData() {
    const temp: any = {}
    async function addLike(id: string) {
      try {
        // didn't get count works atm
        const queryByNameAndCount = '/["like" = "' + id + '"] | limit 100'
        const likes = await queryDoc<Like>(collection, queryByNameAndCount)
        console.log(likes.docs.length)
        temp[id] = likes.docs.length
        setCountLike(temp)
        console.log(countLike)
      } catch(e) {
        console.log(e)
      }
    }
    const queryStr = "/content and /signature and /tags/[** in [\"" + params.slug + "\"]] | limit 10";
    console.log(queryStr)
    const resultSet = (await queryDoc<Post>(collection, queryStr)).docs.map(
      (element) => {
        addLike(element.id)
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

  async function like(id:string) {
    try {
      console.log("clicked")
      console.log(id)
      const accounts: any = await ethereum?.request({
        method: "eth_requestAccounts",
      });
      const account: any = accounts ? accounts[0] : undefined;

      const signature = await ethereum?.request({
        method: "personal_sign",
        params: [
          "liked " + id,
          account
        ],
      });

      const x = await addDoc(collection, {
        like: id
      })
      getData()
    } catch (e) {
      console.log(e);
    }
  }

  function getAuthor(message: string, signature: string) {
    return recoverPersonalSignature({
      data: message,
      signature: signature,
    });
  }

  useEffect(() => {
    const temp: any = {}
    async function addLike(col:any, id: string) {
      try {
        // didn't get count works atm
        const queryByNameAndCount = '/["like" = "' + id + '"] | limit 100'
        const likes = await queryDoc<Like>(col, queryByNameAndCount)
        console.log(likes.docs.length)
        temp[id] = likes.docs.length
        setCountLike(temp)
        console.log(countLike)
      } catch(e) {
        console.log(e)
      }
    }
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
      const queryStr = "/content and /signature and /tags/[** in [\"" + params.slug + "\"]] | limit 10";
      const resultSet = (await queryDoc<Post>(col, queryStr)).docs.map(
        (element) => {
          addLike(col, element.id)
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
      setPosts(resultSet)
      console.log(resultSet)
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
          <div className="box-sh p-8 rounded-2xl">
            <p className="font-semibold">Tags</p>
            <ul>
              <li className="mt-2 underline">
                <Link href="/tag/programming">/Programming</Link>
              </li>
              <li className="my-2 underline">
                <Link href="/tag/blockchain">/Blockchain</Link>
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
                  <div className="pt-2 w-full flex items-center">
                    <p className="flex-none text-sm font-extralight underline"><Link href={"/u/"+item.author}>{item.author.substring(0, 5) + "..." + item.author.substring(item.author.length - 3, item.author.length)}</Link></p>
                    <div className="grow"></div>
                    <span id={item.id} onClick={() => like(item.id)} className="hover:cursor-pointer flex-none flex h-min w-min space-x-1 items-center rounded-full text-rose-600 bg-rose-50 py-1 px-2 text-xs font-medium">
                      <p>{countLike[item.id]}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <p className="float-right"></p>
                    </span>
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