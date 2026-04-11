"use client";

import GoogleAnalytics from "./GoogleAnalytics";
import PageViewTracker from "./PageViewTracker";
import Sidebar from "./Sidebar";
import ChannelTalk from "./ChannelTalk";

export default function ClientShell() {
  return (
    <>
      <GoogleAnalytics />
      <PageViewTracker />
      <Sidebar />
      <ChannelTalk />
    </>
  );
}
