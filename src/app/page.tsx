"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  createClient,
  createRandomAccount,
  addDoc,
  syncAccountNonce,
  getCollection,
  queryDoc,
} from "db3.js";
import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import { MetaMaskInpageProvider } from "@metamask/providers";
import ReactMarkdown from "react-markdown";
import Link from 'next/link'
import Connect from "./components/Connect";

// get variables
const {publicRuntimeConfig} = require('../../next.config.js')
const {DATABASE, ROLLUP_NODE, INDEX_NODE} = publicRuntimeConfig

const account = createRandomAccount()

const client = createClient(
  ROLLUP_NODE,
  INDEX_NODE,
  account
)

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
  const [collection, setCollection] = useState<any>();
  const [posts, setPosts] = useState<any[]>([]);
  const [ethereum, setEthereum] = useState<any>();
  const [countLike, setCountLike] = useState<any>({});

  async function add() {
    try {
      const message = (document!.querySelector(
        "#messageform"
      ) as HTMLInputElement)!.value;
      const tags = (document!.querySelector(
        "#tags"
      ) as HTMLInputElement)!.value.split(' ');

      const accounts: any = await ethereum?.request({
        method: "eth_requestAccounts",
      });
      const account: any = accounts ? accounts[0] : undefined;

      const signature = await ethereum?.request({
        method: "personal_sign",
        params: [message, account],
      });

      const x = await addDoc(collection, {
        content: message,
        signature: signature,
        tags: tags
      })
      getData()
    } catch (e) {
      console.log(e);
    }
  }

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
      } catch(e) {
        console.log(e)
      }
    }
    const queryStr = "/content and /signature | limit 10";
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

  function getAuthor(message: string, signature: string) {
    return recoverPersonalSignature({
      data: message,
      signature: signature,
    });
  }

  async function like(id:string) {
    try {
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
      await addDoc(collection, {
        like: id
      })
      getData()
    } catch (e) {
      console.log(e);
    }
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
      } catch(e) {
        console.log(e)
      }
    }
    async function get_() {
      // get collection
      await syncAccountNonce(client);
      console.log(DATABASE)
      const col = await getCollection(
        DATABASE,
        "o",
        client
      );
      setCollection(col);

      // get posts
      const queryStr = "/content and /signature | limit 10";
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
      setPosts(resultSet);
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
          <div className="box-sh p-4 rounded-2xl mb-4">
            <p className="font-semibold text-base">Send a message</p>
            <p className="text-sm text-[425466]">
              The message will be sent over the entire network.
            </p>
            <textarea
              id="messageform"
              className="p-2 bg-gray-100 w-full rounded-[10px] h-16 resize-none mt-2"
            ></textarea>
            <div className="mt-2 w-full">
              <input
                type="text" id="tags"
                className="bg-gray-100 p-2 rounded-[10px]"
                placeholder="tag1 tag2 etc."
              />
              <button
                onClick={() => add()}
                className="float-right bg-[#EAB308] px-4 py-2 text-xs rounded-md rounded-2xl text-white"
              >
                Send
              </button>
            </div>
          </div>

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
