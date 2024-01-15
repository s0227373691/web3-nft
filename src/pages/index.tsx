import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Files from "@/components/Files";
import Metadata from "@/components/Metadata";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [file, setFile] = useState("");
  const [imgCid, setImgCid] = useState("");
  const [metadataCid, setMetadataCid] = useState("");
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef(null);

  const uploadMetadata = async () => {
    const metadata = { askdn: "456", imgCid };
    const json = JSON.stringify(metadata);
    const res = await fetch("/api/metadata", {
      method: "POST",
      body: json,
    });

    const metadataCid = await res.text();
    setMetadataCid(metadataCid);
  };

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      setImgCid(ipfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      setImgCid(json.ipfs_pin_hash);
    } catch (e) {
      console.log(e);
      alert("trouble loading files");
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <code></code>

      <button
        disabled={uploading}
        onClick={() => inputFile.current.click()}
        className="w-[150px] bg-secondary text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <button
        onClick={uploadMetadata}
        className="w-[150px] bg-secondary text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
      >
        {uploading ? "Uploading..." : "Upload metadata"}
      </button>
      {imgCid && <Files cid={imgCid} />}
      {metadataCid && <Metadata cid={metadataCid} />}
    </main>
  );
}
