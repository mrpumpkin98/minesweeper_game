import React, { useState } from "react";
import AppInner from "./AppInner";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <>
      <RecoilRoot>
        <AppInner />
      </RecoilRoot>
    </>
  );
}
