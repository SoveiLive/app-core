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


const [navbar, setNavbar] = useState<any>()

useEffect(() => {
  window.onscroll = function() {changeNavbar()};

  const navbar = document.getElementById("navbar");

  if(navbar) {
    setNavbar(navbar)
  }
  function changeNavbar() {
    if(navbar) {
      if (window.pageYOffset > navbar.offsetTop) {
        navbar.classList.add("sticky")
      } else {
        navbar.classList.remove("sticky");
      }
    }
  } 
}, []);

  return (
    <main className="text-black">
      <div id="navbar" className="w-screen bg-yellow-50 top-0 basetext flex items-center tbase">
          <div className="flex-none lbase">
            <p className="font-bold">SoveiLive</p>
          </div>
          <div className="grow"></div>
          <div className="flex-none rbase">
            <button className="bg-[#EAB308] px-8 py-2 rounded-2xl text-white">0x123...789</button>
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
            <textarea className="bg-[#EDF2F7] w-full rounded-[10px] h-16 resize-none mt-2"></textarea>
            <div className="mt-2 flex flex-row-reverse">
              <button className="bg-[#EAB308] px-4 py-2 text-xs rounded-md rounded-2xl text-white">Send</button>
            </div>
          </div>

          <div className="box-sh mt-4 rounded-[14px] px-1 pt-1">
            <div className="w-full h-40 relative">
              <Image src="/image/cover.png" fill={true} alt="oui" />
            </div>
            <div className="p-6">
              <p className="font-semibold text-base">Title</p>
              <p className="text-[#425466] text-sm mt-2">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
            </div>
          </div>

          <div className="box-sh mt-4 rounded-[14px] px-1 pt-1">
            <div className="p-6">
              <p className="font-semibold text-base">Title</p>
              <p className="text-[#425466] text-sm mt-2">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
            </div>
          </div>
        </div>

        <div></div>

      </div>
      
      <button onClick={() => get()}>Get</button>
    </main>
  )
}
