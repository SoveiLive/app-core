'use client'

import Image from 'next/image'
import { useState } from 'react'
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
  createFromPrivateKey
} from 'db3.js'

const account = createRandomAccount()

const client = createClient(
  "https://rollup.cloud.db3.network",
  "https://index.cloud.db3.network",
//  "http://127.0.0.1:26619",
//  "http://127.0.0.1:26639",
  account
)

export default function Home() {
  const [database, setDatabase] = useState<any>()
  const [collection, setCollection] = useState<any>()

  async function get() {
    await syncAccountNonce(client)
    const col = await getCollection(
      "0xd2d84d491caa901010fc28dd99502503027e5ea5",
      "o",
//      "0x9f1a0159cb55bd342f52d8c680050e5efec23977",
//      "ent",
    client)
    console.log(col)
    setCollection(col)
    
//    const db = await getDatabase("0xd2d84d491caa901010fc28dd99502503027e5ea5", client)
//    setDatabase(db)
//    console.log(db)
  }

  async function add() {
    try {
      console.log(collection)
      const x = await addDoc(collection, {
        name: 'book3',
        author: 'db3 developers',
        tag: 'web3',
        time: 1686285013,
      })
      console.log(x) 
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

  return (
    <main className="text-black">
      <div className="absolute relative basetext flex items-center tbase">

        <div className="flex-none lbase">
          <p className="font-bold">SoveiLive</p>
        </div>

        <div className="grow">
          
        </div>

        <div className="flex-none rbase">
          <button className="bg-[#EAB308] px-8 py-2 rounded-2xl text-white">0x123...789</button>
        </div>

      </div>
      <button onClick={() => get()}>Get</button>
    </main>
  )
}
