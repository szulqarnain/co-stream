import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./Admin";

const container = document.getElementById("root")!;
const root = createRoot(container);

const client = new Ably.Realtime({
  key: "UGWMYw.klSEdA:6n07eUckXZM10isiBvCH8fMxbHqddhRLPBw7LmnCbNw",
  clientId: "2342343",
});

export default function Apps() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

root.render(
  <AblyProvider client={client}>
    <ChannelProvider channelName="realtime">
      <Apps />
    </ChannelProvider>
  </AblyProvider>
);
