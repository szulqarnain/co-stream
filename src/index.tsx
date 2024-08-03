import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import App from "./App";
import "./index.css";

// const container = document.getElementById("root")!;
// const root = createRoot(container);

// export default function Apps() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route index element={<App />} />
//         <Route path="admin" element={<Admin />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// root.render(
//   <AblyProvider client={client}>
//     <ChannelProvider channelName="realtime">
//       <Apps />
//     </ChannelProvider>
//   </AblyProvider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { Toaster } from "react-hot-toast";

import { nhost } from "./lib/nhost";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new Ably.Realtime({
  key: "UGWMYw.klSEdA:6n07eUckXZM10isiBvCH8fMxbHqddhRLPBw7LmnCbNw",
  clientId: "2342343",
});

root.render(
  <NhostProvider nhost={nhost}>
    <NhostApolloProvider nhost={nhost}>
      <AblyProvider client={client}>
        <ChannelProvider channelName="realtime">
          <App />
        </ChannelProvider>
      </AblyProvider>
    </NhostApolloProvider>
    <Toaster />
  </NhostProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
