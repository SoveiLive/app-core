'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
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
  queryDoc
} from 'db3.js'

import {  recoverPersonalSignature} from '@metamask/eth-sig-util';
import { MetaMaskInpageProvider } from '@metamask/providers';

const account = createRandomAccount()

const client = createClient(
  "https://rollup.cloud.db3.network",
  "https://index.cloud.db3.network",
//  "http://127.0.0.1:26619",
//  "http://127.0.0.1:26639",
  account
)

import Connect from './components/Connect'

interface Post {
  content: string;
  signaturee: string;
}

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

export default function HomePage() {
  const [database, setDatabase] = useState<any>()
  const [collection, setCollection] = useState<any>()
  const [posts, setPosts] = useState<any[]>([])
  const [ethereum, setEthereum] = useState<any>()

  async function add() {
    try {
      const message = (document!.querySelector('#messageform') as HTMLInputElement)!.value

      const accounts: any = await ethereum?.request({ method: 'eth_requestAccounts' })
      const account: any = accounts?accounts[0]:undefined

      const signature = await ethereum?.request({ method: 'personal_sign', params: [ message, account ] })

      const x = await addDoc(collection, {
        content: message,
	signature: signature
      })
      getData()
    } catch(e) {
      console.log(e)
    }
  }

  async function create() {
    const index1:Index = {
      path:'/city',
      indexType: IndexType.StringKey
    }
    const {collection, result} = await createCollection(database, "test_collection3", [index1])
  }

  async function delete_() {
    try {
      const x = await deleteDoc(collection, ["6"])
      console.log(x)
    } catch(e) {
      console.log(e)
    }
  }

  async function getData() {
      const queryStr = '/content and /signature | limit 10'
      const resultSet = (await queryDoc<Post>(collection, queryStr)).docs.map(
        element => {
	  return {
	    id: element.id,
	    content: (element.doc as any).content,
	    author: getAuthor((element.doc as any).content, (element.doc as any).signature)
          }
	}
      )
      setPosts(resultSet)
 }

  async function getAuthor(message: string, signature: string) {
    return await recoverPersonalSignature({
        data: message, 
        signature: signature 
    })
  }

  useEffect(() => {
    async function get_() {
      // get collection
      await syncAccountNonce(client)
      const col = await getCollection("0x38801fd445898d1851dcf8ed5504840a98434800", "o", client)
      setCollection(col)

      // get posts
      const queryStr = '/content and /signature | limit 10'
      const resultSet = (await queryDoc<Post>(col, queryStr)).docs.map(
        element => {
	  return {
	    id: element.id,
	    content: (element.doc as any).content,
	    author: getAuthor((element.doc as any).content, (element.doc as any).signature)
          }
	}
      )
      setPosts(resultSet)
      console.log(resultSet)
    }
    get_()
    if (typeof window !== "undefined") {
      setEthereum(window.ethereum)
    }
  }, [])

  return (
    <main className="text-black">
      <div id="navbar" className="w-screen bg-yellow-50 top-0 basetext flex items-center tbase">
          <div className="flex-none lbase">
            <p className="font-bold">SoveiLive</p>
          </div>
          <div className="grow"></div>
          <div className="flex-none rbase">
            <Connect />
          </div>
      </div>

      <div className="main-c pt-8">
        <div></div>
        <div></div>
        <div></div>

        <div>
          <div className="box-sh p-4 rounded-[14px] ">
            <p className="font-semibold text-base">Send a message</p>
            <p className="text-sm text-[425466]">The message will be sent over the entire network.</p>
            <textarea id="messageform" className="p-2 bg-[#EDF2F7] w-full rounded-[10px] h-16 resize-none mt-2"></textarea>
            <div className="mt-2 flex flex-row-reverse">
              <button onClick={() => add()} className="bg-[#EAB308] px-4 py-2 text-xs rounded-md rounded-2xl text-white">Send</button>
            </div>
          </div>

          {posts.map((item) => (
            <div key={item.id} className="box-sh mt-4 rounded-[14px] px-1 pt-1">
              <div className="p-6">
                <p className="font-semibold text-base">Title</p>
                <p className="text-[#425466] text-sm mt-2">{item.content}</p>
		<div className="pt-2">
		  <p className="text-[#425466] ttext-sm font-extralight">{item.author}</p>
		</div>
              </div>
            </div>
          ))}

          <div className="box-sh mt-4 rounded-[14px] px-1 pt-1">
            <div className="w-full h-40 relative">
              <Image src="/image/cover.png" fill={true} alt="oui" />
            </div>
            <div className="p-6">
              <p className="font-semibold text-base">Title</p>
              <p className="text-[#425466] text-sm mt-2">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </main>
  )
}
